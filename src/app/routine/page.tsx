"use client";

import { useMemo, useState } from "react";
import { CalendarRangeIcon, ClockIcon, PrinterIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import {
  ROUTINE_DAYS,
  ROUTINE_PERIODS,
  ROUTINE_PERIOD_TIMES,
  buildRoutine,
} from "@/lib/mock-data/extended";

const SUBJECT_TONES: Record<string, string> = {
  "Bangla 1st":
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  "Bangla 2nd":
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  "English 1st":
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  "English 2nd":
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  Mathematics:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  "Higher Math":
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "General Science":
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Physics:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Chemistry:
    "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  Biology:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  ICT: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  Religion:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  "Social Science":
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  BGS: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  "Physical Education":
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
};

export default function RoutinePage() {
  const [className, setClassName] = useState("9");
  const [section, setSection] = useState("A");

  const routine = useMemo(() => buildRoutine(className, section), [
    className,
    section,
  ]);

  const grid = useMemo(() => {
    const map = new Map<string, (typeof routine)[number]>();
    for (const p of routine) map.set(`${p.day}-${p.period}`, p);
    return map;
  }, [routine]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Class Routine"
        description="ক্লাস রুটিন — weekly period schedule for each class & section."
        actions={
          <>
            <Select value={className} onValueChange={(v) => setClassName(v ?? "9")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select value={section} onValueChange={(v) => setSection(v ?? "A")}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <PrinterIcon /> Print
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Periods / Day"
          bilingualLabel="দৈনিক ক্লাস"
          value={String(ROUTINE_PERIODS.length)}
          icon={ClockIcon}
          tone="indigo"
        />
        <KpiTile
          label="Working Days"
          bilingualLabel="দিন"
          value={`${ROUTINE_DAYS.length} (Sun-Thu)`}
          icon={CalendarRangeIcon}
          tone="emerald"
        />
        <KpiTile
          label="Total Periods / Week"
          value={String(ROUTINE_DAYS.length * ROUTINE_PERIODS.length)}
          icon={ClockIcon}
          tone="violet"
        />
        <KpiTile
          label="Class & Section"
          bilingualLabel="শাখা"
          value={`${className} (${section})`}
          icon={CalendarRangeIcon}
          tone="rose"
        />
      </section>

      <SectionCard
        title={`Weekly Routine — Class ${className} (${section})`}
        description="Sun – Thu · 7 periods (08:00 – 13:10)"
      >
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="sticky left-0 z-10 bg-muted/40 px-3 py-2.5">
                  Day
                </th>
                {ROUTINE_PERIODS.map((p, i) => (
                  <th key={p} className="px-2 py-2.5">
                    <div className="font-semibold">Period {p}</div>
                    <div className="font-normal normal-case tracking-normal text-muted-foreground/80">
                      {ROUTINE_PERIOD_TIMES[i]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROUTINE_DAYS.map((day) => (
                <tr key={day}>
                  <td className="sticky left-0 z-10 bg-card px-3 py-2 font-semibold">
                    {day}
                  </td>
                  {ROUTINE_PERIODS.map((p) => {
                    const cell = grid.get(`${day}-${p}`);
                    if (!cell) return <td key={p} className="px-2 py-2" />;
                    const tone =
                      SUBJECT_TONES[cell.subject] ?? "bg-muted text-foreground";
                    return (
                      <td key={p} className="px-2 py-2 align-top">
                        <div className={`rounded-lg px-2 py-1.5 ${tone}`}>
                          <div className="text-[11px] font-semibold leading-tight">
                            {cell.subject}
                          </div>
                          <div className="mt-0.5 truncate text-[10px] opacity-80">
                            {cell.teacher}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries({
            Bangla: "bg-rose-100 text-rose-700",
            English: "bg-sky-100 text-sky-700",
            Math: "bg-indigo-100 text-indigo-700",
            Science: "bg-emerald-100 text-emerald-700",
            Religion: "bg-amber-100 text-amber-700",
            Optional: "bg-violet-100 text-violet-700",
          }).map(([k]) => (
            <Badge key={k} variant="muted">
              {k}
            </Badge>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
