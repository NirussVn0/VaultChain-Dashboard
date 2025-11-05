import {
  type ActivityItem,
  type ForecastPoint,
  type MarketMetric,
  type OrderBookLevel,
  type Position,
  type SentimentInsight,
} from "@/types/trading";
import { hoursFromNow, minutesFromNow, MOCK_NOW } from "@/lib/mock-clock";

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
    history: {
      "24h": [
        1_198_200, 1_203_600, 1_214_800, 1_226_400,
        1_236_200, 1_247_400, 1_261_800, 1_278_540,
      ],
      "7d": [
        1_148_200, 1_186_400, 1_214_200, 1_231_600,
        1_248_300, 1_264_800, 1_278_540,
      ],
      "30d": [
        1_042_200, 1_076_800, 1_112_400, 1_138_200,
        1_172_600, 1_206_200, 1_238_400, 1_268_800,
        1_278_540,
      ],
      all: [
        382_400, 524_800, 712_200, 864_400,
        994_200, 1_082_600, 1_148_400, 1_202_200,
        1_246_600, 1_278_540,
      ],
    },
  },
  {
    id: "dailyPnl",
    label: "24h Realized PnL",
    value: 42_560,
    change: 0.124,
    currency: "USD",
    history: {
      "24h": [
        21_240, 24_680, 28_120, 31_700,
        34_820, 37_450, 40_180, 42_560,
      ],
      "7d": [
        11_420, 18_640, 22_880, 27_420,
        31_860, 36_210, 42_560,
      ],
      "30d": [
        -8_420, -2_360, 4_120, 9_840,
        16_540, 23_810, 31_420, 37_240,
        42_560,
      ],
      all: [
        -68_200, -44_120, -12_840, 3_420,
        12_860, 21_240, 29_820, 35_760,
        40_120, 42_560,
      ],
    },
  },
  {
    id: "risk",
    label: "VaR (95%)",
    value: 184_200,
    change: -0.018,
    currency: "USD",
    history: {
      "24h": [
        196_200, 194_600, 192_100, 189_800,
        188_000, 186_400, 185_200, 184_200,
      ],
      "7d": [
        212_400, 206_800, 201_600, 196_400,
        191_600, 187_800, 184_200,
      ],
      "30d": [
        264_800, 248_200, 233_400, 220_600,
        209_800, 201_200, 193_600, 188_200,
        184_200,
      ],
      all: [
        382_400, 348_600, 302_200, 268_400,
        241_800, 218_600, 203_400, 193_200,
        187_200, 184_200,
      ],
    },
  },
  {
    id: "funding",
    label: "Funding APR",
    value: 0.168,
    change: 0.006,
    history: {
      "24h": [
        0.148, 0.152, 0.156, 0.159,
        0.162, 0.165, 0.167, 0.168,
      ],
      "7d": [
        0.132, 0.138, 0.144, 0.151,
        0.158, 0.163, 0.168,
      ],
      "30d": [
        0.082, 0.094, 0.108, 0.122,
        0.134, 0.144, 0.152, 0.161,
        0.168,
      ],
      all: [
        0.028, 0.044, 0.058, 0.079,
        0.1, 0.118, 0.135, 0.149,
        0.161, 0.168,
      ],
    },
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
  { timestamp: hoursFromNow(-10), price: 57_820, type: "historical" },
  { timestamp: hoursFromNow(-8), price: 58_460, type: "historical" },
  { timestamp: hoursFromNow(-6), price: 59_320, type: "historical" },
  { timestamp: hoursFromNow(-4), price: 60_420, type: "historical" },
  { timestamp: hoursFromNow(-2), price: 61_120, type: "historical" },
  { timestamp: MOCK_NOW, price: 61_420, type: "historical" },
  { timestamp: hoursFromNow(2), price: 61_980, type: "prediction" },
  { timestamp: hoursFromNow(4), price: 62_430, type: "prediction" },
  { timestamp: hoursFromNow(6), price: 62_960, type: "prediction" },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    timestamp: minutesFromNow(-5),
    description: "Auto-hedged -2.4 BTC using DeltaGuard™ hedging policy.",
    type: "trade",
  },
  {
    id: "activity-2",
    timestamp: minutesFromNow(-35),
    description: "Funding arbitrage signal triggered for SOL-PERP vs. spot.",
    type: "alert",
  },
  {
    id: "activity-3",
    timestamp: minutesFromNow(-86),
    description: "LSTM forecast updated · next review in 2h.",
    type: "update",
  },
];
