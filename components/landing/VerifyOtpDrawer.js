"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  clearAuthStatus,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "@/store/slices/authSlice";
import {
  backToSignupFromVerify,
  closeVerifyOtpDrawer,
  handleVerifySuccessUi,
} from "@/store/slices/drawerSlice";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

export default function VerifyOtpDrawer() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLandingLanguage();
  const { isVerifyOtpDrawerOpen, signupEmail } = useSelector((state) => state.drawer);
  const { isLoading, error, registrationMessage, verifySuccessMessage } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState(signupEmail || "");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setEmail(signupEmail || "");
  }, [signupEmail]);

  const handleVerifySubmit = async (event) => {
    event.preventDefault();

    if (error) {
      dispatch(clearAuthError());
    }

    try {
      await dispatch(
        verifyRegistrationOtp({
          email: email.trim(),
          otp: otp.trim(),
        })
      ).unwrap();

      setOtp("");
      dispatch(handleVerifySuccessUi());
      router.push("/manager");
    } catch {
      // Error is shown from redux state.
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      return;
    }

    if (error) {
      dispatch(clearAuthError());
    }

    await dispatch(
      resendRegistrationOtp({
        email: email.trim(),
      })
    );
  };

  const handleClose = () => {
    dispatch(clearAuthStatus());
    dispatch(closeVerifyOtpDrawer());
  };

  const handleBackToSignup = () => {
    dispatch(clearAuthStatus());
    dispatch(backToSignupFromVerify());
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-30 bg-[#102a4360] transition ${
          isVerifyOtpDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-[#102a431a] bg-[var(--color-paper)] p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
          isVerifyOtpDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.verifyOtpTitle}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{t.verifyOtpSubTitle}</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{t.verifyOtpHint}</p>
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

        <form onSubmit={handleVerifySubmit} className="mt-7 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.signupEmail}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.verifyOtpLabel}</span>
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder={t.verifyOtpPlaceholder}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 tracking-[0.25em] outline-none transition focus:border-[var(--color-brand)]"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? t.verifyOtpSubmitting : t.verifyOtpSubmit}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading || !email.trim()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#102a4325] px-4 py-3 text-sm font-medium text-[var(--color-muted)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiRefreshCw size={14} />
            <span>{t.verifyOtpResend}</span>
          </button>

          {registrationMessage ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {registrationMessage}
            </p>
          ) : null}

          {verifySuccessMessage ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {verifySuccessMessage}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          ) : null}

          <div className="pt-1 text-center text-sm text-[var(--color-muted)]">
            <button
              type="button"
              onClick={handleBackToSignup}
              className="cursor-pointer font-semibold text-[var(--color-brand-strong)] underline decoration-transparent transition hover:decoration-current"
            >
              {t.backToSignup}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
