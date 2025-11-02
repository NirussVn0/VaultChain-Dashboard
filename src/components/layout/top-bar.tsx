import { Bell, Cpu, Plus, Settings2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopBarProps {
  latencyMs: number;
}

/**
 * Dashboard header with quick actions and system status.
 */
export function TopBar({ latencyMs }: TopBarProps) {
  const now = new Date();
  const formattedDate = format(now, "EEE, MMM d · HH:mm zzz");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background-surface/70 px-6 py-4 shadow-card shadow-black/20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">BTC-PERP Command</h2>
          <Badge variant="success">Live</Badge>
        </div>
        <p className="text-sm text-text-tertiary">{formattedDate}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background-elevated/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
                <Cpu className="h-4 w-4 text-accent" aria-hidden="true" />
                Latency {latencyMs}ms
              </div>
            </TooltipTrigger>
            <TooltipContent>
              End-to-end execution latency through the Railway CQRS service mesh.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-2">
          <Button size="md" variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
          <Button variant="outline" className="gap-2 border-border/70">
            <Settings2 className="h-4 w-4" />
            Risk Check
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-danger" />
          </Button>
        </div>
      </div>
    </div>
  );
}
