import { ExposureChart } from "@/components/risk/exposure-chart";
import { RiskMetrics } from "@/components/risk/risk-metrics";

export default function RiskPage() {
  return (
    <section className="flex min-h-dvh flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Risk Engine
        </h1>
        <p className="text-text-tertiary">
          Real-time risk monitoring, exposure analysis, and margin stress
          testing.
        </p>
      </header>

      <div className="space-y-6">
        <RiskMetrics />

        <div className="grid gap-6 lg:grid-cols-2">
          <ExposureChart />

          {/* Placeholder for Stress Test Module */}
          <div className="rounded-xl border border-border/50 bg-background-surface/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              Stress Test Scenarios
            </h3>
            <div className="space-y-4">
              {[
                "Market Crash (-20%)",
                "ETH Depeg",
                "High Volatility Event",
              ].map((scenario) => (
                <div
                  key={scenario}
                  className="flex items-center justify-between rounded-lg bg-background-base p-4 transition-colors hover:bg-background-elevated"
                >
                  <span className="text-sm font-medium text-text-secondary">
                    {scenario}
                  </span>
                  <button className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                    Run Simulation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
