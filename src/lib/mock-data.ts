import {
  type ActivityItem,
  type ForecastPoint,
  type MarketMetric,
  type OrderBookLevel,
  type Position,
  type SentimentInsight,
} from "@/types/trading";

/**
 * Mocked market kpis for first render. Replace with API feed when wiring.
 */
export const marketMetrics: MarketMetric[] = [
  {
    id: "portfolio",
    label: "Net Portfolio Value",
    value: 1_278_540,
    change: 0.032,
    currency: "USD",
  },
  {
    id: "dailyPnl",
    label: "24h Realized PnL",
    value: 42_560,
    change: 0.124,
    currency: "USD",
  },
  {
    id: "risk",
    label: "VaR (95%)",
    value: 184_200,
    change: -0.018,
    currency: "USD",
  },
  {
    id: "funding",
    label: "Funding APR",
    value: 0.168,
    change: 0.006,
  },
];

export const activePositions: Position[] = [
  {
    id: "pos-btc-usdt",
    asset: "Bitcoin Perp",
    symbol: "BTC-PERP",
    type: "perp",
    size: 12.4,
    entry: 58_240,
    mark: 61_580,
    pnl: 41_392,
    pnlPercent: 0.057,
  },
  {
    id: "pos-eth-usdt",
    asset: "Ethereum Perp",
    symbol: "ETH-PERP",
    type: "perp",
    size: 180,
    entry: 2_920,
    mark: 3_080,
    pnl: 28_800,
    pnlPercent: 0.054,
  },
  {
    id: "pos-sol-spot",
    asset: "Solana",
    symbol: "SOL",
    type: "spot",
    size: 4_800,
    entry: 142,
    mark: 154,
    pnl: 57_600,
    pnlPercent: 0.084,
  },
];

export const orderBookLevels: OrderBookLevel[] = [
  { price: 61_600, size: 1.4, total: 4.1, type: "ask" },
  { price: 61_580, size: 2.8, total: 6.9, type: "ask" },
  { price: 61_560, size: 0.6, total: 4.1, type: "ask" },
  { price: 61_520, size: 3.1, total: 3.5, type: "bid" },
  { price: 61_500, size: 4.5, total: 6.6, type: "bid" },
  { price: 61_480, size: 1.3, total: 2.1, type: "bid" },
  { price: 61_460, size: 2.4, total: 0.8, type: "bid" },
];

export const sentimentInsights: SentimentInsight[] = [
  {
    label: "Market Pulse",
    score: 0.68,
    summary: "Bulls in control — derivatives skew shows 62% call bias.",
  },
  {
    label: "Funding Stress",
    score: 0.18,
    summary: "Funding spreads widening. Monitor perp/spot basis for reversal.",
  },
  {
    label: "Order Flow",
    score: 0.74,
    summary: "Spot inflows accelerating across Coinbase/CEXs, sustained bid depth.",
  },
];

export const forecastSeries: ForecastPoint[] = [
  { timestamp: Date.now() - 1000 * 60 * 60 * 10, price: 57_820, type: "historical" },
  { timestamp: Date.now() - 1000 * 60 * 60 * 8, price: 58_460, type: "historical" },
  { timestamp: Date.now() - 1000 * 60 * 60 * 6, price: 59_320, type: "historical" },
  { timestamp: Date.now() - 1000 * 60 * 60 * 4, price: 60_420, type: "historical" },
  { timestamp: Date.now() - 1000 * 60 * 60 * 2, price: 61_120, type: "historical" },
  { timestamp: Date.now(), price: 61_420, type: "historical" },
  { timestamp: Date.now() + 1000 * 60 * 60 * 2, price: 61_980, type: "prediction" },
  { timestamp: Date.now() + 1000 * 60 * 60 * 4, price: 62_430, type: "prediction" },
  { timestamp: Date.now() + 1000 * 60 * 60 * 6, price: 62_960, type: "prediction" },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    timestamp: Date.now() - 1000 * 60 * 5,
    description: "Auto-hedged -2.4 BTC using DeltaGuard™ hedging policy.",
    type: "trade",
  },
  {
    id: "activity-2",
    timestamp: Date.now() - 1000 * 60 * 35,
    description: "Funding arbitrage signal triggered for SOL-PERP vs. spot.",
    type: "alert",
  },
  {
    id: "activity-3",
    timestamp: Date.now() - 1000 * 60 * 86,
    description: "LSTM forecast updated · next review in 2h.",
    type: "update",
  },
];
