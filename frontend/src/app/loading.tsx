'use client';

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallback for the dashboard route.
 */
export default function Loading() {
  return (
    <div className="grid min-h-dvh gap-6 p-4 md:p-6 xl:grid-cols-[260px_1fr]">
      <div className="hidden rounded-2xl border border-border bg-background-surface/70 p-6 shadow-card shadow-black/20 xl:block" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 rounded-2xl border border-border/70" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`metric-loader-${index.toString()}`}
              className="h-28 rounded-xl border border-border/60"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)]">
          <Skeleton className="h-[420px] rounded-xl border border-border/60" />
          <Skeleton className="h-[420px] rounded-xl border border-border/60" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
          <Skeleton className="h-[360px] rounded-xl border border-border/60" />
          <Skeleton className="h-[360px] rounded-xl border border-border/60" />
        </div>
      </div>
    </div>
  );
}
