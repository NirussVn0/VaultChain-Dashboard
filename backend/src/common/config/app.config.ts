export interface AppConfig {
  port: number;
  globalPrefix: string;
  corsOrigin: string;
  aiProvider: "gemini" | "claude";
  geminiApiKey?: string;
  claudeApiKey?: string;
  aiModel?: string;
  aiRequestTimeoutMs: number;
  marketRestEndpoint: string;
  marketDepthLimit: number;
}

export const configuration = (): { app: AppConfig } => ({
  app: {
    port: Number(process.env.PORT) || 4000,
    globalPrefix: process.env.GLOBAL_PREFIX ?? "api",
    corsOrigin: process.env.FRONTEND_ORIGIN ?? "*",
    aiProvider: (process.env.AI_PROVIDER as "gemini" | "claude") ?? "gemini",
    geminiApiKey: process.env.GEMINI_API_KEY,
    claudeApiKey: process.env.CLAUDE_API_KEY,
    aiModel: process.env.AI_MODEL ?? "gemini-1.5-flash-latest",
    aiRequestTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 8000,
    marketRestEndpoint: process.env.MARKET_REST_ENDPOINT ?? "https://api.binance.com",
    marketDepthLimit: Number(process.env.MARKET_DEPTH_LIMIT) || 50,
  },
});
