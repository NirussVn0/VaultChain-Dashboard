import { type MarketMetric } from "@/types/trading";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  metric: MarketMetric;
}

/**
 * Displays a key performance indicator with delta badge.
 */
export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.change >= 0;
  const formattedValue =
    metric.currency != null
      ? formatCurrency(metric.value, metric.currency)
      : formatPercent(metric.value, 2).replace("+", "");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background-surface/70 p-4 shadow-card shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
          {metric.label}
        </span>
        <Badge variant={isPositive ? "success" : "danger"}>
          {formatPercent(metric.change)}
        </Badge>
      </div>
      <div className="text-[28px] font-semibold leading-[1.2] text-text-primary">
        {formattedValue}
      </div>
    </div>
  );
}
