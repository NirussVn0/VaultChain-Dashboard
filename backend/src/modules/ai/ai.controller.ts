import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AiService } from "./ai.service";
import { GenerateInsightDto } from "./dto/generate-insight.dto";
import { InsightResponseDto } from "./dto/insight-response.dto";

@Controller({
  path: "ai",
  version: "1",
})
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("insights")
  @HttpCode(HttpStatus.OK)
  async generateInsight(@Body() payload: GenerateInsightDto): Promise<InsightResponseDto> {
    return this.aiService.generateInsight(payload.prompt, payload.context);
  }
}
