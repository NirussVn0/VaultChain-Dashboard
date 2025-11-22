import { Module } from "@nestjs/common";
import { PredictionController } from "./prediction.controller";
import { PredictionService } from "./prediction.service";
import { AiModule } from "../ai/ai.module";
import { MarketModule } from "../market/market.module";

@Module({
  imports: [AiModule, MarketModule],
  controllers: [PredictionController],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class PredictionModule {}
