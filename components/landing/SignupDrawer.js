"use client";

import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

export default function SignupDrawer({ isOpen, t, onClose, onOpenLogin }) {
  const [formData, setFormData] = useState({
    nameOfMess: "",
    phnNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordError = useMemo(() => {
    if (!formData.password && !formData.confirmPassword) {
      return "";
    }

    if (formData.password.length > 0 && formData.password.length < 6) {
      return t.passwordShort;
    }

    if (
      formData.confirmPassword.length > 0 &&
      formData.password !== formData.confirmPassword
    ) {
      return t.passwordMismatch;
    }

    return "";
  }, [formData.password, formData.confirmPassword, t.passwordMismatch, t.passwordShort]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[#102a4360] transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-[#102a431a] bg-[var(--color-paper)] p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.signupTitle}</h2>
            <p id="support" className="mt-1 text-sm text-[var(--color-muted)]">
              {t.signupSubTitle}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{t.signupSchemaHint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] text-[var(--color-muted)] transition hover:bg-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSignupSubmit} className="mt-7 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupMessName}</span>
            <input
              type="text"
              value={formData.nameOfMess}
              onChange={(event) => handleFieldChange("nameOfMess", event.target.value)}
              placeholder={t.signupMessNamePlaceholder}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupPhone}</span>
            <input
              type="tel"
              value={formData.phnNumber}
              onChange={(event) => handleFieldChange("phnNumber", event.target.value)}
              placeholder={t.signupPhonePlaceholder}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupEmail}</span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleFieldChange("email", event.target.value)}
              placeholder={t.signupEmailPlaceholder}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupPassword}</span>
            <input
              type="password"
              value={formData.password}
              onChange={(event) => handleFieldChange("password", event.target.value)}
              minLength={6}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
            <span className="mt-1 block text-xs text-[var(--color-muted)]">{t.signupPasswordHint}</span>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupConfirmPassword}</span>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(event) =>
                handleFieldChange("confirmPassword", event.target.value)
              }
              minLength={6}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          {passwordError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {passwordError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!!passwordError}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
          >
            {t.formSubmit}
          </button>

          <p className="text-center text-xs text-[var(--color-muted)]">{t.signupSubmitHint}</p>

          <div className="pt-1 text-center text-sm text-[var(--color-muted)]">
            <span>{t.haveAccount} </span>
            <button
              type="button"
              onClick={onOpenLogin}
              className="cursor-pointer font-semibold text-[var(--color-brand-strong)] underline decoration-transparent transition hover:decoration-current"
            >
              {t.goToLogin}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
