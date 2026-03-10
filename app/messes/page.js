"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { fetchMyMesses } from "@/store/slices/messMemberSlice";

export default function MessesPage() {
  const dispatch = useDispatch();
  const { language, t } = useLandingLanguage();
  const { messes, isLoading, error } = useSelector((state) => state.messMember);

  useEffect(() => {
    dispatch(fetchMyMesses());
  }, [dispatch]);

  return (
    <main className={`mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8 ${language === "bn" ? "font-bn" : ""}`}>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">{t.messesTitle}</h1>
          <Link
            href="/messes/my-request"
            className="inline-block rounded-xl border border-[#0b5e5735] bg-white px-4 py-2 text-sm font-semibold text-[#0a5a39] transition hover:bg-[#edf8f7]"
          >
            {t.messesCheckMyRequest}
          </Link>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {t.messesSubtitle}
        </p>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          {t.messesLoading}
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && messes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          {t.messesEmptyMembership}
        </div>
      ) : null}

      {!isLoading && !error && messes.length > 0 ? (
        <section className="mt-6 space-y-3">
          {messes.map((membership, index) => {
            const id = membership?.id || membership?._id || index;
            const manager = membership?.manager || {};
            const joinedAt = membership?.joinedAt;

            return (
              <article key={id} className="rounded-2xl border border-[#0b5e5735] bg-[#f2faf9] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {manager?.nameOfMess || "Unknown Mess"}
                  </p>
                  <span className="rounded-full border border-[#0a7a4c] bg-[#e8f8ef] px-3 py-1 text-xs font-semibold text-[#0a5a39]">
                    {t.messesActiveMemberBadge}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[var(--color-muted)]">Email: {manager?.email || "-"}</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Phone: {manager?.phnNumber || "-"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {t.messesJoinedLabel}: {joinedAt ? new Date(joinedAt).toLocaleDateString() : "-"}
                </p>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
