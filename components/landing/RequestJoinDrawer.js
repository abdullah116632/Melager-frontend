"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { requestJoinMessApi } from "@/services/consumerService";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { closeRequestDrawer } from "@/store/slices/drawerSlice";

export default function RequestJoinDrawer() {
  const dispatch = useDispatch();
  const { t } = useLandingLanguage();
  const { isRequestDrawerOpen, selectedMessName, selectedManagerId } = useSelector((state) => state.drawer);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isRequestDrawerOpen) {
      setName("");
      setPhone("");
      setEmail("");
      setNote("");
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError("");
    }
  }, [isRequestDrawerOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedManagerId) {
      setSubmitError(t.requestInvalidManager);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await requestJoinMessApi({
        managerId: selectedManagerId,
        name: name.trim(),
        phnNumber: phone.trim(),
        email: email.trim(),
        note: note.trim(),
      });

      setIsSubmitted(true);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        t.requestFailed;

      setSubmitError(message);
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(closeRequestDrawer());
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-[#102a4360] transition ${
          isRequestDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#102a431a] bg-[var(--color-paper)] p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
          isRequestDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.requestDrawerTitle}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {t.requestDrawerSubTitle}: {selectedMessName || "-"}
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

        {isSubmitted ? (
          <div className="mt-7 rounded-xl border border-[#0a4f4940] bg-[#e8f6f4] p-4 text-sm text-[#0b5e57]">
            {t.requestSuccess}
          </div>
        ) : null}

        {submitError ? (
          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formName}</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formPhone}</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isSubmitting}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formEmail}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.requestNoteLabel}</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={isSubmitting}
              rows={3}
              placeholder={t.requestNotePlaceholder}
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t.requestSubmitting : t.requestSubmit}
          </button>
        </form>
      </aside>
    </>
  );
}
