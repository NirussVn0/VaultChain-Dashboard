export type AssetClass = "perpetual" | "spot" | "option" | "index";

export interface TradingSymbol {
  symbol: string;
  name: string;
  exchange: string;
  class: AssetClass;
  baseAsset: string;
  quoteAsset: string;
}

export const SUPPORTED_SYMBOLS: TradingSymbol[] = [
  {
    symbol: "BTC-PERP",
    name: "Bitcoin Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "BTC",
    quoteAsset: "USDT",
  },
  {
    symbol: "ETH-PERP",
    name: "Ethereum Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "ETH",
    quoteAsset: "USDT",
  },
  {
    symbol: "SOL-PERP",
    name: "Solana Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "SOL",
    quoteAsset: "USDT",
  },
  {
    symbol: "BTC-USDT",
    name: "Bitcoin Spot",
    exchange: "Coinbase Prime",
    class: "spot",
    baseAsset: "BTC",
    quoteAsset: "USDT",
  },
  {
    symbol: "ETH-USDC",
    name: "Ethereum Spot",
    exchange: "Coinbase Prime",
    class: "spot",
    baseAsset: "ETH",
    quoteAsset: "USDC",
  },
  {
    symbol: "ARB-PERP",
    name: "Arbitrum Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "ARB",
    quoteAsset: "USDT",
  },
  {
    symbol: "OP-PERP",
    name: "Optimism Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "OP",
    quoteAsset: "USDT",
  },
  {
    symbol: "BTC-GAMMA",
    name: "Bitcoin Gamma Options",
    exchange: "Deribit",
    class: "option",
    baseAsset: "BTC",
    quoteAsset: "USDC",
  },
  {
    symbol: "DEFI-INDEX",
    name: "DeFi Composite Index",
    exchange: "VaultChain DX",
    class: "index",
    baseAsset: "Various",
    quoteAsset: "USDT",
  },
];

export const DEFAULT_SYMBOL: TradingSymbol =
  SUPPORTED_SYMBOLS[0] ?? {
    symbol: "BTC-PERP",
    name: "Bitcoin Perpetual Futures",
    exchange: "VaultChain DX",
    class: "perpetual",
    baseAsset: "BTC",
    quoteAsset: "USDT",
  };
