import { Controller, Get, Param } from "@nestjs/common";

import { MarketIndicatorService } from "./indicator.service";

@Controller({
  path: "market/indicators",
  version: "1",
})
export class MarketIndicatorController {
  constructor(private readonly indicatorService: MarketIndicatorService) {}

  @Get(":symbol")
  getIndicators(@Param("symbol") symbol: string) {
    return this.indicatorService.getIndicators(symbol.toUpperCase());
  }
}
