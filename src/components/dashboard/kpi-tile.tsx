import type { LucideIcon } from "lucide-react";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: string;
  icon?: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "violet" | "sky" | "teal";
  trend?: number[];
  changePercent?: number; // signed
  bilingualLabel?: string; // bangla label shown subtly
}

const TONE_BG: Record<NonNullable<KpiTileProps["tone"]>, string> = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300",
};

const TONE_SPARK: Record<NonNullable<KpiTileProps["tone"]>, string> = {
  indigo: "text-indigo-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
  violet: "text-violet-500",
  sky: "text-sky-500",
  teal: "text-teal-500",
};

export function KpiTile({
  label,
  value,
  delta,
  icon: Icon,
  tone = "indigo",
  trend,
  changePercent,
  bilingualLabel,
}: KpiTileProps) {
  const positive = changePercent !== undefined && changePercent >= 0;
  return (
    <div className="tile-sheen group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md">
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          tone === "indigo" && "bg-gradient-to-r from-transparent via-indigo-500 to-transparent",
          tone === "emerald" && "bg-gradient-to-r from-transparent via-emerald-500 to-transparent",
          tone === "amber" && "bg-gradient-to-r from-transparent via-amber-500 to-transparent",
          tone === "rose" && "bg-gradient-to-r from-transparent via-rose-500 to-transparent",
          tone === "violet" && "bg-gradient-to-r from-transparent via-violet-500 to-transparent",
          tone === "sky" && "bg-gradient-to-r from-transparent via-sky-500 to-transparent",
          tone === "teal" && "bg-gradient-to-r from-transparent via-teal-500 to-transparent",
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            {bilingualLabel && (
              <div className="font-bangla text-[11px] text-muted-foreground/70">
                {bilingualLabel}
              </div>
            )}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight tabular">
            {value}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {changePercent !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 text-[10px] font-semibold",
                  positive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
                )}
              >
                {positive ? (
                  <ArrowUpRightIcon className="size-3" />
                ) : (
                  <ArrowDownRightIcon className="size-3" />
                )}
                {Math.abs(changePercent).toFixed(1)}%
              </span>
            )}
            {delta && <span className="truncate">{delta}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              TONE_BG[tone],
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>
      {trend && trend.length > 1 && (
        <div className={cn("mt-3", TONE_SPARK[tone])}>
          <Sparkline
            values={trend}
            width={240}
            height={32}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
