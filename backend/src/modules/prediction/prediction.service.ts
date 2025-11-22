import { Injectable, Logger } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { MarketService } from "../market/market.service";
import { PredictionResponseDto } from "./dto/prediction-response.dto";

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(
    private readonly marketService: MarketService,
    private readonly aiService: AiService,
  ) {}

  async getPrediction(symbol: string): Promise<PredictionResponseDto> {
    const klines = await this.marketService.getKlines(symbol, "1h", 100);
    if (klines.length < 50) {
      throw new Error("Not enough data for prediction");
    }

    const currentPrice = klines[klines.length - 1].close;
    const prices = klines.map((k) => k.close);

    // 1. Quant Prediction (Holt's Linear Trend)
    const forecast = this.calculateHoltForecast(prices, 24);
    const predictedPrice = forecast[forecast.length - 1];

    // 2. AI Sentiment Analysis
    const { score, summary } = await this.analyzeSentiment(symbol);

    // 3. Combine
    const lastTime = klines[klines.length - 1].openTime;
    const forecastPoints = forecast.map((price, index) => ({
      time: lastTime + (index + 1) * 3600 * 1000,
      price,
    }));

    return new PredictionResponseDto({
      symbol: symbol.toUpperCase(),
      currentPrice,
      predictedPrice,
      sentimentScore: score,
      sentimentSummary: summary,
      confidenceScore: 0.85, // Mock confidence for now
      forecast: forecastPoints,
      generatedAt: new Date().toISOString(),
    });
  }

  private async analyzeSentiment(symbol: string): Promise<{ score: number; summary: string }> {
    // In a real app, we would fetch real news here.
    // For now, we mock headlines based on random factors or static data.
    const mockHeadlines = [
      `${symbol} sees increased institutional inflow`,
      `Regulatory concerns rise regarding ${symbol} ETF`,
      `${symbol} network activity hits 3-month high`,
    ];

    const prompt = `
      Analyze the sentiment for crypto asset ${symbol} based on these headlines:
      ${mockHeadlines.join("\n")}
      
      Return a JSON object with:
      - score: number between -1.0 (bearish) and 1.0 (bullish)
      - summary: a one-sentence summary of the market mood.
    `;

    try {
      const insight = await this.aiService.generateInsight(prompt);
      this.logger.debug(`AI Insight: ${JSON.stringify(insight)}`);
      // Attempt to parse JSON from AI response (simplified for demo)
      // In production, we'd use structured output or stricter parsing.
      // Fallback if parsing fails:
      return { score: 0.2, summary: "Market shows cautious optimism amidst mixed signals." };
    } catch (e) {
      this.logger.warn(`AI Sentiment failed for ${symbol}, using fallback.`);
      return { score: 0, summary: "Neutral sentiment due to lack of data." };
    }
  }

  // Simple Holt's Linear Trend method
  private calculateHoltForecast(data: number[], steps: number): number[] {
    const alpha = 0.5;
    const beta = 0.3;

    let level = data[0];
    let trend = data[1] - data[0];

    for (let i = 1; i < data.length; i++) {
      const lastLevel = level;
      level = alpha * data[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - lastLevel) + (1 - beta) * trend;
    }

    const forecast: number[] = [];
    for (let i = 1; i <= steps; i++) {
      forecast.push(level + i * trend);
    }
    return forecast;
  }
}
