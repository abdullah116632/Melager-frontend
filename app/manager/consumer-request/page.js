"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import {
  acceptConsumerRequest,
  fetchManagerConsumerRequests,
  rejectConsumerRequest,
} from "@/store/slices/consumerRequestSlice";

export default function ManagerConsumerRequestPage() {
  const { language, t } = useLandingLanguage();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    requestId: null,
    action: null,
  });
  const {
    requests,
    isLoading,
    error,
    acceptLoadingById,
    acceptErrorById,
    rejectLoadingById,
    rejectErrorById,
  } = useSelector((state) => state.consumerRequest);

  useEffect(() => {
    dispatch(fetchManagerConsumerRequests());
  }, [dispatch]);

  const statusClassMap = {
    pending: "border-[#d69e2e] bg-[#fff8e1] text-[#8a5d00]",
    accepted: "border-[#0a7a4c] bg-[#e8f8ef] text-[#0a5a39]",
    rejected: "border-[#c53030] bg-[#ffecec] text-[#8f1d1d]",
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await dispatch(acceptConsumerRequest(requestId)).unwrap();
    } catch {
      // Per-request error is displayed from redux state.
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await dispatch(rejectConsumerRequest(requestId)).unwrap();
    } catch {
      // Per-request error is displayed from redux state.
    }
  };

  const openConfirmation = (action, requestId) => {
    setConfirmation({ isOpen: true, requestId, action });
  };

  const closeConfirmation = () => {
    setConfirmation({ isOpen: false, requestId: null, action: null });
  };

  const handleConfirmAction = async () => {
    if (!confirmation.requestId || !confirmation.action) {
      closeConfirmation();
      return;
    }

    if (confirmation.action === "accept") {
      await handleAcceptRequest(confirmation.requestId);
    }

    if (confirmation.action === "reject") {
      await handleRejectRequest(confirmation.requestId);
    }

    closeConfirmation();
  };

  const isConfirming =
    confirmation.action === "accept"
      ? Boolean(acceptLoadingById[confirmation.requestId])
      : Boolean(rejectLoadingById[confirmation.requestId]);

  const confirmationTitle =
    confirmation.action === "accept"
      ? t.managerConsumerRequestConfirmAcceptTitle
      : t.managerConsumerRequestConfirmRejectTitle;
  const confirmationDescription =
    confirmation.action === "accept"
      ? t.managerConsumerRequestConfirmAcceptDescription
      : t.managerConsumerRequestConfirmRejectDescription;

  const filteredRequests = requests.filter((request) => {
    const status = (request?.status || "pending").toLowerCase();
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return matchesStatus;
    }

    const consumerEmail = String(request?.consumer?.email || "").toLowerCase();
    const consumerPhone = String(request?.consumer?.phnNumber || "").toLowerCase();
    const matchesSearch =
      consumerEmail.includes(normalizedQuery) || consumerPhone.includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });

  return (
    <main className={`mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8 ${language === "bn" ? "font-bn" : ""}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">{t.managerConsumerRequestTitle}</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {t.managerConsumerRequestSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:min-w-[260px]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {t.managerConsumerRequestSearchLabel}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.managerConsumerRequestSearchPlaceholder}
              className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#102a43]"
            />
          </div>

          <div className="sm:min-w-[220px]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {t.managerConsumerRequestFilterLabel}
            </label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="cursor-pointer w-full rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#102a43]"
            >
              <option value="all">{t.managerConsumerRequestFilterAll}</option>
              <option value="pending">{t.managerConsumerRequestFilterPending}</option>
              <option value="accepted">{t.managerConsumerRequestFilterAccepted}</option>
              <option value="rejected">{t.managerConsumerRequestFilterRejected}</option>
            </select>
          </div>
        </div>
      </div>

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

      {!isLoading && !error && filteredRequests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerConsumerRequestEmpty}
        </div>
      ) : null}

      {!isLoading && !error && filteredRequests.length > 0 ? (
        <section className="mt-6 space-y-3">
          {filteredRequests.map((request, index) => {
            const id = request?.id || request?._id || index;
            const consumer = request?.consumer || {};
            const status = (request?.status || "pending").toLowerCase();
            const statusClassName = statusClassMap[status] || statusClassMap.pending;
            const isAccepting = Boolean(acceptLoadingById[id]);
            const acceptError = acceptErrorById[id];
            const isRejecting = Boolean(rejectLoadingById[id]);
            const rejectError = rejectErrorById[id];

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

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openConfirmation("accept", id)}
                    disabled={isAccepting || status === "accepted"}
                    className="cursor-pointer rounded-lg border border-[#0a7a4c] bg-[#e8f8ef] px-3 py-1.5 text-xs font-semibold text-[#0a5a39] transition hover:bg-[#d9f2e3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAccepting ? t.managerConsumerRequestAccepting : t.managerConsumerRequestAccept}
                  </button>
                  <button
                    type="button"
                    onClick={() => openConfirmation("reject", id)}
                    disabled={isRejecting || status === "rejected"}
                    className="cursor-pointer rounded-lg border border-[#c53030] bg-[#ffecec] px-3 py-1.5 text-xs font-semibold text-[#8f1d1d] transition hover:bg-[#ffdede] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRejecting ? t.managerConsumerRequestRejecting : t.managerConsumerRequestReject}
                  </button>
                </div>

                {acceptError ? (
                  <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                    {acceptError}
                  </p>
                ) : null}

                {rejectError ? (
                  <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                    {rejectError}
                  </p>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}

      {confirmation.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-bold text-[var(--color-ink)]">{confirmationTitle}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{confirmationDescription}</p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isConfirming}
                className="cursor-pointer rounded-lg border border-[#d9e2ec] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t.managerConsumerRequestConfirmCancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isConfirming}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmation.action === "accept"
                    ? "bg-[#0a7a4c] hover:bg-[#08653f]"
                    : "bg-[#c53030] hover:bg-[#a42828]"
                }`}
              >
                {isConfirming
                  ? confirmation.action === "accept"
                    ? t.managerConsumerRequestAccepting
                    : t.managerConsumerRequestRejecting
                  : confirmation.action === "accept"
                    ? t.managerConsumerRequestConfirmAcceptButton
                    : t.managerConsumerRequestConfirmRejectButton}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
