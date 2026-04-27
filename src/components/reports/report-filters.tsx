"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, RotateCcwIcon } from "lucide-react";
import type { DateRange as RDPRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  TEACHERS,
} from "@/lib/mock-data/reports";
import type {
  DateRangePreset,
  PaymentMethod,
  ReportFilters,
  ReportTab,
} from "@/lib/types/reports";
import { cn } from "@/lib/utils";

function toStr(v: string | null, fallback = "all"): string {
  return v ?? fallback;
}

export const DEFAULT_FILTERS: ReportFilters = {
  preset: "monthly",
  range: {
    from: monthAgo(),
    to: today(),
  },
  classId: "all",
  section: "all",
  studentId: "all",
  teacherId: "all",
  paymentMethod: "All",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthAgo(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function weekAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

interface ReportFiltersProps {
  tab: ReportTab;
  value: ReportFilters;
  onChange: (next: ReportFilters) => void;
}

export function ReportFiltersBar({
  tab,
  value,
  onChange,
}: ReportFiltersProps) {
  const handlePreset = (preset: DateRangePreset) => {
    if (preset === "weekly") {
      onChange({
        ...value,
        preset,
        range: { from: weekAgo(), to: today() },
      });
    } else if (preset === "monthly") {
      onChange({
        ...value,
        preset,
        range: { from: monthAgo(), to: today() },
      });
    } else {
      onChange({ ...value, preset });
    }
  };

  const dateRange: RDPRange | undefined =
    value.range.from && value.range.to
      ? {
          from: new Date(value.range.from),
          to: new Date(value.range.to),
        }
      : undefined;

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="space-y-1.5">
        <Label className="text-xs">Date Preset</Label>
        <Select
          value={value.preset}
          onValueChange={(v) => handlePreset((v ?? "monthly") as DateRangePreset)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 lg:col-span-2">
        <Label className="text-xs">Date Range</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon />
                <span className="truncate">
                  {dateRange?.from
                    ? dateRange.to
                      ? `${format(dateRange.from, "dd MMM yyyy")} — ${format(
                          dateRange.to,
                          "dd MMM yyyy",
                        )}`
                      : format(dateRange.from, "dd MMM yyyy")
                    : "Pick a range"}
                </span>
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(r) => {
                if (!r) return;
                onChange({
                  ...value,
                  preset: "custom",
                  range: {
                    from: r.from
                      ? r.from.toISOString().slice(0, 10)
                      : value.range.from,
                    to: r.to ? r.to.toISOString().slice(0, 10) : value.range.to,
                  },
                });
              }}
              numberOfMonths={2}
              defaultMonth={dateRange?.from}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Class</Label>
        <Select
          value={value.classId}
          onValueChange={(v) => onChange({ ...value, classId: toStr(v) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASS_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Section</Label>
        <Select
          value={value.section}
          onValueChange={(v) => onChange({ ...value, section: toStr(v) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {SECTION_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tab === "teachers" ? (
        <div className="space-y-1.5">
          <Label className="text-xs">Teacher</Label>
          <Select
            value={value.teacherId}
            onValueChange={(v) => onChange({ ...value, teacherId: toStr(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {TEACHERS.slice(0, 30).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-xs">Student</Label>
          <Select
            value={value.studentId}
            onValueChange={(v) => onChange({ ...value, studentId: toStr(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {STUDENTS.slice(0, 50).map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Payment Method</Label>
        <Select
          value={value.paymentMethod}
          onValueChange={(v) =>
            onChange({ ...value, paymentMethod: (v ?? "All") as PaymentMethod })
          }
          disabled={tab !== "fees"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Methods</SelectItem>
            <SelectItem value="bKash">bKash</SelectItem>
            <SelectItem value="Nagad">Nagad</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end justify-end sm:col-span-2 lg:col-span-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(DEFAULT_FILTERS)}
        >
          <RotateCcwIcon /> Reset Filters
        </Button>
      </div>
    </div>
  );
}
