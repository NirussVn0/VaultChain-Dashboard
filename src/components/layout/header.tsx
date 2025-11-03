'use client';

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LatencyIndicator } from "@/components/layout/latency-indicator";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { SymbolSearch } from "@/components/layout/symbol-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useLatencyFeed } from "@/hooks/use-latency-feed";
import { DEFAULT_SYMBOL, type TradingSymbol } from "@/lib/trading-symbols";
import { MOCK_NOW } from "@/lib/mock-clock";
import { cn, formatPercent } from "@/lib/utils";
import { useSystemStore } from "@/store/system-store";

const navigationItems = [
  { id: "charts" as const, label: "Charts" },
  { id: "portfolio" as const, label: "Portfolio" },
  { id: "analytics" as const, label: "Analytics" },
];

const navTransition = { type: "spring", stiffness: 320, damping: 26 } as const;

const getTimezoneLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);

interface HeaderProps {
  symbolChange?: number;
}

/**
 * Trading command center header with live connectivity state, search, and quick actions.
 */
type SystemStoreState = ReturnType<typeof useSystemStore.getState>;
const selectActiveTab = (state: SystemStoreState) => state.activeTab;
const selectSetActiveTab = (state: SystemStoreState) => state.setActiveTab;

export function Header({ symbolChange = 0.038 }: HeaderProps) {
  const latencyState = useLatencyFeed(
    process.env["NEXT_PUBLIC_LATENCY_WS_URL"],
    { mockIntervalMs: 3200 },
  );

  const activeTab = useSystemStore(selectActiveTab);
  const setActiveTab = useSystemStore(selectSetActiveTab);

  const [selectedSymbol, setSelectedSymbol] = useState<TradingSymbol>(DEFAULT_SYMBOL);
  const [timestamp, setTimestamp] = useState<Date>(() => new Date(MOCK_NOW));

  useEffect(() => {
    const updateTimestamp = () => setTimestamp(new Date());
    const kickoff = setTimeout(updateTimestamp, 0);
    const timer = setInterval(updateTimestamp, 60_000);

    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, []);

  const timeframeLabel = useMemo(() => getTimezoneLabel(timestamp), [timestamp]);

  const breadcrumb = useMemo(
    () => [selectedSymbol.symbol, "Command"],
    [selectedSymbol.symbol],
  );

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background-surface/70 p-4 shadow-card shadow-black/25 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            VaultChain <span className="text-text-tertiary">v2.3</span>
          </span>
          <Badge variant="outline" className="bg-background-elevated/40 text-[10px] uppercase">
            Institutional
          </Badge>
        </div>
        <nav className="relative flex w-full max-w-[360px] items-center gap-1 rounded-xl border border-border/60 bg-background-elevated/40 p-1 text-sm text-text-tertiary md:w-auto">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative flex-1 rounded-lg px-4 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive ? "text-text-primary" : "hover:text-text-primary",
                )}
              >
                <span className="relative z-10">{item.label}</span>
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg border border-primary/40 bg-primary/15"
                      transition={navTransition}
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl border border-border/60 bg-background-elevated/40 text-text-primary hover:border-border hover:bg-background-elevated/60"
            aria-label="Open settings"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SymbolSearch
          value={selectedSymbol}
          onSelect={(symbol) => setSelectedSymbol(symbol)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <LatencyIndicator
            latency={latencyState.latency}
            status={latencyState.status}
            lastUpdated={latencyState.lastUpdated}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-text-tertiary">
          {breadcrumb.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  index === breadcrumb.length - 1 ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {item}
              </span>
              {index < breadcrumb.length - 1 ? (
                <ChevronRight className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-lg border border-border/60 bg-background-elevated/40 px-3 py-1 font-medium text-text-primary">
            {timeframeLabel}
          </span>
          <Badge variant={symbolChange >= 0 ? "success" : "danger"} className="text-[11px] uppercase">
            {symbolChange >= 0 ? "Bullish" : "Bearish"} {formatPercent(symbolChange)}
          </Badge>
        </div>
      </div>
    </header>
  );
}
