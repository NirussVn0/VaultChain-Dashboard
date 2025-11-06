import { Module } from "@nestjs/common";
import { createAppConfigProvider } from "../../common/providers/app-config.provider";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";

@Module({
  controllers: [MarketController],
  providers: [MarketService, createAppConfigProvider()],
})
export class MarketModule {}
