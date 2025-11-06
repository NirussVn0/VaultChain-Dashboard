import { Inject, Injectable } from "@nestjs/common";

import type { AppConfig } from "../../common/config/app.config";
import { APP_CONFIG } from "../../common/providers/app-config.provider";
import { OrderBookResponseDto } from "./dto/orderbook.response";
import type { OrderBookLevel } from "./dto/orderbook.response";
import { LatencyResponseDto } from "./dto/latency.response";
import { SpotTickerResponseDto } from "./dto/spot-ticker.response";

interface BinanceTickerResponse {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  closeTime: number;
}

interface BinanceDepthResponse {
  lastUpdateId: number;
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
}

interface BinanceTimeResponse {
  serverTime: number;
}

@Injectable()
export class MarketService {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  private get restBase(): string {
    return this.config.marketRestEndpoint.replace(/\/$/, "");
  }

  async getSpotSummary(symbol: string): Promise<SpotTickerResponseDto> {
    const response = await fetch(
      `${this.restBase}/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol.toUpperCase())}`,
    );

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`Unable to fetch ticker summary (${response.status}): ${payload}`);
    }

    const data = (await response.json()) as BinanceTickerResponse;
    return new SpotTickerResponseDto(
      data.symbol,
      Number.parseFloat(data.lastPrice),
      Number.parseFloat(data.priceChangePercent),
      Number.parseFloat(data.highPrice),
      Number.parseFloat(data.lowPrice),
      Number.parseFloat(data.volume),
      Number.parseFloat(data.quoteVolume),
      new Date(data.closeTime).toISOString(),
    );
  }

  async getOrderBook(symbol: string, limit?: number): Promise<OrderBookResponseDto> {
    const depthLimit = limit ?? this.config.marketDepthLimit;
    const response = await fetch(
      `${this.restBase}/api/v3/depth?symbol=${encodeURIComponent(symbol.toUpperCase())}&limit=${depthLimit}`,
    );

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`Unable to fetch order book (${response.status}): ${payload}`);
    }

    const data = (await response.json()) as BinanceDepthResponse;
    const bids = this.transformDepth(data.bids);
    const asks = this.transformDepth(data.asks);

    return new OrderBookResponseDto(symbol.toUpperCase(), new Date().toISOString(), bids, asks);
  }

  async getLatency(): Promise<LatencyResponseDto> {
    const started = Date.now();
    const response = await fetch(`${this.restBase}/api/v3/time`);
    const finished = Date.now();

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`Unable to fetch exchange time (${response.status}): ${payload}`);
    }

    const data = (await response.json()) as BinanceTimeResponse;
    const latency = finished - started;

    return new LatencyResponseDto(new Date(data.serverTime).toISOString(), new Date(finished).toISOString(), latency);
  }

  private transformDepth(levels: Array<[string, string]>): OrderBookLevel[] {
    let cumulative = 0;
    return levels.map(([price, quantity]) => {
      const qty = Number.parseFloat(quantity);
      cumulative += qty;
      return {
        price: Number.parseFloat(price),
        quantity: qty,
        cumulative,
      };
    });
  }
}
