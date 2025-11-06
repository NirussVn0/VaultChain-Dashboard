'use client';

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketOrderBook } from "@/hooks/use-market-data";
import type { OrderBookLevel } from "@/types/trading";
import type { OrderBookSnapshot } from "@/store/market-store";
import { cn, formatCurrency } from "@/lib/utils";

interface OrderBookCardProps {
  symbol?: string;
  levels: OrderBookLevel[];
}

type DepthSide = "bid" | "ask";

const motionConfig = { duration: 0.18, ease: "easeOut" } as const;

const transformSnapshot = (
  levels: OrderBookLevel[],
  snapshot?: OrderBookSnapshot,
) => {
  if (!snapshot) {
    const sortedBids = levels.filter((level) => level.type === "bid");
    const sortedAsks = levels.filter((level) => level.type === "ask");
    return { bids: sortedBids, asks: sortedAsks };
  }

  const mapSide = (side: DepthSide) =>
    (snapshot?.[side === "bid" ? "bids" : "asks"] ?? []).map((entry) => ({
      price: entry.price,
      size: entry.quantity,
      total: entry.cumulative,
      type: side,
    }));

  return {
    bids: mapSide("bid"),
    asks: mapSide("ask"),
  };
};

const computeSpread = (bids: OrderBookLevel[], asks: OrderBookLevel[]) => {
  const topBid = bids.at(0)?.price;
  const topAsk = asks.at(0)?.price;
  if (topBid == null || topAsk == null) {
    return null;
  }
  return topAsk - topBid;
};

const OrderBookColumn = ({
  title,
  levels,
  maxTotal,
}: {
  title: string;
  levels: OrderBookLevel[];
  maxTotal: number;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
      {title}
    </span>
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {levels.map((level) => (
          <motion.div
            key={`${level.type}-${level.price}`}
            layout
            initial={{ opacity: 0, y: level.type === "bid" ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: level.type === "bid" ? -4 : 4 }}
            transition={motionConfig}
            className={cn(
              "relative overflow-hidden rounded-lg border border-border/50 bg-background-elevated/40 px-3 py-2 text-xs text-text-secondary shadow-inner shadow-black/10",
              level.type === "bid" ? "border-success/40" : "border-danger/40",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 opacity-60",
                level.type === "bid" ? "bg-success/10" : "bg-danger/10",
              )}
              style={{ width: `${Math.min((level.total / maxTotal) * 100, 100)}%` }}
            />
            <div className="relative flex items-center justify-between gap-3">
              <span
                className={cn(
                  "font-semibold tracking-tight",
                  level.type === "bid" ? "text-success" : "text-danger",
                )}
              >
                {formatCurrency(level.price)}
              </span>
              <div className="flex items-center gap-3 text-[11px] uppercase">
                <span className="tracking-[0.16em]">Sz {level.size.toFixed(2)}</span>
                <span className="tracking-[0.16em] text-text-tertiary">
                  Cum {level.total.toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

/**
 * Compact order book depth visualization sourced from the live market stream.
 */
export function OrderBookCard({ symbol = "BTC-PERP", levels }: OrderBookCardProps) {
  const snapshot = useMarketOrderBook(symbol);

  const { bids, asks } = useMemo(
    () => transformSnapshot(levels, snapshot),
    [levels, snapshot],
  );

  const maxTotal = useMemo(() => {
    const totals = [...bids, ...asks].map((level) => level.total);
    return totals.length > 0 ? Math.max(...totals) : 1;
  }, [asks, bids]);

  const spread = computeSpread(bids, asks);

  return (
    <Card className="border-border/70 bg-background-surface/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Order Book Depth
            </CardTitle>
            <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
              {symbol} · Real-time
            </p>
          </div>
          {spread != null ? (
            <span className="rounded-xl border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              Spread {formatCurrency(spread)}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <OrderBookColumn title="Asks" levels={asks} maxTotal={maxTotal} />
        <OrderBookColumn title="Bids" levels={bids} maxTotal={maxTotal} />
      </CardContent>
    </Card>
  );
}
