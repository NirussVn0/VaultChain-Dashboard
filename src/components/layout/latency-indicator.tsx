'use client';

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock4 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ConnectionStatus = "connecting" | "online" | "offline";

interface LatencyIndicatorProps {
  latency: number;
  status: ConnectionStatus;
  lastUpdated: number | null;
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string; pulse: string }> = {
  online: {
    label: "Live",
    color: "bg-success",
    pulse: "shadow-[0_0_0_0_rgba(16,185,129,0.35)]",
  },
  connecting: {
    label: "Syncing",
    color: "bg-warning",
    pulse: "shadow-[0_0_0_0_rgba(245,158,11,0.35)]",
  },
  offline: {
    label: "Offline",
    color: "bg-danger",
    pulse: "shadow-[0_0_0_0_rgba(239,68,68,0.35)]",
  },
};

const motionConfig = { duration: 0.24, ease: "easeOut" } as const;

export function LatencyIndicator({ latency, status, lastUpdated }: LatencyIndicatorProps) {
  const meta = statusConfig[status];

  const latencyLabel = useMemo(() => `${Math.round(latency)}ms`, [latency]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-2 text-sm">
      <div className="flex items-center gap-2 text-text-secondary">
        <Clock4 className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.16em] text-text-tertiary">
          Latency
        </span>
        <motion.span
          key={latencyLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={motionConfig}
          className="text-sm font-semibold text-text-primary"
        >
          {latencyLabel}
        </motion.span>
      </div>
      <TooltipProvider delayDuration={120}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <span
                className="relative inline-flex h-2.5 w-2.5 items-center justify-center"
                aria-hidden="true"
              >
                <motion.span
                  key={status}
                  className={`absolute inline-flex h-full w-full rounded-full ${meta.color}`}
                  animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${meta.pulse}`}
                />
              </span>
              <Badge variant="default" className="bg-background-elevated/60 text-[11px] uppercase">
                {meta.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col text-xs">
              <span>Status: {meta.label}</span>
              {lastUpdated ? (
                <span className="text-text-tertiary">
                  Updated {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              ) : (
                <span className="text-text-tertiary">Awaiting first heartbeat</span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
