import { FiActivity, FiBarChart2, FiCheckCircle, FiLayers, FiUsers } from "react-icons/fi";

const iconMap = {
  activity: FiActivity,
  layers: FiLayers,
  users: FiUsers,
  chart: FiBarChart2,
};

export default function AdvantagesSection({ t }) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 md:px-8">
      <div className="rounded-3xl border border-[#102a4322] bg-[#fff8efeb] p-6 shadow-[0_24px_56px_rgba(16,42,67,0.12)] md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip inline-flex rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-brand-strong)]">
            {t.advantagesBadge}
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-[var(--color-ink)] md:text-3xl">
            {t.advantagesTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] md:text-base">
            {t.advantagesDescription}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {t.advantagesCards.map((item) => {
            const Icon = iconMap[item.icon] || FiLayers;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-[#102a4318] bg-white/85 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f766e14] text-[var(--color-brand-strong)]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-ink)]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{item.description}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <FiCheckCircle className="mt-0.5 text-[var(--color-brand)]" size={14} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
