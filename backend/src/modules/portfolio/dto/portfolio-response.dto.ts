export interface PortfolioPositionDto {
  id: string;
  symbol: string;
  quantity: number;
  costBasis: number;
  averageEntryPrice: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSummaryDto {
  id: string;
  name: string;
  baseCurrency: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  totalCost: number;
  totalQuantity: number;
  positions: PortfolioPositionDto[];
}
