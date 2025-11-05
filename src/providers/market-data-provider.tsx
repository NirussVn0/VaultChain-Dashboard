'use client';

import { useEffect, useMemo, useRef } from "react";

import { DEFAULT_FEED_SYMBOLS } from "@/lib/market-symbols";
import {
  type MarketConnectionStatus,
  type OrderBookEntry,
  type OrderBookSnapshot,
  type MarketTicker,
  useMarketStore,
} from "@/store/market-store";

interface MarketDataProviderProps {
  children: React.ReactNode;
  /**
   * Explicit feed symbols to subscribe to (e.g. BTCUSDT).
   * Defaults to the symbols inferred from the trading catalog.
   */
  symbols?: string[];
  /**
   * Symbol used for granular order book depth (defaults to the first symbol).
   */
  depthSymbol?: string;
}

type BinanceTickerEvent = {
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  P: string;
  E: number;
};

type BinanceDepthEvent = {
  s: string;
  E: number;
  b: Array<[string, string]>;
  a: Array<[string, string]>;
};

type CombinedStreamMessage =
  | { stream: string; data: BinanceTickerEvent }
  | { stream: string; data: BinanceDepthEvent };

const BINANCE_WS_BASE = "wss://stream.binance.com:9443/stream?streams=";

const FALLBACK_BASELINES: Record<
  string,
  { price: number; volatility: number; volumeScale: number }
> = {
  BTCUSDT: { price: 61_420, volatility: 0.0028, volumeScale: 180 },
  ETHUSDT: { price: 3_080, volatility: 0.0032, volumeScale: 1200 },
  SOLUSDT: { price: 154, volatility: 0.0042, volumeScale: 8600 },
};

const MAX_BOOK_LEVELS = 12;

const isTickerStream = (stream: string): boolean => stream.endsWith("@ticker");
const isDepthStream = (stream: string): boolean => stream.includes("@depth");

const toOrderBookEntries = (levels: Array<[string, string]>): OrderBookEntry[] => {
  let cumulative = 0;
  return levels.slice(0, MAX_BOOK_LEVELS).map(([priceRaw, quantityRaw]) => {
    const price = Number.parseFloat(priceRaw);
    const quantity = Number.parseFloat(quantityRaw);
    cumulative += quantity;
    return { price, quantity, cumulative };
  });
};

const parseTicker = (event: BinanceTickerEvent): MarketTicker => {
  const price = Number.parseFloat(event.c);
  const openPrice = Number.parseFloat(event.o);
  const highPrice = Number.parseFloat(event.h);
  const lowPrice = Number.parseFloat(event.l);
  const volume = Number.parseFloat(event.v);
  const changePercent = Number.parseFloat(event.P) / 100;

  return {
    symbol: event.s,
    price,
    openPrice,
    highPrice,
    lowPrice,
    volume,
    changePercent: Number.isFinite(changePercent) ? changePercent : 0,
    lastUpdated: event.E,
  };
};

const parseDepth = (event: BinanceDepthEvent): OrderBookSnapshot => ({
  symbol: event.s,
  bids: toOrderBookEntries(event.b),
  asks: toOrderBookEntries(event.a),
  lastUpdated: event.E,
});

interface FallbackState {
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

const ensureFallbackConfig = (symbol: string) => {
  return (
    FALLBACK_BASELINES[symbol] ?? {
      price: 1_000,
      volatility: 0.002,
      volumeScale: 120,
    }
  );
};

const computeLatency = (eventTime: number | undefined): number => {
  if (typeof eventTime !== "number" || Number.isNaN(eventTime)) {
    return 0;
  }
  const now = Date.now();
  return Math.max(now - eventTime, 0);
};

/**
 * Provides real-time market data through a WebSocket -> Zustand bridge with graceful mock fallback.
 */
export function MarketDataProvider({
  children,
  symbols,
  depthSymbol,
}: MarketDataProviderProps) {
  const feedSymbols = useMemo(() => {
    const base = symbols?.length ? symbols : DEFAULT_FEED_SYMBOLS;
    return Array.from(new Set(base.map((item) => item.toUpperCase())));
  }, [symbols]);

  const depthFeedSymbol = useMemo(() => {
    if (depthSymbol) {
      return depthSymbol.toUpperCase();
    }
    return feedSymbols[0] ?? "BTCUSDT";
  }, [depthSymbol, feedSymbols]);

  const streamUrl = useMemo(() => {
    const override = process.env["NEXT_PUBLIC_MARKETDATA_WS_URL"];
    if (override && override.startsWith("ws")) {
      return override;
    }

    const streams: string[] = [
      ...feedSymbols.map((symbol) => `${symbol.toLowerCase()}@ticker`),
      `${depthFeedSymbol.toLowerCase()}@depth10@100ms`,
    ];

    return `${BINANCE_WS_BASE}${streams.join("/")}`;
  }, [depthFeedSymbol, feedSymbols]);

  const fallbackRef = useRef<Record<string, FallbackState>>({});
  const uiTickerStateRef = useRef<{
    timers: Map<string, ReturnType<typeof setTimeout>>;
    lastPush: Map<string, number>;
    buffer: Map<string, MarketTicker>;
  }>({
    timers: new Map(),
    lastPush: new Map(),
    buffer: new Map(),
  });

  useEffect(() => {
    const store = useMarketStore.getState();
    const {
      setStatus,
      setLatency,
      upsertTicker,
      upsertUiTicker,
      upsertOrderBook,
      reset,
    } = store;

    const queueUiTicker = (ticker: MarketTicker) => {
      const symbol = ticker.symbol;
      const state = uiTickerStateRef.current;
      const now = Date.now();
      const lastPush = state.lastPush.get(symbol) ?? 0;
      const elapsed = now - lastPush;
      state.buffer.set(symbol, ticker);

      const push = (payload: MarketTicker) => {
        upsertUiTicker(payload);
        state.lastPush.set(symbol, Date.now());
      };

      if (elapsed >= 3200) {
        push(ticker);
        const pending = state.timers.get(symbol);
        if (pending) {
          clearTimeout(pending);
          state.timers.delete(symbol);
        }
        return;
      }

      if (state.timers.has(symbol)) {
        return;
      }

      const waitDuration = Math.max(3200 - elapsed, 0);
      const timeout = setTimeout(() => {
        const latest = state.buffer.get(symbol) ?? ticker;
        push(latest);
        state.timers.delete(symbol);
      }, waitDuration);
      state.timers.set(symbol, timeout);
    };

    const clearUiTickerTimers = () => {
      const state = uiTickerStateRef.current;
      state.timers.forEach((timeout) => clearTimeout(timeout));
      state.timers.clear();
      state.buffer.clear();
      state.lastPush.clear();
    };

    let socket: WebSocket | null = null;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const updateStatus = (status: MarketConnectionStatus) => {
      setStatus(status);
    };

    const stopFallback = () => {
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
    };

    const emitFallbackTick = () => {
      const now = Date.now();
      feedSymbols.forEach((symbol) => {
        const config = ensureFallbackConfig(symbol);
        const current = fallbackRef.current[symbol] ?? {
          price: config.price,
          open: config.price,
          high: config.price,
          low: config.price,
          volume: config.volumeScale,
        };

        const drift = 1 + (Math.random() - 0.5) * config.volatility;
        const nextPrice = Math.max(current.price * drift, 0.1);
        const high = Math.max(current.high, nextPrice);
        const low = Math.min(current.low, nextPrice);
        const volume =
          current.volume + Math.abs(nextPrice - current.price) * config.volumeScale;

        fallbackRef.current[symbol] = {
          price: nextPrice,
          open: current.open,
          high,
          low,
          volume,
        };

        const ticker: MarketTicker = {
          symbol,
          price: nextPrice,
          openPrice: current.open,
          highPrice: high,
          lowPrice: low,
          volume,
          changePercent: current.open > 0 ? (nextPrice - current.open) / current.open : 0,
          lastUpdated: now,
        };

        upsertTicker(ticker);
        queueUiTicker(ticker);

        if (symbol === depthFeedSymbol) {
          const midpoint = nextPrice;
          const spread = midpoint * 0.0006;
          const step = midpoint * 0.00025;

          const bids: OrderBookEntry[] = [];
          const asks: OrderBookEntry[] = [];

          let bidCum = 0;
          let askCum = 0;

          for (let i = 0; i < MAX_BOOK_LEVELS; i++) {
            const bidPrice = midpoint - spread - step * i;
            const bidQty = Math.max(config.volumeScale * 0.4 * Math.random(), 0.01);
            bidCum += bidQty;
            bids.push({ price: bidPrice, quantity: bidQty, cumulative: bidCum });

            const askPrice = midpoint + spread + step * i;
            const askQty = Math.max(config.volumeScale * 0.4 * Math.random(), 0.01);
            askCum += askQty;
            asks.push({ price: askPrice, quantity: askQty, cumulative: askCum });
          }

          const snapshot: OrderBookSnapshot = {
            symbol,
            bids,
            asks,
            lastUpdated: now,
          };
          upsertOrderBook(snapshot);
        }
      });

      setLatency(120, now);
    };

    const startFallback = () => {
      stopFallback();
      updateStatus("online");
      emitFallbackTick();
      fallbackTimer = setInterval(() => emitFallbackTick(), 3_800);
    };

    const scheduleReconnect = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      reconnectTimer = setTimeout(() => {
        connect();
      }, 4_500);
    };

    const handleMessage = (raw: MessageEvent<string>) => {
      let payload: CombinedStreamMessage | BinanceTickerEvent | BinanceDepthEvent;
      try {
        payload = JSON.parse(raw.data);
      } catch (parseError) {
        console.error("Market stream parse error", parseError);
        return;
      }

      if ("stream" in payload) {
        const { stream, data } = payload;
        if (isTickerStream(stream)) {
          const ticker = parseTicker(data as BinanceTickerEvent);
          upsertTicker(ticker);
          queueUiTicker(ticker);
          setLatency(computeLatency(ticker.lastUpdated), Date.now());
        } else if (isDepthStream(stream)) {
          const depth = parseDepth(data as BinanceDepthEvent);
          upsertOrderBook(depth);
          setLatency(computeLatency(depth.lastUpdated), Date.now());
        }
        return;
      }

      if ("c" in payload && "s" in payload) {
        const ticker = parseTicker(payload as BinanceTickerEvent);
        upsertTicker(ticker);
        queueUiTicker(ticker);
        setLatency(computeLatency(ticker.lastUpdated), Date.now());
        return;
      }

      if ("b" in payload && "a" in payload) {
        const depth = parseDepth(payload as BinanceDepthEvent);
        upsertOrderBook(depth);
        setLatency(computeLatency(depth.lastUpdated), Date.now());
      }
    };

    const connect = () => {
      stopFallback();

      if (process.env["NEXT_PUBLIC_MARKETDATA_FORCE_MOCK"] === "true") {
        startFallback();
        return;
      }

      try {
        socket = new WebSocket(streamUrl);
      } catch (error) {
        console.error("Market stream connection failed", error);
        startFallback();
        return;
      }

      updateStatus("connecting");

      socket.onopen = () => {
        updateStatus("online");
        setLatency(0, Date.now());
      };

      socket.onmessage = handleMessage;

      socket.onerror = (event) => {
        console.error("Market stream error", event);
        updateStatus("offline");
      };

      socket.onclose = () => {
        updateStatus("offline");
        startFallback();
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      stopFallback();
      clearUiTickerTimers();
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (socket) {
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
        socket = null;
      }
      reset();
    };
  }, [depthFeedSymbol, feedSymbols, streamUrl]);

  return <>{children}</>;
}
