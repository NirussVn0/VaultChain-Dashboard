'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, MoreHorizontal, PencilLine, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLivePositions, type LivePosition } from "@/hooks/use-live-positions";
import type { Position } from "@/types/trading";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type SortColumn = "asset" | "size" | "entry" | "mark" | "pnl" | "pnlPercent";
type SortDirection = "asc" | "desc";

interface SortState {
  column: SortColumn;
  direction: SortDirection;
}

interface PositionsTableProps {
  positions?: Position[];
}

interface PositionRowProps {
  position: LivePosition;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const DEFAULT_SORT: SortState = {
  column: "pnl",
  direction: "desc",
};

const columns: Array<{ id: SortColumn; label: string; align?: "left" | "right" }> = [
  { id: "asset", label: "Asset" },
  { id: "size", label: "Size" },
  { id: "entry", label: "Entry" },
  { id: "mark", label: "Mark" },
  { id: "pnl", label: "PnL", align: "right" },
  { id: "pnlPercent", label: "Δ%", align: "right" },
];

const sortValue = (position: LivePosition, column: SortColumn): number | string => {
  switch (column) {
    case "asset":
      return position.asset;
    case "size":
      return position.size;
    case "entry":
      return position.entry;
    case "mark":
      return position.mark;
    case "pnl":
      return position.pnl;
    case "pnlPercent":
      return position.pnlPercent;
    default:
      return 0;
  }
};

const motionConfig = { duration: 0.18, ease: "easeOut" } as const;

const SortHeader = ({
  column,
  label,
  activeSort,
  onSort,
  align = "left",
}: {
  column: SortColumn;
  label: string;
  activeSort: SortState;
  onSort: (column: SortColumn) => void;
  align?: "left" | "right";
}) => {
  const isActive = activeSort.column === column;
  const isDesc = isActive && activeSort.direction === "desc";

  return (
    <th scope="col" className={cn("px-6 py-3 font-medium", align === "right" && "text-right")}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-tertiary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>{label}</span>
        <ArrowDownUp
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isActive ? "text-primary rotate-0" : "opacity-50",
            isActive && !isDesc && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
    </th>
  );
};

const usePricePulse = (value: number) => {
  const previous = useRef(value);
  const [state, setState] = useState<"up" | "down" | "idle">("idle");

  useEffect(() => {
    if (previous.current === value) {
      return;
    }
    const trend = value > previous.current ? "up" : "down";
    const frame = requestAnimationFrame(() => setState(trend));
    previous.current = value;
    const timeout = setTimeout(() => setState("idle"), 720);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [value]);

  return state;
};

const PositionRow = ({ position, isExpanded, onToggle }: PositionRowProps) => {
  const markPulse = usePricePulse(position.mark);
  const pnlPulse = usePricePulse(position.pnl);
  const trendClass =
    position.pnl >= 0 ? "border-success/80 shadow-success/20" : "border-danger/80 shadow-danger/20";

  return (
    <>
      <tr
        key={position.id}
        className={cn(
          "group relative transition-colors hover:bg-background-elevated/30",
          position.pnl >= 0 ? "bg-success/[0.04]" : "bg-danger/[0.03]",
        )}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold text-text-primary shadow-inner transition",
                trendClass,
              )}
            >
              {position.symbol.slice(0, 3)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary">
                {position.asset}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                {position.symbol}
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-text-primary">
          {position.size.toLocaleString()}
          <span className="ml-1 text-xs uppercase text-text-tertiary">
            {position.type === "perp" ? "CONTRACTS" : "UNITS"}
          </span>
        </td>
        <td className="px-6 py-4 text-text-secondary">
          {formatCurrency(position.entry)}
        </td>
        <td className="px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={`mark-${position.id}-${position.mark.toFixed(2)}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={motionConfig}
              className={cn(
                "font-semibold",
                markPulse === "up" ? "text-success" : markPulse === "down" ? "text-danger" : "text-text-primary",
              )}
            >
              {formatCurrency(position.mark)}
            </motion.span>
          </AnimatePresence>
        </td>
        <td className="px-6 py-4 text-right">
          <AnimatePresence mode="wait">
            <motion.span
              key={`pnl-${position.id}-${position.pnl.toFixed(2)}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={motionConfig}
              className={cn(
                "font-semibold",
                position.pnl >= 0 ? "text-success" : "text-danger",
                pnlPulse === "up" ? "drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]" : null,
                pnlPulse === "down" ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.35)]" : null,
              )}
            >
              {formatCurrency(position.pnl)}
            </motion.span>
          </AnimatePresence>
        </td>
        <td className="px-6 py-4 text-right">
          <span
            className={cn(
              "font-semibold",
              position.pnlPercent >= 0 ? "text-success" : "text-danger",
            )}
          >
            {formatPercent(position.pnlPercent)}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border/50">
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Edit position</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border/50">
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close position</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg border border-border/50"
              onClick={() => onToggle(position.id)}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Toggle details</span>
            </Button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded ? (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <td colSpan={7} className="bg-background-elevated/40 px-6 pb-5 pt-2">
              <div className="grid gap-4 md:grid-cols-4">
                <DetailTile label="Notional" value={formatCurrency(position.markValue)} />
                <DetailTile
                  label="Entry Value"
                  value={formatCurrency(position.entry * position.size)}
                />
                <DetailTile
                  label="Leverage"
                  value={position.type === "perp" ? `${Math.max(position.markValue / (position.markValue - position.pnl || 1), 1).toFixed(1)}×` : "Spot"}
                />
                <DetailTile
                  label="24h Funding"
                  value={formatCurrency((position.ticker?.changePercent ?? 0) * position.markValue, "USD")}
                />
              </div>
            </td>
          </motion.tr>
        ) : null}
      </AnimatePresence>
    </>
  );
};

const DetailTile = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-background/40 p-3">
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
      {label}
    </span>
    <span className="text-sm font-semibold text-text-primary">{value}</span>
  </div>
);

const buildLiveFallback = (positions: Position[] | undefined): LivePosition[] => {
  if (!positions) {
    return [];
  }
  return positions.map((position) => ({
    ...position,
    markValue: position.mark * position.size,
    ticker: null,
  }));
};

export function PositionsTable({ positions }: PositionsTableProps) {
  const livePositions = useLivePositions();
  const dataset = livePositions.length > 0 ? livePositions : buildLiveFallback(positions);

  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [expanded, setExpanded] = useState<string | null>(null);

  const sortedPositions = useMemo(() => {
    const entries = [...dataset];
    entries.sort((a, b) => {
      const aValue = sortValue(a, sort.column);
      const bValue = sortValue(b, sort.column);

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numericA = Number(aValue ?? 0);
      const numericB = Number(bValue ?? 0);

      return sort.direction === "asc" ? numericA - numericB : numericB - numericA;
    });
    return entries;
  }, [dataset, sort.column, sort.direction]);

  const unreadPositions = sortedPositions.filter((position) => position.pnl < 0).length;

  const handleSort = (column: SortColumn) => {
    setSort((current) => {
      if (current.column === column) {
        return {
          column,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { column, direction: column === "asset" ? "asc" : "desc" };
    });
  };

  const handleToggleRow = (id: string) => {
    setExpanded((current) => (current === id ? null : id));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-background-surface/85 shadow-card shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-text-primary">Active Positions</h3>
          <Badge variant="outline" className="text-[11px] uppercase">
            {sortedPositions.length} open
          </Badge>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-text-tertiary">
          {unreadPositions > 0 ? `${unreadPositions} at risk` : "Cross-Margin"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/60 text-left">
          <thead className="bg-background-elevated/40">
            <tr className="text-[11px]">
              {columns.map((column) => (
                <SortHeader
                  key={column.id}
                  column={column.id}
                  label={column.label}
                  activeSort={sort}
                  onSort={handleSort}
                  align={column.align ?? "left"}
                />
              ))}
              <th scope="col" className="px-6 py-3 text-right text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-sm text-text-secondary">
            {sortedPositions.map((position) => (
              <PositionRow
                key={position.id}
                position={position}
                isExpanded={expanded === position.id}
                onToggle={handleToggleRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
