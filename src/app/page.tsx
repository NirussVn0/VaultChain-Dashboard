import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { OrderBookCard } from "@/components/dashboard/orderbook-card";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { PriceChartCard } from "@/components/dashboard/price-chart-card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import {
  activePositions,
  forecastSeries,
  orderBookLevels,
  recentActivity,
  sentimentInsights,
} from "@/lib/mock-data";

/**
 * VaultChain main dashboard page.
 */
export default function DashboardPage() {
  const historical = forecastSeries.filter((point) => point.type === "historical");
  const predictions = forecastSeries.filter((point) => point.type === "prediction");
  const basePrice = historical.at(-1)?.price ?? 0;
  const projectedPrice = predictions.at(-1)?.price ?? basePrice;
  const commandChange =
    basePrice > 0 ? (projectedPrice - basePrice) / basePrice : 0;

  return (
    <div className="grid min-h-dvh gap-6 p-4 md:p-6 xl:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="flex min-h-dvh flex-col gap-6">
        <Header symbolChange={commandChange} />
        <section className="flex flex-col gap-6">
          <PortfolioSummary />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)]">
            <PriceChartCard symbol="BTC-PERP" series={forecastSeries} />
            <AiInsightsCard
              symbol="BTC"
              insights={sentimentInsights}
              forecastConfidence={0.86}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
            <PositionsTable positions={activePositions} />
            <div className="grid gap-6">
              <OrderBookCard levels={orderBookLevels} />
              <ActivityFeed activity={recentActivity} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
