'use client';

import { createWithEqualityFn } from "zustand/traditional";

export type MarketConnectionStatus = "idle" | "connecting" | "online" | "offline";

export interface MarketTicker {
  symbol: string;
  price: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  changePercent: number;
  lastUpdated: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  cumulative: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdated: number;
}

export interface MarketState {
  status: MarketConnectionStatus;
  latencyMs: number;
  lastHeartbeat: number | null;
  tickers: Record<string, MarketTicker>;
  uiTickers: Record<string, MarketTicker>;
  orderBooks: Record<string, OrderBookSnapshot>;
  setStatus: (status: MarketConnectionStatus) => void;
  setLatency: (latencyMs: number, heartbeat: number) => void;
  upsertTicker: (ticker: MarketTicker) => void;
  upsertUiTicker: (ticker: MarketTicker) => void;
  upsertOrderBook: (snapshot: OrderBookSnapshot) => void;
  reset: () => void;
}

/**
 * Global market data store fed by real-time WebSocket streams.
 * It tracks ticker snapshots, order book depth, and connection status.
 */

export const useMarketStore = createWithEqualityFn<MarketState>((set) => ({
  status: "idle",
  latencyMs: 0,
  lastHeartbeat: null,
  tickers: {},
  uiTickers: {},
  orderBooks: {},
  setStatus: (status) => set({ status }),
  setLatency: (latencyMs, heartbeat) =>
    set({
      latencyMs,
      lastHeartbeat: heartbeat,
    }),
  upsertTicker: (ticker) =>
    set((state) => ({
      tickers: {
        ...state.tickers,
        [ticker.symbol]: ticker,
      },
    })),
  upsertUiTicker: (ticker) =>
    set((state) => ({
      uiTickers: {
        ...state.uiTickers,
        [ticker.symbol]: ticker,
      },
    })),
  upsertOrderBook: (snapshot) =>
    set((state) => ({
      orderBooks: {
        ...state.orderBooks,
        [snapshot.symbol]: snapshot,
      },
    })),
  reset: () =>
    set({
      status: "idle",
      latencyMs: 0,
      lastHeartbeat: null,
      tickers: {},
      uiTickers: {},
      orderBooks: {},
    }),
}));
