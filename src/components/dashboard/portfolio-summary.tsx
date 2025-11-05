'use client';

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePortfolioMetrics, type ComputedMetric } from "@/hooks/use-portfolio-metrics";
import type { PortfolioTimeframe } from "@/types/trading";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const TIMEFRAMES: Array<{ id: PortfolioTimeframe; label: string }> = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All" },
];

const NAVIGATION_MOTION = { type: "spring", stiffness: 420, damping: 36 } as const;

interface SparklineProps {
  data: number[];
  direction: "up" | "down" | "flat";
}

const Sparkline = ({ data, direction }: SparklineProps) => {
  const gradientId = useId();
  const strokeColor =
    direction === "up"
      ? "var(--success)"
      : direction === "down"
        ? "var(--danger)"
        : "var(--primary)";

  const [path, areaPath] = useMemo(() => {
    if (!data || data.length < 2) {
      return ["", ""];
    }
    const width = 120;
    const height = 48;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const normalized = (value - min) / range;
      const y = height - normalized * height;
      return { x, y };
    });

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
    const area = `${line} L ${width},48 L 0,48 Z`;
    return [line, area];
  }, [data]);

  return (
    <svg viewBox="0 0 120 48" className="h-14 w-full">
      <defs>
        <linearGradient id={`spark-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#spark-${gradientId})`}
        className="opacity-80"
        stroke="none"
      />
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const metricMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const formatMetricValue = (metric: ComputedMetric): string => {
  if (metric.currency) {
    return formatCurrency(metric.value, metric.currency);
  }
  return formatPercent(metric.value, metric.id === "funding" ? 3 : 2);
};

const tooltipCopy: Record<string, string> = {
  portfolio: "Mark-to-market portfolio equity across all active positions.",
  dailyPnl: "Realised and unrealised PnL aggregated over the selected window.",
  risk: "Value-at-Risk (95%) calculated via parametric VaR using current exposures.",
  funding: "Annualised funding rate implied by perp open interest differentials.",
};

interface PortfolioMetricCardProps {
  metric: ComputedMetric;
  timeframe: PortfolioTimeframe;
}

const PortfolioMetricCard = ({ metric, timeframe }: PortfolioMetricCardProps) => {
  const deltaLabel = formatPercent(metric.change);
  const isPositive = metric.change >= 0;
  const direction =
    metric.series.at(-1) ?? 0 > (metric.series.at(-2) ?? 0)
      ? "up"
      : metric.series.at(-1) ?? 0 < (metric.series.at(-2) ?? 0)
        ? "down"
        : "flat";

  const min = Math.min(...metric.series);
  const max = Math.max(...metric.series);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background-surface/80 p-4 shadow-card shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
            {metric.label}
          </span>
          <TooltipProvider delayDuration={120}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-text-muted transition hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Explain ${metric.label}`}
                >
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
                {tooltipCopy[metric.id] ?? metric.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant={isPositive ? "success" : "danger"} className="text-[11px] uppercase">
          {isPositive ? "Up" : "Down"} {deltaLabel}
        </Badge>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${metric.id}-${metric.value.toFixed(4)}`}
              variants={metricMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={cn(
                "text-[30px] font-semibold leading-[1.15] tracking-tight",
                direction === "up"
                  ? "text-text-primary"
                  : direction === "down"
                    ? "text-danger"
                    : "text-text-primary",
              )}
            >
              {formatMetricValue(metric)}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-text-tertiary">
            {timeframe.toUpperCase()} range · {formatMetricValue({
              ...metric,
              value: min,
            })} →{" "}
            {formatMetricValue({
              ...metric,
              value: max,
            })}
          </span>
        </div>
        <Sparkline
          data={metric.series}
          direction={direction}
        />
      </div>
    </div>
  );
};

export function PortfolioSummary() {
  const [timeframe, setTimeframe] = useState<PortfolioTimeframe>("24h");
  const metrics = usePortfolioMetrics(timeframe);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-background-surface/70 p-4 shadow-card shadow-black/25 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Portfolio Summary
          </h2>
          <p className="text-sm text-text-tertiary">
            Live mark-to-market performance with AI-adjusted projections.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background-elevated/40 p-1">
          {TIMEFRAMES.map((option) => {
            const isActive = option.id === timeframe;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTimeframe(option.id)}
                className={cn(
                  "relative flex-1 rounded-xl px-3 py-1.5 text-sm font-medium text-text-secondary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive && "text-text-primary",
                )}
              >
                <span className="relative z-10">{option.label}</span>
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      layoutId="timeframe-pill"
                      className="absolute inset-0 rounded-xl border border-primary/40 bg-primary/15 shadow-[0_8px_20px_rgba(59,130,246,0.25)]"
                      transition={NAVIGATION_MOTION}
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <PortfolioMetricCard key={metric.id} metric={metric} timeframe={timeframe} />
        ))}
      </div>
    </section>
  );
}
