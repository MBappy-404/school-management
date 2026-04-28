"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheckIcon,
  CheckIcon,
  ClockIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLASS_OPTIONS,
  SECTION_OPTIONS,
  STUDENTS,
} from "@/lib/mock-data/reports";
import { cn } from "@/lib/utils";

type Status = "Present" | "Absent" | "Late";

const STATUS_TONE: Record<Status, string> = {
  Present:
    "bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300",
  Absent:
    "bg-rose-100 text-rose-700 ring-rose-300 dark:bg-rose-500/20 dark:text-rose-300",
  Late: "bg-amber-100 text-amber-700 ring-amber-300 dark:bg-amber-500/20 dark:text-amber-300",
};

const STATUS_ICON = {
  Present: CheckIcon,
  Absent: XIcon,
  Late: ClockIcon,
};

function defaultStatuses(classNum: string, section: string) {
  return Object.fromEntries(
    STUDENTS.filter((s) => s.className === classNum && s.section === section).map(
      (s) => [s.id, "Present" as Status],
    ),
  );
}

export default function AttendancePage() {
  const [classNum, setClassNum] = useState("5");
  const [section, setSection] = useState("A");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    defaultStatuses("5", "A"),
  );

  const classStudents = useMemo(
    () =>
      STUDENTS.filter(
        (s) => s.className === classNum && s.section === section,
      ),
    [classNum, section],
  );

  function changeClass(v: string) {
    setClassNum(v);
    setStatuses(defaultStatuses(v, section));
  }
  function changeSection(v: string) {
    setSection(v);
    setStatuses(defaultStatuses(classNum, v));
  }
  function setOne(id: string, status: Status) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }
  function bulkMark(status: Status) {
    setStatuses(
      Object.fromEntries(classStudents.map((s) => [s.id, status])),
    );
  }
  function save() {
    const summary = countByStatus();
    toast.success(
      `Saved attendance for Class ${classNum}-${section} on ${date}: ${summary.Present} present, ${summary.Late} late, ${summary.Absent} absent.`,
    );
  }

  function countByStatus() {
    const init = { Present: 0, Absent: 0, Late: 0 };
    return classStudents.reduce((acc, s) => {
      const st = statuses[s.id] ?? "Present";
      acc[st]++;
      return acc;
    }, init);
  }
  const counts = countByStatus();
  const pct =
    classStudents.length > 0
      ? Math.round(((counts.Present + counts.Late) / classStudents.length) * 100)
      : 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeader
        title="Attendance"
        description="Class-wise daily attendance marking. Choose a class and mark each student as Present, Late or Absent."
        actions={
          <Button onClick={save}>
            <SaveIcon /> Save Attendance
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Class
          </span>
          <Select
            value={classNum}
            onValueChange={(v) => changeClass(v ?? classNum)}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Section
          </span>
          <Select
            value={section}
            onValueChange={(v) => changeSection(v ?? section)}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTION_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Date
          </span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-7 w-40"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => bulkMark("Present")}>
            Mark all Present
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkMark("Absent")}>
            Mark all Absent
          </Button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <StatTile
          label="Class Strength"
          value={String(classStudents.length)}
          delta={`Class ${classNum}, Section ${section}`}
          icon={CalendarCheckIcon}
          tone="indigo"
        />
        <StatTile
          label="Present"
          value={String(counts.Present)}
          icon={CheckIcon}
          tone="emerald"
        />
        <StatTile
          label="Late"
          value={String(counts.Late)}
          icon={ClockIcon}
          tone="amber"
        />
        <StatTile
          label="Absent"
          value={String(counts.Absent)}
          delta={`Attendance ${pct}%`}
          icon={XIcon}
          tone="rose"
        />
      </section>

      {classStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          No students enrolled in Class {classNum} Section {section}.
        </div>
      ) : (
        <div className="rounded-2xl border bg-card">
          <ul className="divide-y">
            {classStudents.map((s) => {
              const status = statuses[s.id] ?? "Present";
              return (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {s.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {s.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {s.id} · Guardian: {s.guardian}
                      </div>
                    </div>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label={`Attendance for ${s.name}`}
                    className="ml-auto flex shrink-0 items-center gap-1.5"
                  >
                    {(["Present", "Late", "Absent"] as Status[]).map((opt) => {
                      const Icon = STATUS_ICON[opt];
                      const active = status === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setOne(s.id, opt)}
                          className={cn(
                            "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                            active
                              ? `${STATUS_TONE[opt]} ring-1`
                              : "border-input bg-background text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <Icon className="size-3" />
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
