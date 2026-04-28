"use client";

import { useState } from "react";
import {
  BellIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  WalletIcon,
  ScrollIcon,
  SettingsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NOTIFICATIONS, type AppNotification } from "@/lib/mock-data/extended";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  attendance: CalendarCheckIcon,
  exam: ClipboardListIcon,
  fee: WalletIcon,
  notice: ScrollIcon,
  system: SettingsIcon,
} as const;

const TONE_MAP: Record<AppNotification["category"], string> = {
  attendance: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
  exam: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
  fee: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  notice: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  system:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
};

export function NotificationPanel() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((i) => i.unread).length;

  function markAllRead() {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Notifications (${unread} unread)`}
            className="relative"
          />
        }
      >
        <BellIcon className="size-4" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 inline-flex min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">
            {unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0"
      >
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">
                {unread} new
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-300"
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map((item) => {
            const Icon = ICON_MAP[item.category];
            return (
              <div
                key={item.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border-b px-3 py-2.5 last:border-b-0 hover:bg-muted/50",
                  item.unread && "bg-indigo-50/40 dark:bg-indigo-500/5",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    TONE_MAP[item.category],
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold">
                      {item.title}
                    </span>
                    {item.unread && (
                      <span className="size-1.5 shrink-0 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {item.body}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/80">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t px-3 py-2 text-center">
          <button
            type="button"
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300"
          >
            View all notifications →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
