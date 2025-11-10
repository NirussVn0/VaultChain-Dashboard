'use client';

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";

const contentMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function UserMenu() {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const initials = useMemo(() => {
    const source = user?.displayName ?? user?.email ?? "VC";
    return source
      .split(" ")
      .map((chunk) => chunk.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const subtitle = useMemo(() => {
    if (user?.roles?.length) {
      return user.roles[0]?.toLowerCase() === "admin" ? "Control Tower" : user.roles[0];
    }
    return status === "loading" ? "Syncing…" : "Guest";
  }, [status, user]);

  const email = user?.email ?? "Syncing identity…";
  const headline = user?.displayName ?? user?.email ?? "VaultChain";
  const dateLabel = formatter.format(now);
  const isHydrating = status === "idle" || status === "loading";

  const handleNavigate = (path: Route) => {
    router.push(path);
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out", {
      description: "Session closed securely.",
    });
    router.push("/login");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background-elevated/40 px-3 py-2 text-sm text-text-primary hover:border-border hover:bg-background-elevated/60"
        >
          <Avatar className="h-8 w-8 border border-border/60">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-tight md:flex" suppressHydrationWarning>
            <span className="text-sm font-semibold">{headline}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
              {isHydrating ? "Authorizing…" : subtitle}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content asChild sideOffset={12} align="end">
          <AnimatePresence>
            <motion.div
              variants={contentMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="z-50 w-[260px] overflow-hidden rounded-2xl border border-border/70 bg-background-surface/95 p-3 shadow-xl backdrop-blur"
            >
              <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background-elevated/40 p-3">
                <span className="text-sm font-semibold text-text-primary">{headline}</span>
                <span className="text-xs text-text-tertiary">{email}</span>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-text-secondary">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateLabel}
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background-elevated/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => handleNavigate("/profile" as Route)}
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background-elevated/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => handleNavigate("/settings" as Route)}
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </button>
                </DropdownMenu.Item>
              </div>
              <div className="mt-3 border-t border-border/40 pt-3">
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger transition hover:bg-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/60"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </DropdownMenu.Item>
              </div>
            </motion.div>
          </AnimatePresence>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
