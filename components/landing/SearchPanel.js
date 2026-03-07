export default function SearchPanel({ t, query, onQueryChange, onSearch }) {
  return (
    <section className="fade-in-up glass-card rounded-3xl p-6 [animation-delay:120ms] md:p-7">
      <h2 className="text-xl font-bold text-[var(--color-ink)]">{t.searchTitle}</h2>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.searchHint}</p>

      <form onSubmit={onSearch} className="mt-5 space-y-4">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-2xl border border-[#102a4326] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[#0f766e33]"
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
        >
          {t.searchButton}
        </button>
      </form>

      <div id="features" className="mt-7 space-y-3">
        <article className="rounded-2xl border border-[#102a4315] bg-white/75 p-4">
          <h3 className="font-semibold text-[var(--color-ink)]">{t.cards.oneTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{t.cards.oneDesc}</p>
        </article>
        <article className="rounded-2xl border border-[#102a4315] bg-white/75 p-4">
          <h3 className="font-semibold text-[var(--color-ink)]">{t.cards.twoTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{t.cards.twoDesc}</p>
        </article>
        <article className="rounded-2xl border border-[#102a4315] bg-white/75 p-4">
          <h3 className="font-semibold text-[var(--color-ink)]">{t.cards.threeTitle}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{t.cards.threeDesc}</p>
        </article>
      </div>
    </section>
  );
}
