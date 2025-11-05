import type { ComponentType, SVGProps } from "react";
import {
  Compass,
  GaugeCircle,
  LineChart,
  ShieldHalf,
  Wallet2,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activePath?: string;
}

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { label: "Overview", href: "/", icon: GaugeCircle },
  { label: "Markets", href: "/markets", icon: LineChart },
  { label: "Strategies", href: "/strategies", icon: Compass },
  { label: "Wallets", href: "/wallets", icon: Wallet2 },
  { label: "Risk Engine", href: "/risk", icon: ShieldHalf },
];

/**
 * Left navigation for the dashboard shell.
 */
export function Sidebar({ activePath = "/" }: SidebarProps) {
  return (
    <aside className="flex w-[260px] flex-col justify-between rounded-2xl border border-border bg-background-surface/70 p-6 shadow-card shadow-black/20">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-text-tertiary">
              VaultChain
            </span>
            <h1 className="mt-2 text-xl font-semibold leading-tight">
              Control Center
            </h1>
          </div>
          <Badge variant="default" className="text-[10px]">
            V2.3
          </Badge>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-text-tertiary transition-colors hover:border-border/70 hover:text-text-primary",
                  isActive &&
                    "border-border bg-background-elevated/60 text-text-primary shadow-inner shadow-primary/10",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background-elevated/40 p-4">
        <Avatar className="h-11 w-11 border-border/70">
          <AvatarFallback>AO</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">
            Aurora Ops
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
            Multi-sig wallet
          </span>
        </div>
      </div>
    </aside>
  );
}
