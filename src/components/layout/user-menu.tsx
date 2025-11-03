'use client';

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const contentMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

export function UserMenu() {
  const user = {
    name: "Aurora Ops",
    email: "ops@vaultchain.app",
  } as const;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background-elevated/40 px-3 py-2 text-sm text-text-primary hover:border-border hover:bg-background-elevated/60"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>AO</AvatarFallback>
          </Avatar>
          <div
            className="hidden flex-col leading-tight md:flex"
            suppressHydrationWarning
          >
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
              Command Suite
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
              className="z-50 w-[240px] overflow-hidden rounded-2xl border border-border/70 bg-background-surface/95 p-3 shadow-xl backdrop-blur"
            >
              <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background-elevated/40 p-3">
                <span className="text-sm font-semibold text-text-primary">
                  {user.name}
                </span>
                <span className="text-xs text-text-tertiary">{user.email}</span>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background-elevated/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-background-elevated/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
