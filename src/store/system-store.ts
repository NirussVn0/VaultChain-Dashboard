import { create } from "zustand";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  read: boolean;
  severity: "info" | "warning" | "success";
}

type NavigationTab = "charts" | "portfolio" | "analytics";

interface SystemState {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  notifications: NotificationItem[];
  addNotification: (notification: NotificationItem) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Strategy Rebalance",
    description: "Quant Edge rotated 12% into AI Momentum basket.",
    createdAt: Date.now() - 1000 * 60 * 9,
    read: false,
    severity: "info",
  },
  {
    id: "notif-2",
    title: "Funding Alert",
    description: "BTC-PERP funding premium exceeded 18 bps.",
    createdAt: Date.now() - 1000 * 60 * 32,
    read: false,
    severity: "warning",
  },
  {
    id: "notif-3",
    title: "Execution Report",
    description: "Auto-hedge completed for SOL basis spread.",
    createdAt: Date.now() - 1000 * 60 * 66,
    read: true,
    severity: "success",
  },
];

/**
 * Global system store for high-level UI state such as top navigation and notifications.
 */
export const useSystemStore = create<SystemState>((set, get) => ({
  activeTab: "charts",
  setActiveTab: (tab) => set({ activeTab: tab }),
  notifications: initialNotifications,
  addNotification: (notification) =>
    set({ notifications: [notification, ...get().notifications] }),
  markAllNotificationsRead: () =>
    set({
      notifications: get().notifications.map((item) => ({
        ...item,
        read: true,
      })),
    }),
  getUnreadCount: () => get().notifications.filter((item) => !item.read).length,
}));
