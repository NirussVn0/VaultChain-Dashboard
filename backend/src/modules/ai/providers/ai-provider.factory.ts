import { Inject, Injectable } from "@nestjs/common";

import type { AppConfig } from "../../../common/config/app.config";
import { APP_CONFIG } from "../../../common/providers/app-config.provider";
import { GeminiProvider } from "./gemini.provider";
import { ClaudeProvider } from "./claude.provider";
import type { AiProvider } from "./ai-provider.interface";

export const AI_PROVIDER = "AI_PROVIDER_TOKEN";

@Injectable()
export class AiProviderFactory {
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  create(): AiProvider {
    const { aiProvider, geminiApiKey, claudeApiKey, aiModel, aiRequestTimeoutMs } = this.config;

    if (aiProvider === "claude") {
      return new ClaudeProvider(claudeApiKey, aiModel ?? "claude-3-sonnet-20240229", aiRequestTimeoutMs);
    }

    return new GeminiProvider(geminiApiKey, aiModel ?? "gemini-1.5-flash-latest", aiRequestTimeoutMs);
  }
}
