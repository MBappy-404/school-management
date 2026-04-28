import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "indigo"
  | "violet"
  | "muted";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  secondary: "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  outline: "border bg-transparent text-foreground",
  destructive:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  warning:
    "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  danger:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  info: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  indigo:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  muted: "bg-muted text-muted-foreground",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
