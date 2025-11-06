export class SpotTickerResponseDto {
  constructor(
    readonly symbol: string,
    readonly lastPrice: number,
    readonly priceChangePercent: number,
    readonly highPrice: number,
    readonly lowPrice: number,
    readonly volume: number,
    readonly quoteVolume: number,
    readonly closeTime: string,
  ) {}
}
