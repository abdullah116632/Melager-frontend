export default function LandingNavbar({
  t,
  language,
  onLanguageChange,
  onOpenLogin,
  onOpenSignup,
}) {
  return (
    <header className="relative z-10 border-b border-[#102a4315] bg-[#fdf8efc9] backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-brand)] text-sm font-bold text-white">
            MM
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--color-brand-strong)]">
              Melager
            </p>
            <p className="text-xs text-[var(--color-muted)]">{t.badge}</p>
          </div>
        </div>

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
              onClick={() => onLanguageChange("bn")}
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
              onClick={() => onLanguageChange("en")}
              className={`rounded-full px-3 py-1.5 transition ${
                language === "en"
                  ? "cursor-pointer bg-[var(--color-brand)] text-white"
                  : "cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenLogin}
            className="hidden cursor-pointer rounded-full border border-[#102a4325] px-4 py-2 text-sm font-semibold text-[var(--color-brand-strong)] transition hover:bg-white/70 sm:block"
          >
            {t.nav.login}
          </button>

          <button
            type="button"
            onClick={onOpenSignup}
            className="cursor-pointer rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#102a43] transition hover:brightness-95"
          >
            {t.nav.signup}
          </button>
        </div>
      </nav>
    </header>
  );
}
