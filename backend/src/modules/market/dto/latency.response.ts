export class LatencyResponseDto {
  constructor(
    readonly exchangeTime: string,
    readonly measuredAt: string,
    readonly latencyMs: number,
  ) {}
}
