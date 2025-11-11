'use client';

import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { OrderBookCard } from "@/components/dashboard/orderbook-card";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { PriceChartCard } from "@/components/dashboard/price-chart-card";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
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
  const { user, status } = useAuth();
  const historical = forecastSeries.filter((point) => point.type === "historical");
  const predictions = forecastSeries.filter((point) => point.type === "prediction");
  const basePrice = historical.at(-1)?.price ?? 0;
  const projectedPrice = predictions.at(-1)?.price ?? basePrice;
  const commandChange =
    basePrice > 0 ? (projectedPrice - basePrice) / basePrice : 0;
  const welcomeName = user?.displayName ?? user?.email ?? "VaultChain operator";
  const statusLabel =
    status === "authenticated"
      ? "Secure session"
      : status === "loading"
        ? "Authorizing"
        : "Guest mode";

  return (
    <div className="grid min-h-dvh gap-6 p-4 md:p-6 xl:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="flex min-h-dvh flex-col gap-6">
        <Header symbolChange={commandChange} />
        <div className="rounded-2xl border border-border bg-background-surface/70 p-5 shadow-card shadow-black/15">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-tertiary">Welcome back</p>
              <h2 className="text-2xl font-semibold text-text-primary">{welcomeName}</h2>
            </div>
            <Badge variant="outline" className="text-xs uppercase tracking-[0.2em]">
              {statusLabel}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Your watchlists, funded accounts, and LSTM models are synced. Continue where you left off or jump into a new strategy.
          </p>
        </div>
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
