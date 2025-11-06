'use client';

import { useMemo } from "react";
import { shallow } from "zustand/shallow";

import { DEFAULT_FEED_SYMBOLS, FEED_TO_SYMBOL, toFeedSymbol } from "@/lib/market-symbols";
import {
  type MarketTicker,
  type OrderBookSnapshot,
  type MarketState,
  useMarketStore,
} from "@/store/market-store";

type TickerMode = "ui" | "raw";

interface UseTickerOptions {
  mode?: TickerMode;
}

export function useMarketConnectionState() {
  const status = useMarketStore((state) => state.status);
  const latencyMs = useMarketStore((state) => state.latencyMs);
  const lastHeartbeat = useMarketStore((state) => state.lastHeartbeat);

  return useMemo(
    () => ({
      status,
      latencyMs,
      lastHeartbeat,
    }),
    [status, latencyMs, lastHeartbeat],
  );
}

export function useMarketTicker(
  symbol: string | null | undefined,
  { mode = "ui" }: UseTickerOptions = {},
): MarketTicker | undefined {
  const tickers = useMarketStore((state) =>
    mode === "raw" ? state.tickers : state.uiTickers,
  );

  return useMemo(() => {
    if (!symbol) {
      return undefined;
    }

    const direct = tickers[symbol.toUpperCase()];
    if (direct) {
      return direct;
    }

    const feed = toFeedSymbol(symbol);
    if (!feed) {
      return undefined;
    }

    return tickers[feed];
  }, [symbol, tickers]);
}

export function useMarketOrderBook(symbol: string | null | undefined): OrderBookSnapshot | undefined {
  const orderBooks = useMarketStore((state) => state.orderBooks);

  return useMemo(() => {
    if (!symbol) {
      return undefined;
    }

    const direct = orderBooks[symbol.toUpperCase()];
    if (direct) {
      return direct;
    }

    const feed = toFeedSymbol(symbol);
    if (!feed) {
      return undefined;
    }

    return orderBooks[feed];
  }, [orderBooks, symbol]);
}

export function useMarketTickers(
  symbols?: string[],
  { mode = "ui" }: UseTickerOptions = {},
): Record<string, MarketTicker | undefined> {
  const normalized = useMemo(() => {
    if (symbols && symbols.length > 0) {
      return symbols.map((item) => item.toUpperCase());
    }
    return DEFAULT_FEED_SYMBOLS;
  }, [symbols]);

  const selector = useMemo(
    () => {
      return (state: MarketState) => {
        const sourceTickers = mode === "raw" ? state.tickers : state.uiTickers;
        const result: Record<string, MarketTicker | undefined> = {};
        normalized.forEach((key, index) => {
          const source = symbols?.[index] ?? FEED_TO_SYMBOL[key] ?? key;
          const direct = sourceTickers[key];
          if (direct) {
            result[source] = direct;
            return;
          }
          const feed = toFeedSymbol(source);
          result[source] = feed ? sourceTickers[feed] : undefined;
        });
        return result;
      };
    },
    [mode, normalized, symbols],
  );

  return useMarketStore(selector, shallow);
}
