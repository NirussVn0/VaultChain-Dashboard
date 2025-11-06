export type PortfolioTimeframe = "24h" | "7d" | "30d" | "all";

export interface MarketMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  currency?: string;
  history?: Partial<Record<PortfolioTimeframe, number[]>>;
}

export interface Position {
  id: string;
  asset: string;
  symbol: string;
  type: "spot" | "perp";
  size: number;
  entry: number;
  mark: number;
  pnl: number;
  pnlPercent: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  type: "bid" | "ask";
}

export interface SentimentInsight {
  label: string;
  score: number;
  summary: string;
}

export interface ForecastPoint {
  timestamp: number;
  price: number;
  type: "historical" | "prediction";
}

export interface ActivityItem {
  id: string;
  timestamp: number;
  description: string;
  type: "trade" | "alert" | "update";
}
