import { Controller, Get, Param } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { PredictionResponseDto } from "./dto/prediction-response.dto";

@Controller("prediction")
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(":symbol")
  async getPrediction(@Param("symbol") symbol: string): Promise<PredictionResponseDto> {
    return this.predictionService.getPrediction(symbol);
  }
}
