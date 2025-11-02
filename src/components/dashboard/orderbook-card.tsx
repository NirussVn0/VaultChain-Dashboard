import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { OrderBookLevel } from "@/types/trading";

interface OrderBookCardProps {
  levels: OrderBookLevel[];
}

/**
 * Compact order book depth visualization.
 */
export function OrderBookCard({ levels }: OrderBookCardProps) {
  const maxTotal = Math.max(...levels.map((level) => level.total));
  const bids = levels.filter((level) => level.type === "bid");
  const asks = levels.filter((level) => level.type === "ask");

  return (
    <Card className="border-border/70 bg-background-surface/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-text-primary">
          Order Book Depth
        </CardTitle>
        <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
          BTC-PERP · 25x Leverage
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
            Asks
          </span>
          <div className="space-y-2">
            {asks.map((level) => (
              <OrderBookRow
                key={`ask-${level.price}`}
                level={level}
                maxTotal={maxTotal}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-tertiary">
            Bids
          </span>
          <div className="space-y-2">
            {bids.map((level) => (
              <OrderBookRow
                key={`bid-${level.price}`}
                level={level}
                maxTotal={maxTotal}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrderBookRowProps {
  level: OrderBookLevel;
  maxTotal: number;
}

function OrderBookRow({ level, maxTotal }: OrderBookRowProps) {
  const depthPercent = (level.total / maxTotal) * 100;
  const isBid = level.type === "bid";

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/50 bg-background-elevated/40 px-3 py-2 text-xs text-text-secondary">
      <div
        className={`absolute inset-0 ${isBid ? "bg-success/10" : "bg-danger/10"}`}
        style={{ width: `${Math.min(depthPercent, 100)}%` }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <span
          className={`font-semibold ${
            isBid ? "text-success" : "text-danger"
          } tracking-tight`}
        >
          {formatCurrency(level.price)}
        </span>
        <div className="flex items-center gap-3 text-[11px] uppercase">
          <span className="tracking-[0.16em]">
            Size: {level.size.toFixed(2)}
          </span>
          <span className="tracking-[0.16em] text-text-tertiary">
            Total: {level.total.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
