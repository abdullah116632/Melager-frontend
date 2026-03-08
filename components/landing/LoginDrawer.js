"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { clearAuthError, clearAuthStatus, loginUser } from "@/store/slices/authSlice";

export default function LoginDrawer({
  isOpen,
  t,
  onClose,
  onOpenForgotPassword,
  onOpenSignup,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    dispatch(clearAuthStatus());
    onClose();
  };

  const handleOpenSignup = () => {
    dispatch(clearAuthStatus());
    onOpenSignup();
  };

  const handleForgotPassword = () => {
    dispatch(clearAuthStatus());
    onOpenForgotPassword();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        loginUser({
          email: email.trim(),
          password,
        })
      ).unwrap();

      handleClose();
      router.push("/manager/profile");
    } catch {
      // Error is handled by redux state and displayed in UI.
    }
  };

  const handleEmailChange = (event) => {
    if (error) {
      dispatch(clearAuthError());
    }

    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    if (error) {
      dispatch(clearAuthError());
    }

    setPassword(event.target.value);
  };

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
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.loginTitle}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{t.loginSubTitle}</p>
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

        <form onSubmit={handleLoginSubmit} className="mt-7 space-y-4">
          <ApiErrorAlert error={error} fallbackMessage={t.loginFailed} />

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formEmail}</span>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formPassword}</span>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? t.loginSubmitting : t.loginSubmit}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full cursor-pointer rounded-xl border border-[#102a4325] px-4 py-3 text-sm font-medium text-[var(--color-muted)] transition hover:bg-white"
          >
            {t.forgotPassword}
          </button>

          <div className="pt-1 text-center text-sm text-[var(--color-muted)]">
            <span>{t.noAccount} </span>
            <button
              type="button"
              onClick={handleOpenSignup}
              className="cursor-pointer font-semibold text-[var(--color-brand-strong)] underline decoration-transparent transition hover:decoration-current"
            >
              {t.goToSignup}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
