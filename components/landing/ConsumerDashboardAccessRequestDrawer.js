"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { submitConsumerAccess } from "@/store/slices/consumerSlice";
import { closeAccessDrawer } from "@/store/slices/drawerSlice";

export default function ConsumerDashboardAccessRequestDrawer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLandingLanguage();
  const [identifier, setIdentifier] = useState("");
  const { isAccessDrawerOpen, accessTargetMessName } = useSelector((state) => state.drawer);
  const { accessError, isAccessSubmitting } = useSelector((state) => state.consumer);

  const handleClose = () => {
    setIdentifier("");
    dispatch(closeAccessDrawer());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(
        submitConsumerAccess({
          identifier,
          requiredIdentifierMessage: t.accessRequired,
          invalidMessSelectionMessage: t.accessInvalidMess,
          requestNotAcceptedMessage: t.accessNotAccepted,
          accessFailedMessage: t.accessFailed,
        })
      ).unwrap();

      dispatch(closeAccessDrawer());
        setIdentifier("");
      router.push(`/consumer/dashboard/${result.managerId}`);
    } catch {
      // Access error message is stored in redux state.
    }
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-[#102a4360] transition ${
          isAccessDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#102a431a] bg-[var(--color-paper)] p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
          isAccessDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.accessDrawerTitle}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {t.accessDrawerSubTitle}: {accessTargetMessName || "-"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] text-[var(--color-muted)] transition hover:bg-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.accessIdentifierLabel}</span>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              placeholder={t.accessIdentifierPlaceholder}
              disabled={isAccessSubmitting}
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          {accessError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {accessError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isAccessSubmitting}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAccessSubmitting ? t.accessSubmitting : t.accessSubmit}
          </button>
        </form>
      </aside>
    </>
  );
}
