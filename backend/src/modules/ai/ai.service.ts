import { Inject, Injectable, Logger } from "@nestjs/common";

import { InsightResponseDto } from "./dto/insight-response.dto";
import type { AiProvider } from "./providers/ai-provider.interface";
import { AI_PROVIDER } from "./providers/ai-provider.factory";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(AI_PROVIDER) private readonly provider: AiProvider,
  ) {}

  async generateInsight(prompt: string, context?: Record<string, unknown>): Promise<InsightResponseDto> {
    try {
      const insight = await this.provider.generateInsight(prompt, context);
      return new InsightResponseDto(this.provider.name, insight);
    } catch (error) {
      this.logger.error("Failed to generate AI insight", error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }
}
