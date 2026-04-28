"use client";

import { useMemo, useState } from "react";
import {
  CalendarIcon,
  CalendarPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { CALENDAR_EVENTS, type CalendarEvent } from "@/lib/mock-data/extended";
import { cn } from "@/lib/utils";

const TYPE_TONE: Record<CalendarEvent["type"], "info" | "danger" | "success" | "violet" | "warning" | "indigo"> = {
  Exam: "danger",
  Holiday: "success",
  Sports: "info",
  Cultural: "violet",
  Meeting: "warning",
  Admission: "indigo",
};

const TYPE_DOT: Record<CalendarEvent["type"], string> = {
  Exam: "bg-rose-500",
  Holiday: "bg-emerald-500",
  Sports: "bg-sky-500",
  Cultural: "bg-violet-500",
  Meeting: "bg-amber-500",
  Admission: "bg-indigo-500",
};

function buildMonth(year: number, month: number) {
  // month: 0-indexed
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (Date | null)[] = Array.from({ length: startWeekday }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(year, month, d));
  }
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const grid = useMemo(
    () => buildMonth(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const eventsByDate = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const e of CALENDAR_EVENTS) {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, []);

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" },
  );

  const upcoming = [...CALENDAR_EVENTS]
    .filter((e) => e.date >= dateKey(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const totalEvents = CALENDAR_EVENTS.length;
  const totalHolidays = CALENDAR_EVENTS.filter(
    (e) => e.type === "Holiday",
  ).length;
  const totalExams = CALENDAR_EVENTS.filter((e) => e.type === "Exam").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Academic Calendar"
        description="ক্যালেন্ডার — events, holidays, exams and admissions in one view."
        actions={<Button><CalendarPlusIcon /> Add Event</Button>}
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Events"
          value={String(totalEvents)}
          icon={CalendarIcon}
          tone="indigo"
        />
        <KpiTile
          label="Upcoming"
          value={String(upcoming.length)}
          icon={CalendarIcon}
          tone="sky"
        />
        <KpiTile
          label="Holidays"
          value={String(totalHolidays)}
          icon={CalendarIcon}
          tone="emerald"
        />
        <KpiTile
          label="Exam Events"
          value={String(totalExams)}
          icon={CalendarIcon}
          tone="rose"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title={monthLabel}
          action={
            <div className="flex gap-1">
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Previous month"
                onClick={() =>
                  setCursor((c) =>
                    c.month === 0
                      ? { year: c.year - 1, month: 11 }
                      : { year: c.year, month: c.month - 1 },
                  )
                }
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCursor({ year: today.getFullYear(), month: today.getMonth() })
                }
              >
                Today
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Next month"
                onClick={() =>
                  setCursor((c) =>
                    c.month === 11
                      ? { year: c.year + 1, month: 0 }
                      : { year: c.year, month: c.month + 1 },
                  )
                }
              >
                <ChevronRightIcon />
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              if (!d)
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-muted/20"
                  />
                );
              const k = dateKey(d);
              const events = eventsByDate.get(k) ?? [];
              const isToday = k === dateKey(today);
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-lg border bg-card p-1.5 text-left transition-colors hover:bg-muted/50",
                    isToday &&
                      "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-semibold tabular",
                      isToday && "text-indigo-700 dark:text-indigo-200",
                    )}
                  >
                    {d.getDate()}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {events.map((e) => (
                      <span
                        key={e.id}
                        title={e.title}
                        className={`size-1.5 rounded-full ${TYPE_DOT[e.type]}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(TYPE_DOT).map(([k, c]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
              >
                <span className={`size-2 rounded-full ${c}`} /> {k}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Events">
          <ul className="flex flex-col gap-2">
            {upcoming.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-xl border bg-background p-3"
              >
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2 py-1 text-center leading-tight">
                  <span className="text-[10px] uppercase">
                    {new Date(e.date).toLocaleDateString("en-GB", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-sm font-semibold">
                    {new Date(e.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{e.title}</div>
                  <div className="mt-1">
                    <Badge variant={TYPE_TONE[e.type]}>{e.type}</Badge>
                  </div>
                  {e.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
            {upcoming.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No upcoming events.
              </li>
            )}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
