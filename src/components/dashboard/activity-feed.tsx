import type { ReactElement } from "react";

import { Activity, AlertTriangle, Bot } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import type { ActivityItem } from "@/types/trading";

interface ActivityFeedProps {
  activity: ActivityItem[];
}

const activityIcons: Record<ActivityItem["type"], ReactElement> = {
  trade: <Bot className="h-4 w-4 text-primary" />,
  alert: <AlertTriangle className="h-4 w-4 text-warning" />,
  update: <Activity className="h-4 w-4 text-accent" />,
};

/**
 * Displays recent automation, alerts, and system notices.
 */
export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card className="border-border/70 bg-background-surface/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
        <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
          System automation · last 24h
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-lg border border-border/40 bg-background-elevated/30 p-3"
          >
            <div className="mt-[2px]">{activityIcons[item.type]}</div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm text-text-secondary">{item.description}</p>
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                {formatDistanceToNowStrict(item.timestamp, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
