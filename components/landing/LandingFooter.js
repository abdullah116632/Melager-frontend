"use client";

import { useState } from "react";
import {
  FiCode,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiX,
} from "react-icons/fi";

const socialIcons = [FiFacebook, FiInstagram, FiLinkedin];

export default function LandingFooter({ t }) {
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);

  return (
    <footer className="relative z-10 mx-auto mt-8 w-full max-w-6xl px-4 pb-10 md:px-8">
      <div className="overflow-hidden rounded-3xl border border-[#102a4322] bg-[#fff7eaee] shadow-[0_24px_56px_rgba(16,42,67,0.12)]">
        <div className="grid gap-8 px-5 py-8 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          <section>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-brand)] text-sm font-bold text-white">
                ML
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-ink)]">Melager</h3>
                <p className="text-xs text-[var(--color-muted)]">{t.badge}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
              {t.footerBrandDescription}
            </p>

            <div className="mt-4 flex items-center gap-2">
              {socialIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] bg-white text-[var(--color-muted)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-semibold tracking-wide text-[var(--color-ink)]">
              {t.footerQuickLinksTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              <li>
                <a className="transition hover:text-[var(--color-brand)]" href="#features">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a className="transition hover:text-[var(--color-brand)]" href="#pricing">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a className="transition hover:text-[var(--color-brand)]" href="#support">
                  {t.nav.support}
                </a>
              </li>
              <li>
                <a className="transition hover:text-[var(--color-brand)]" href="#">
                  {t.nav.signup}
                </a>
              </li>
            </ul>
          </section>

          <section id="support">
            <h4 className="text-sm font-semibold tracking-wide text-[var(--color-ink)]">
              {t.footerContactTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-0.5" size={15} />
                <span>{t.footerAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={15} />
                <span>{t.footerPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={15} />
                <span>{t.footerEmail}</span>
              </li>
            </ul>
          </section>

          <section id="pricing">
            <h4 className="text-sm font-semibold tracking-wide text-[var(--color-ink)]">
              {t.footerNewsletterTitle}
            </h4>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{t.footerNewsletterDesc}</p>

            <form className="mt-4 flex items-center gap-2">
              <input
                type="email"
                placeholder={t.footerNewsletterPlaceholder}
                className="w-full rounded-xl border border-[#102a4328] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-brand)]"
              />
              <button
                type="button"
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-[var(--color-brand)] text-white transition hover:bg-[var(--color-brand-strong)]"
              >
                <FiSend size={16} />
              </button>
            </form>
          </section>
        </div>

        <div className="border-t border-[#102a431a] bg-[#fff2dd9f] px-5 py-3 md:px-8">
          <div className="flex flex-col gap-2 text-xs text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
            <p>{t.footerBottom}</p>
            <button
              type="button"
              onClick={() => setIsTeamDrawerOpen(true)}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-[#102a4328] bg-white px-3 py-1 font-semibold text-[var(--color-brand-strong)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              <FiCode size={14} />
              <span>{t.developerTag}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        onClick={() => setIsTeamDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-[#102a4373] transition ${
          isTeamDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-5xl rounded-t-3xl border border-[#102a4322] bg-[var(--color-paper)] shadow-[0_-20px_48px_rgba(16,42,67,0.18)] transition-transform duration-300 ${
          isTeamDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-h-[80vh] overflow-y-auto px-5 pb-7 pt-5 md:px-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-ink)]">{t.developerDrawerTitle}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{t.developerDrawerSubTitle}</p>
            </div>

            <button
              type="button"
              onClick={() => setIsTeamDrawerOpen(false)}
              aria-label={t.close}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] text-[var(--color-muted)] transition hover:bg-white"
            >
              <FiX size={18} />
            </button>
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{t.developerDrawerDescription}</p>

          <div className="mt-6 rounded-2xl border border-[#102a4318] bg-white/90 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f766e14] text-[var(--color-brand-strong)]">
                <FiLayers size={18} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[var(--color-ink)]">{t.developerFarmName}</h4>
                <p className="text-xs text-[var(--color-brand-strong)]">{t.developerFarmTagline}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{t.developerFarmOverview}</p>

            <ul className="mt-4 grid gap-2 text-sm text-[var(--color-muted)] md:grid-cols-2">
              {t.developerFarmServices.map((service) => (
                <li key={service} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid gap-2 text-xs text-[var(--color-muted)] md:grid-cols-2">
              <p>
                <span className="font-semibold text-[var(--color-ink)]">{t.developerFarmWebsiteLabel}: </span>
                {t.developerFarmWebsite}
              </p>
              <p>
                <span className="font-semibold text-[var(--color-ink)]">{t.developerFarmContactLabel}: </span>
                {t.developerFarmContact}
              </p>
            </div>
          </div>

          <p className="mt-5 border-t border-[#102a4318] pt-4 text-xs text-[var(--color-muted)]">
            {t.developerFooterNote}
          </p>
        </div>
      </aside>
    </footer>
  );
}
