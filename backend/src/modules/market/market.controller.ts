import { Controller, Get, Param, Query } from "@nestjs/common";

import { OrderBookQueryDto } from "./dto/orderbook-query.dto";
import { OrderBookResponseDto } from "./dto/orderbook.response";
import { LatencyResponseDto } from "./dto/latency.response";
import { SpotTickerResponseDto } from "./dto/spot-ticker.response";
import { MarketService } from "./market.service";

@Controller({
  path: "markets",
  version: "1",
})
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get("spot/:symbol/summary")
  async getSpotSummary(@Param("symbol") symbol: string): Promise<SpotTickerResponseDto> {
    return this.marketService.getSpotSummary(symbol);
  }

  @Get("spot/:symbol/orderbook")
  async getOrderBook(
    @Param("symbol") symbol: string,
    @Query() query: OrderBookQueryDto,
  ): Promise<OrderBookResponseDto> {
    return this.marketService.getOrderBook(symbol, query.limit);
  }

  @Get("latency/heartbeat")
  async getLatency(): Promise<LatencyResponseDto> {
    return this.marketService.getLatency();
  }
}
