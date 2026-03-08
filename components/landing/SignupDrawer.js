"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import {
  clearAuthError,
  clearAuthStatus,
  registerUser,
} from "@/store/slices/authSlice";

export default function SignupDrawer({
  isOpen,
  t,
  onClose,
  onOpenLogin,
  onSignupSuccess,
}) {
  const dispatch = useDispatch();
  const { isLoading, error, registrationMessage } = useSelector((state) => state.auth);
  const apiErrorRef = useRef(null);

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

  const phoneError = useMemo(() => {
    if (!formData.phnNumber) {
      return "";
    }

    return /^\d{11}$/.test(formData.phnNumber) ? "" : t.phoneLengthError;
  }, [formData.phnNumber, t.phoneLengthError]);

  const emailError = useMemo(() => {
    if (!formData.email) {
      return "";
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? ""
      : t.emailInvalidError;
  }, [formData.email, t.emailInvalidError]);

  const handleFieldChange = (field, value) => {
    if (error) {
      dispatch(clearAuthError());
    }

    const nextValue =
      field === "phnNumber" ? value.replace(/\D/g, "").slice(0, 11) : value;

    setFormData((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    if (passwordError || phoneError || emailError) {
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          nameOfMess: formData.nameOfMess.trim(),
          phnNumber: formData.phnNumber.trim(),
          email: formData.email.trim(),
          password: formData.password,
        })
      ).unwrap();

      if (onSignupSuccess) {
        onSignupSuccess({
          email: result?.email || formData.email.trim(),
          message: result?.message || "",
          token: result?.token || null,
        });
      }
    } catch {
      // Error is handled by redux state and displayed in UI.
    }
  };

  const handleClose = () => {
    dispatch(clearAuthStatus());
    onClose();
  };

  const handleOpenLogin = () => {
    dispatch(clearAuthStatus());
    onOpenLogin();
  };

  useEffect(() => {
    if (error && apiErrorRef.current) {
      apiErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  return (
    <>
      <div
        onClick={handleClose}
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
            onClick={handleClose}
            aria-label={t.close}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] text-[var(--color-muted)] transition hover:bg-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSignupSubmit} className="mt-7 space-y-4">
          <div ref={apiErrorRef}>
            <ApiErrorAlert error={error} fallbackMessage={t.registrationFailed} />
          </div>

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
              inputMode="numeric"
              value={formData.phnNumber}
              onChange={(event) => handleFieldChange("phnNumber", event.target.value)}
              placeholder={t.signupPhonePlaceholder}
              pattern="[0-9]{11}"
              minLength={11}
              maxLength={11}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          {phoneError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {phoneError}
            </p>
          ) : null}

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

          {emailError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {emailError}
            </p>
          ) : null}

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
            disabled={!!passwordError || !!phoneError || !!emailError || isLoading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? t.signupSubmitting : t.formSubmit}
          </button>

          {registrationMessage ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {registrationMessage}
            </p>
          ) : null}
          <p className="text-center text-xs text-[var(--color-muted)]">{t.signupSubmitHint}</p>

          <div className="pt-1 text-center text-sm text-[var(--color-muted)]">
            <span>{t.haveAccount} </span>
            <button
              type="button"
              onClick={handleOpenLogin}
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
