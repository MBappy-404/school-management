import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "violet" | "sky";
}

const TONE_BG: Record<NonNullable<StatTileProps["tone"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
};

export function StatTile({
  label,
  value,
  delta,
  icon: Icon,
  tone = "indigo",
}: StatTileProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            {value}
          </div>
          {delta && (
            <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
          )}
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            TONE_BG[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
