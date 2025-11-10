'use client';

import { useMemo } from "react";

import { activePositions } from "@/lib/mock-data";
import { toFeedSymbol } from "@/lib/market-symbols";
import { type MarketTicker } from "@/store/market-store";
import type { Position } from "@/types/trading";

import { useMarketTickers } from "./use-market-data";

export interface LivePosition extends Position {
  markValue: number;
  ticker: MarketTicker | null;
}

const positionSymbols = Array.from(
  new Set(activePositions.map((position) => position.symbol)),
);

const FALLBACK_TICKERS: Record<string, MarketTicker> = {
  BTCUSDT: {
    symbol: "BTCUSDT",
    price: 61_420,
    openPrice: 59_900,
    highPrice: 62_050,
    lowPrice: 59_100,
    volume: 182,
    changePercent: 0.025,
    lastUpdated: Date.now(),
  },
  ETHUSDT: {
    symbol: "ETHUSDT",
    price: 3_080,
    openPrice: 2_980,
    highPrice: 3_140,
    lowPrice: 2_940,
    volume: 1_280,
    changePercent: 0.0332,
    lastUpdated: Date.now(),
  },
  SOLUSDT: {
    symbol: "SOLUSDT",
    price: 154,
    openPrice: 147,
    highPrice: 158,
    lowPrice: 143,
    volume: 9_450,
    changePercent: 0.047,
    lastUpdated: Date.now(),
  },
};

const retrieveTicker = (
  requestedSymbol: string,
  tickerMap: Record<string, MarketTicker | undefined>,
): MarketTicker | undefined => {
  const direct = tickerMap[requestedSymbol];
  if (direct) {
    return direct;
  }
  const feed = toFeedSymbol(requestedSymbol);
  if (!feed) {
    return undefined;
  }
  return tickerMap[feed] ?? FALLBACK_TICKERS[feed];
};

export function useLivePositions(): LivePosition[] {
  const tickerMap = useMarketTickers(positionSymbols);

  return useMemo(
    () =>
      activePositions.map((position) => {
        const ticker =
          retrieveTicker(position.symbol, tickerMap) ??
          retrieveTicker(position.asset, tickerMap);

        const markPrice = ticker?.price ?? position.mark;
        const pnl = (markPrice - position.entry) * position.size;
        const pnlPercent =
          position.entry > 0 ? (markPrice - position.entry) / position.entry : 0;

        return {
          ...position,
          mark: markPrice,
          pnl,
          pnlPercent,
          markValue: markPrice * position.size,
          ticker: ticker ?? null,
        };
      }),
    [tickerMap],
  );
}
