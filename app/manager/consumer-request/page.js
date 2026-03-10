"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { fetchManagerConsumerRequests } from "@/store/slices/consumerRequestSlice";

export default function ManagerConsumerRequestPage() {
  const { language, t } = useLandingLanguage();
  const dispatch = useDispatch();
  const { requests, isLoading, error } = useSelector((state) => state.consumerRequest);

  useEffect(() => {
    dispatch(fetchManagerConsumerRequests());
  }, [dispatch]);

  const statusClassMap = {
    pending: "border-[#d69e2e] bg-[#fff8e1] text-[#8a5d00]",
    accepted: "border-[#0a7a4c] bg-[#e8f8ef] text-[#0a5a39]",
    rejected: "border-[#c53030] bg-[#ffecec] text-[#8f1d1d]",
  };

  return (
    <main className={`mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8 ${language === "bn" ? "font-bn" : ""}`}>
      <h1 className="text-2xl font-bold text-[var(--color-ink)]">{t.managerConsumerRequestTitle}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {t.managerConsumerRequestSubtitle}
      </p>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerConsumerRequestLoading}
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && requests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerConsumerRequestEmpty}
        </div>
      ) : null}

      {!isLoading && !error && requests.length > 0 ? (
        <section className="mt-6 space-y-3">
          {requests.map((request, index) => {
            const id = request?.id || request?._id || index;
            const consumer = request?.consumer || {};
            const status = (request?.status || "pending").toLowerCase();
            const statusClassName = statusClassMap[status] || statusClassMap.pending;

            return (
              <article key={id} className="rounded-2xl border border-[#102a4322] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {consumer?.name || t.managerUnknownConsumer}
                  </p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClassName}`}>
                    {status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[var(--color-muted)]">Email: {consumer?.email || "-"}</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Phone: {consumer?.phnNumber || "-"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {t.managerConsumerRequestRequestedLabel}: {request?.requestedAt ? new Date(request.requestedAt).toLocaleString() : "-"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {t.managerConsumerRequestReviewedLabel}: {request?.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : "-"}
                </p>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
