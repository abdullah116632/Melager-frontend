"use client";

import Image from "next/image";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { openLoginDrawer, openSignupDrawer } from "@/store/slices/drawerSlice";

export default function LandingNavbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasConsumerSession = useSelector((state) => state.consumer.hasConsumerSession);
  const { hasMounted, language, t, handleLanguage } = useLandingLanguage();

  return (
    <header className="relative z-10 border-b border-[#102a4315] bg-[#fdf8efc9] backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex cursor-pointer items-center gap-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white">
            <Image
              src="/logo/logo1.png"
              alt="Melager logo"
              width={40}
              height={40}
              className="h-10 w-10 scale-125 object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--color-brand-strong)]">
              Melager
            </p>
            <p className="text-xs text-[var(--color-muted)]">{t.badge}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-[var(--color-muted)] md:flex">
          <a href="#features" className="cursor-pointer transition hover:text-[var(--color-brand-strong)]">
            {t.nav.features}
          </a>
          <a href="#pricing" className="cursor-pointer transition hover:text-[var(--color-brand-strong)]">
            {t.nav.pricing}
          </a>
          <a href="#support" className="cursor-pointer transition hover:text-[var(--color-brand-strong)]">
            {t.nav.support}
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="chip flex items-center rounded-full p-1 text-xs">
            <button
              type="button"
              onClick={() => handleLanguage("bn")}
              className={`rounded-full px-3 py-1.5 transition ${
                language === "bn"
                  ? "cursor-pointer bg-[var(--color-brand)] text-white"
                  : "cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => handleLanguage("en")}
              className={`rounded-full px-3 py-1.5 transition ${
                language === "en"
                  ? "cursor-pointer bg-[var(--color-brand)] text-white"
                  : "cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              English
            </button>
          </div>

          {hasConsumerSession ? (
            <Link
              href="/messes"
              className="cursor-pointer rounded-full border border-[#102a4325] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-brand-strong)] transition hover:border-[var(--color-brand)]"
            >
              {t.nav.myScore}
            </Link>
          ) : null}

          {hasMounted && isAuthenticated ? (
            <Link
              href="/manager"
              className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#102a4325] bg-white text-[var(--color-brand-strong)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              aria-label="Go to profile"
            >
              <MdAdminPanelSettings size={18} />
              <span className="absolute -right-3 -top-2 rounded-full bg-[#0b5e57] px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide text-white">
                Manager
              </span>
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => dispatch(openLoginDrawer())}
                className="hidden cursor-pointer rounded-full border border-[#102a4325] px-4 py-2 text-sm font-semibold text-[var(--color-brand-strong)] transition hover:bg-white/70 sm:block"
              >
                {t.nav.login}
              </button>

              <button
                type="button"
                onClick={() => dispatch(openSignupDrawer())}
                className="cursor-pointer rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#102a43] transition hover:brightness-95"
              >
                {t.nav.signup}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
