export interface OrderBookLevel {
  price: number;
  quantity: number;
  cumulative: number;
}

export class OrderBookResponseDto {
  constructor(
    readonly symbol: string,
    readonly lastUpdated: string,
    readonly bids: OrderBookLevel[],
    readonly asks: OrderBookLevel[],
  ) {}
}
