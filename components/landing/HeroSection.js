"use client";

import { useLandingLanguage } from "@/hooks/useLandingLanguage";

export default function HeroSection() {
  const { t } = useLandingLanguage();

  return (
    <section className="fade-in-up">
      <span className="chip inline-flex rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-brand-strong)]">
        {t.badge}
      </span>
      <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight text-[var(--color-ink)] md:text-5xl">
        {t.heroTitle}
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-7 text-[var(--color-muted)] md:text-lg">
        {t.heroDesc}
      </p>

      <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center">
        <div className="glass-card rounded-2xl px-2 py-4">
          <p className="text-lg font-bold text-[var(--color-brand-strong)]">120+</p>
          <p className="text-xs text-[var(--color-muted)]">{t.statOne}</p>
        </div>
        <div className="glass-card rounded-2xl px-2 py-4">
          <p className="text-lg font-bold text-[var(--color-brand-strong)]">9.8k</p>
          <p className="text-xs text-[var(--color-muted)]">{t.statTwo}</p>
        </div>
        <div className="glass-card rounded-2xl px-2 py-4">
          <p className="text-lg font-bold text-[var(--color-brand-strong)]">24/7</p>
          <p className="text-xs text-[var(--color-muted)]">{t.statThree}</p>
        </div>
      </div>
    </section>
  );
}
