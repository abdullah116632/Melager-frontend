"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMemberDrawer from "@/components/manager/AddMemberDrawer";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { fetchManagerMembers } from "@/store/slices/managerMemberSlice";

export default function ManagerConsumersPage() {
  const dispatch = useDispatch();
  const { language, t } = useLandingLanguage();
  const [isAddMemberDrawerOpen, setIsAddMemberDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { members, membersLoading, membersError } = useSelector((state) => state.messMember);

  useEffect(() => {
    dispatch(fetchManagerMembers());
  }, [dispatch]);

  const filteredMembers = members.filter((member) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    const consumerEmail = String(member?.consumer?.email || "").toLowerCase();
    const consumerPhone = String(member?.consumer?.phnNumber || "").toLowerCase();

    return consumerEmail.includes(normalizedQuery) || consumerPhone.includes(normalizedQuery);
  });

  return (
    <main className={`mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8 ${language === "bn" ? "font-bn" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">{t.managerMembersTitle}</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
          <div className="w-full sm:w-[260px]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {t.managerMembersSearchLabel}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.managerMembersSearchPlaceholder}
              className="w-full rounded-lg border border-[#d9e2ec] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#102a43]"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddMemberDrawerOpen(true)}
            className="inline-block cursor-pointer rounded-xl border border-[#0b5e5735] bg-white px-4 py-2 text-sm font-semibold text-[#0a5a39] transition hover:bg-[#edf8f7]"
          >
            {t.managerAddMemberButton}
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        {t.managerMembersSubtitle}
      </p>

      <AddMemberDrawer
        isOpen={isAddMemberDrawerOpen}
        onClose={() => setIsAddMemberDrawerOpen(false)}
      />

      {membersLoading ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerMembersLoading}
        </div>
      ) : null}

      {!membersLoading && membersError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {membersError}
        </div>
      ) : null}

      {!membersLoading && !membersError && filteredMembers.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerMembersEmpty}
        </div>
      ) : null}

      {!membersLoading && !membersError && filteredMembers.length > 0 ? (
        <section className="mt-6 space-y-3">
          {filteredMembers.map((member, index) => {
            const id = member?.id || member?._id || index;
            const consumer = member?.consumer || {};
            const joinedAt = member?.joinedAt;

            return (
              <article key={id} className="rounded-2xl border border-[#102a4322] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {consumer?.name || t.managerUnknownConsumer}
                  </p>
                  <span className="rounded-full border border-[#0a7a4c] bg-[#e8f8ef] px-3 py-1 text-xs font-semibold text-[#0a5a39]">
                    {t.managerActiveBadge}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[var(--color-muted)]">{t.searchResultEmail}: {consumer?.email || "-"}</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {t.searchResultPhone}: {consumer?.phnNumber || "-"}
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
