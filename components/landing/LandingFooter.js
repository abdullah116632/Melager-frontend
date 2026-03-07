export default function LandingFooter({ t }) {
  return (
    <footer className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-4 pb-8 text-xs text-[var(--color-muted)] md:px-8">
      <div id="pricing" className="rounded-2xl border border-[#102a431a] bg-[#fff8ee99] px-4 py-3">
        {t.footer}
      </div>
    </footer>
  );
}
