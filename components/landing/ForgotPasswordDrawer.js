import { FiMail, FiX } from "react-icons/fi";

export default function ForgotPasswordDrawer({ isOpen, t, onClose, onBackToLogin }) {
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
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">{t.forgotTitle}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{t.forgotSubTitle}</p>
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

        <div className="mt-6 rounded-xl border border-[#102a4318] bg-white/70 p-4">
          <p className="text-sm text-[var(--color-muted)]">{t.forgotDescription}</p>
        </div>

        <form className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">{t.formEmail}</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                placeholder={t.forgotEmailPlaceholder}
                className="w-full rounded-xl border border-[#102a4325] bg-white py-2.5 pl-10 pr-3 outline-none transition focus:border-[var(--color-brand)]"
              />
            </div>
          </label>

          <button
            type="button"
            className="w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
          >
            {t.forgotSubmit}
          </button>

          <p className="text-center text-xs text-[var(--color-muted)]">{t.otpHint}</p>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full cursor-pointer rounded-xl border border-[#102a4325] px-4 py-3 text-sm font-medium text-[var(--color-muted)] transition hover:bg-white"
          >
            {t.backToLogin}
          </button>
        </form>
      </aside>
    </>
  );
}
