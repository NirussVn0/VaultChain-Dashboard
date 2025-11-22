export class PredictionResponseDto {
  symbol!: string;
  currentPrice!: number;
  predictedPrice!: number;
  sentimentScore!: number; // -1 to 1
  sentimentSummary!: string;
  confidenceScore!: number; // 0 to 1
  forecast!: Array<{ time: number; price: number }>; // Next 24h forecast
  generatedAt!: string;

  constructor(partial: Partial<PredictionResponseDto>) {
    Object.assign(this, partial);
  }
}
