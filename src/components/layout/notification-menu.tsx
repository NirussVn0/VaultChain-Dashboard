'use client';

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSystemStore } from "@/store/system-store";

const severityMap: Record<"info" | "warning" | "success", { label: string; color: string }> = {
  info: { label: "Info", color: "text-primary" },
  warning: { label: "Warning", color: "text-warning" },
  success: { label: "Success", color: "text-success" },
};

const contentMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

type NotificationStore = ReturnType<typeof useSystemStore.getState>;
const selectNotifications = (state: NotificationStore) => state.notifications;
const selectMarkAllRead = (state: NotificationStore) => state.markAllNotificationsRead;

export function NotificationMenu() {
  const notifications = useSystemStore(selectNotifications);
  const markAllNotificationsRead = useSystemStore(selectMarkAllRead);

  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  useEffect(() => {
    if (open) {
      markAllNotificationsRead();
    }
  }, [markAllNotificationsRead, open]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl border border-border/60 bg-background-elevated/40 text-text-primary hover:border-border hover:bg-background-elevated/60"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <AnimatePresence>
            {unreadCount > 0 ? (
              <motion.span
                className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-text-primary"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {unreadCount}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <AnimatePresence>
          {open ? (
            <DropdownMenu.Content asChild sideOffset={12} align="end">
              <motion.div
                variants={contentMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="z-50 w-[320px] overflow-hidden rounded-2xl border border-border/70 bg-background-surface/95 p-3 shadow-xl backdrop-blur"
              >
                <header className="flex items-center justify-between px-1 py-1">
                  <span className="text-sm font-semibold text-text-primary">
                    Notifications
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {notifications.length} total
                  </Badge>
                </header>
                <div className="mt-2 flex flex-col gap-2">
                  {notifications.map((notification) => {
                    const meta = severityMap[notification.severity];
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        className={cn(
                          "rounded-xl border border-border/50 bg-background-elevated/40 p-3",
                          notification.read ? "opacity-80" : "shadow-card/20",
                        )}
                        initial={{ opacity: 0.6, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-text-primary">
                            {notification.title}
                          </span>
                        <span className={cn("text-xs font-medium", meta.color)}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-text-tertiary">
                          {notification.description}
                        </p>
                        <time
                          className="mt-2 inline-block text-[10px] uppercase tracking-[0.16em] text-text-muted"
                          dateTime={new Date(notification.createdAt).toISOString()}
                          suppressHydrationWarning
                        >
                          {formatDistanceToNowStrict(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </time>
                      </motion.div>
                    );
                  })}
                  {notifications.length === 0 ? (
                    <motion.div
                      className="rounded-xl border border-border/50 bg-background-elevated/40 px-3 py-6 text-center text-sm text-text-tertiary"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                    >
                      You&apos;re all caught up.
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            </DropdownMenu.Content>
          ) : null}
        </AnimatePresence>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
