import { Module } from "@nestjs/common";
import { createAppConfigProvider } from "../../common/providers/app-config.provider";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";
import { MarketIndicatorService } from "./indicator.service";
import { MarketIndicatorController } from "./indicator.controller";

@Module({
  controllers: [MarketController, MarketIndicatorController],
  providers: [MarketService, MarketIndicatorService, createAppConfigProvider()],
})
export class MarketModule {}
