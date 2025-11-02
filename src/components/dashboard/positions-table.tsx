import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Position } from "@/types/trading";

interface PositionsTableProps {
  positions: Position[];
}

/**
 * Displays active portfolio positions with performance metrics.
 */
export function PositionsTable({
  positions,
}: PositionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background-surface/80 shadow-card shadow-black/20">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <h3 className="text-lg font-semibold text-text-primary">Active Positions</h3>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
          Cross-Margin
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/60 text-left">
          <thead className="bg-background-elevated/40 text-xs uppercase tracking-[0.18em] text-text-tertiary">
            <tr className="text-[11px]">
              <th scope="col" className="px-6 py-3 font-medium">
                Asset
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Size
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Entry
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Mark
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                PnL
              </th>
              <th scope="col" className="px-6 py-3 font-medium text-right">
                Δ%
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-sm text-text-secondary">
            {positions.map((position) => {
              const pnlClass =
                position.pnl >= 0 ? "text-success" : "text-danger";
              return (
                <tr
                  key={position.id}
                  className="transition-colors hover:bg-background-elevated/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary">
                        {position.asset}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                        {position.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {position.size.toLocaleString()}
                    <span className="ml-1 text-xs uppercase text-text-tertiary">
                      {position.type === "perp" ? "CONTRACTS" : "UNITS"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(position.entry)}</td>
                  <td className="px-6 py-4">{formatCurrency(position.mark)}</td>
                  <td className={`px-6 py-4 font-semibold ${pnlClass}`}>
                    {formatCurrency(position.pnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${pnlClass}`}>
                    {formatPercent(position.pnlPercent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
