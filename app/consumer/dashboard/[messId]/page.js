export default async function ConsumerDashboardPage({ params }) {
  const resolvedParams = await params;
  const messId = resolvedParams?.messId || "-";

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-bold text-[var(--color-ink)]">Consumer Dashboard</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        You are viewing mess dashboard for mess: {messId}
      </p>
    </main>
  );
}
