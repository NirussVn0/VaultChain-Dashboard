export interface WatchlistAssetDto {
  id: string;
  symbol: string;
  notes?: string | null;
  createdAt: string;
}

export interface WatchlistDto {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  assets: WatchlistAssetDto[];
}
