import { AiInsightFeed } from "@/components/strategies/ai-insight-feed";
import { StrategyCard } from "@/components/strategies/strategy-card";

export default function StrategiesPage() {
  return (
    <section className="flex min-h-dvh flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Strategies & Insights
        </h1>
        <p className="text-text-tertiary">
          Deploy automated trading strategies and monitor AI-driven market
          intelligence.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Strategies List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <StrategyCard
              title="BTC Accumulator"
              description="DCA strategy optimized for volatility dampening using Bollinger Bands."
              apy="12.5%"
              risk="Low"
              active={true}
            />
            <StrategyCard
              title="ETH/BTC Arbitrage"
              description="Exploits price inefficiencies between ETH and BTC pairs across exchanges."
              apy="24.8%"
              risk="Medium"
            />
            <StrategyCard
              title="Momentum Alpha"
              description="High-frequency momentum trading based on volume profile analysis."
              apy="45.2%"
              risk="High"
            />
            <StrategyCard
              title="Stablecoin Yield"
              description="Auto-compounding yield farming across lending protocols."
              apy="8.4%"
              risk="Low"
              active={true}
            />
          </div>
        </div>

        {/* Sidebar - AI Insights */}
        <div className="lg:col-span-1">
          <AiInsightFeed />
        </div>
      </div>
    </section>
  );
}
