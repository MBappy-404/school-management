"use client";

import { AlertTriangleIcon, InboxIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportLoading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export function ReportError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangleIcon className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-rose-700">
          Failed to load report
        </p>
        <p className="text-xs text-rose-700/70">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCwIcon /> Retry
        </Button>
      )}
    </div>
  );
}

export function ReportEmpty({
  message = "No data found for the selected filters.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <InboxIcon className="size-5" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
