'use client';

import { useMemo } from "react";

import { marketMetrics } from "@/lib/mock-data";
import type { MarketMetric, PortfolioTimeframe } from "@/types/trading";

import { useLivePositions } from "./use-live-positions";

export interface ComputedMetric extends MarketMetric {
  /**
   * History series tailored to the selected timeframe. Always ends with the live value.
   */
  series: number[];
}

const DEFAULT_HISTORY_LENGTH = 16;

const synthesizeHistory = (currentValue: number): number[] => {
  const values: number[] = [];
  const base = currentValue / 1.06;
  for (let i = 0; i < DEFAULT_HISTORY_LENGTH; i++) {
    const noise = Math.sin((i / DEFAULT_HISTORY_LENGTH) * Math.PI) * 0.012;
    values.push(base * (1 + noise + i * 0.002));
  }
  values[values.length - 1] = currentValue;
  return values;
};

const appendLiveValue = (values: number[] | undefined, live: number): number[] => {
  if (!values || values.length === 0) {
    return synthesizeHistory(live);
  }
  const cloned = values.slice();
  cloned[cloned.length - 1] = live;
  return cloned;
};

const computeDelta = (series: number[]): number => {
  if (series.length < 2) {
    return 0;
  }
  const first = series.at(0) ?? 0;
  const last = series.at(-1) ?? 0;
  if (!Number.isFinite(first) || first === 0) {
    return 0;
  }
  return (last - first) / first;
};

/**
 * Derives portfolio metric cards enriched with live market inputs.
 */
export function usePortfolioMetrics(timeframe: PortfolioTimeframe): ComputedMetric[] {
  const positions = useLivePositions();

  return useMemo(() => {
    const baseMetrics = marketMetrics;

    const totalValue = positions.reduce((acc, position) => acc + position.markValue, 0);
    const totalPnl = positions.reduce((acc, position) => acc + position.pnl, 0);

    const basePortfolio = baseMetrics.find((metric) => metric.id === "portfolio");
    const baseRisk = baseMetrics.find((metric) => metric.id === "risk");
    const baseFunding = baseMetrics.find((metric) => metric.id === "funding");

    const basePortfolioValue = basePortfolio?.value ?? totalValue;
    const riskRatio =
      basePortfolioValue > 0 && baseRisk
        ? baseRisk.value / basePortfolioValue
        : 0.145;

    const avgChange =
      positions.length > 0
        ? positions.reduce((acc, item) => acc + (item.ticker?.changePercent ?? 0), 0) /
          positions.length
        : 0;

    return baseMetrics.map<ComputedMetric>((metric) => {
      let value = metric.value;

      if (metric.id === "portfolio") {
        value = totalValue;
      } else if (metric.id === "dailyPnl") {
        value = totalPnl;
      } else if (metric.id === "risk") {
        value = totalValue * riskRatio;
      } else if (metric.id === "funding") {
        const baseValue = baseFunding?.value ?? metric.value;
        value = Math.max(baseValue * (1 + avgChange * 0.6), 0);
      }

      const history = appendLiveValue(metric.history?.[timeframe], value);
      const change = computeDelta(history);

      return {
        ...metric,
        value,
        change,
        series: history,
      };
    });
  }, [positions, timeframe]);
}
