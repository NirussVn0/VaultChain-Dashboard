const SYMBOL_TO_FEED_RAW: Record<string, string> = {
  "BTC-PERP": "BTCUSDT",
  "BTC": "BTCUSDT",
  "BTC-USDT": "BTCUSDT",
  "ETH-PERP": "ETHUSDT",
  "ETH": "ETHUSDT",
  "ETH-USDC": "ETHUSDT",
  "SOL": "SOLUSDT",
  "SOL-PERP": "SOLUSDT",
  "SOL-USDT": "SOLUSDT",
};

/**
 * Maps an internal trading symbol (e.g. BTC-PERP) to an external feed symbol (BTCUSDT).
 *
 * @param symbol - Application-level trading symbol or alias.
 */
export function toFeedSymbol(symbol: string): string | null {
  const key = symbol.toUpperCase();
  return SYMBOL_TO_FEED_RAW[key] ?? null;
}

/**
 * Collection of unique feed symbols inferred from internal mappings.
 */
export const DEFAULT_FEED_SYMBOLS = Array.from(
  new Set(Object.values(SYMBOL_TO_FEED_RAW)),
);

/**
 * Reverse lookup feed symbol to primary internal symbol.
 */
export const FEED_TO_SYMBOL: Record<string, string> = Object.entries(
  SYMBOL_TO_FEED_RAW,
).reduce<Record<string, string>>((acc, [internal, feed]) => {
  if (!acc[feed]) {
    acc[feed] = internal;
  }
  return acc;
}, {});
