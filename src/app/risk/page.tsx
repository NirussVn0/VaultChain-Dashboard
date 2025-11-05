export default function RiskPage() {
  return (
    <section className="flex min-h-dvh flex-col gap-6 p-6">
      <header className="rounded-2xl border border-border bg-background-surface/80 p-6 shadow-card shadow-black/20">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Risk Engine
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Placeholder screen for the risk engine. Wire this screen to VaR, margin stress tests, and policy controls.
        </p>
      </header>
    </section>
  );
}
