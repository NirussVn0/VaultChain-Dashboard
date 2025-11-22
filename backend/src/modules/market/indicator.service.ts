import { Injectable } from "@nestjs/common";

import { InMemoryCache } from "../../common/cache/in-memory-cache";
import { MarketService } from "./market.service";


export interface IndicatorSnapshot {
  symbol: string;
  price: number;
  changePercent: number;
  sma20: number;
  sma50: number;
  rsi14: number;
  updatedAt: string;
}

@Injectable()
export class MarketIndicatorService {
  private readonly cache = new InMemoryCache<IndicatorSnapshot>(30_000);

  constructor(
    private readonly marketService: MarketService,
  ) {}

  async getIndicators(symbol: string): Promise<IndicatorSnapshot> {
    const key = symbol.toUpperCase();
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const [spot, klines] = await Promise.all([
      this.marketService.getSpotSummary(key),
      this.marketService.getKlines(key),
    ]);

    const closes = klines.map((item) => item.close);
    const sma20 = this.simpleMovingAverage(closes, 20);
    const sma50 = this.simpleMovingAverage(closes, 50);
    const rsi14 = this.relativeStrengthIndex(closes, 14);

    const snapshot: IndicatorSnapshot = {
      symbol: spot.symbol,
      price: spot.lastPrice,
      changePercent: spot.priceChangePercent,
      sma20,
      sma50,
      rsi14,
      updatedAt: new Date().toISOString(),
    };

    this.cache.set(key, snapshot);
    return snapshot;
  }

  private simpleMovingAverage(values: number[], window: number): number {
    if (values.length < window) {
      return Number.NaN;
    }
    const recent = values.slice(-window);
    const total = recent.reduce((sum, value) => sum + value, 0);
    return total / window;
  }

  private relativeStrengthIndex(values: number[], period: number): number {
    if (values.length < period + 1) {
      return Number.NaN;
    }
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i += 1) {
      const diff = values[i] - values[i - 1];
      if (diff >= 0) {
        gains += diff;
      } else {
        losses -= diff;
      }
    }

    if (losses === 0) {
      return 100;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < values.length; i += 1) {
      const diff = values[i] - values[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - diff) / period;
      }
    }

    if (avgLoss === 0) {
      return 100;
    }

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }
}
