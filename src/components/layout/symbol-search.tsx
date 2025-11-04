'use client';

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { AnimatePresence, motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SUPPORTED_SYMBOLS,
  type TradingSymbol,
} from "@/lib/trading-symbols";

interface SymbolSearchProps {
  value: TradingSymbol;
  onSelect: (symbol: TradingSymbol) => void;
}

const fuzzyScore = (query: string, symbol: TradingSymbol): number => {
  const haystack = [
    symbol.symbol,
    symbol.name,
    symbol.baseAsset,
    symbol.quoteAsset,
    symbol.exchange,
  ]
    .join(" ")
    .toLowerCase();

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return 1;
  }

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += token.length;
    }
  }

  return score / tokens.join("").length;
};

export function SymbolSearch({ value, onSelect }: SymbolSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredSymbols = useMemo(() => {
    if (!query.trim()) {
      return SUPPORTED_SYMBOLS.slice(0, 7);
    }

    return [...SUPPORTED_SYMBOLS]
      .map((item) => ({
        item,
        score: fuzzyScore(query, item),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [query]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2 text-left transition hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary/15"
            suppressHydrationWarning
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <div
            className="flex flex-col leading-tight"
            suppressHydrationWarning
          >
            <span className="text-sm font-semibold text-text-primary">
              {value.symbol}
            </span>
            <span className="text-xs text-text-tertiary">
              {value.name}
            </span>
          </div>
        </button>
      </Popover.Trigger>
      <AnimatePresence>
        {open ? (
          <Popover.Portal forceMount>
            <Popover.Content asChild sideOffset={12} align="start">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="z-50 w-[320px] overflow-hidden rounded-2xl border border-border/70 bg-background-surface/95 p-4 shadow-xl backdrop-blur"
              >
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background-elevated/40 px-3 py-2">
                  <Search className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search symbols, assets, exchanges..."
                    autoFocus
                    className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none"
                  />
                </div>
                <ScrollArea.Root className="mt-3 h-[220px] overflow-hidden">
                  <ScrollArea.Viewport className="pr-3">
                    <ul className="flex flex-col gap-2">
                      {filteredSymbols.map((symbol) => {
                        const isActive = value.symbol === symbol.symbol;
                        return (
                          <li key={symbol.symbol}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelect(symbol);
                                setOpen(false);
                                setQuery("");
                              }}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                  ? "border-primary/40 bg-primary/10 text-text-primary"
                                  : "bg-background-elevated/30 text-text-secondary hover:bg-background-elevated/50 hover:text-text-primary",
                              )}
                            >
                              <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold">
                                  {symbol.symbol}
                                </span>
                                <span className="text-xs text-text-tertiary">
                                  {symbol.name}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-[10px]">
                                {symbol.exchange}
                              </Badge>
                            </button>
                          </li>
                        );
                      })}
                      {filteredSymbols.length === 0 ? (
                        <motion.li
                          className="rounded-xl border border-border/50 bg-background-elevated/40 px-3 py-6 text-center text-sm text-text-tertiary"
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                        >
                          No matches found for{" "}
                          <span className="font-semibold text-text-primary">{query}</span>
                        </motion.li>
                      ) : null}
                    </ul>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className="flex touch-none select-none bg-background-elevated/20 p-1"
                    orientation="vertical"
                  >
                    <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
}
