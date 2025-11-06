import type { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AppConfig } from "../config/app.config";

export const APP_CONFIG = "APP_CONFIG";

export const createAppConfigProvider = (): Provider => ({
  provide: APP_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    configService.get<AppConfig>("app", {
      port: 4000,
      globalPrefix: "api",
      corsOrigin: "*",
      aiProvider: "gemini",
      aiRequestTimeoutMs: 8000,
      geminiApiKey: undefined,
      claudeApiKey: undefined,
      aiModel: "gemini-1.5-flash-latest",
      marketRestEndpoint: "https://api.binance.com",
      marketDepthLimit: 50,
    }),
});
