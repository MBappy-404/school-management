"use client";

import * as React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BookOpenCheckIcon,
  CalendarCheckIcon,
  GraduationCapIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { AttendanceReportTab } from "@/components/reports/tabs/attendance-report";
import { ExamReportTab } from "@/components/reports/tabs/exam-report";
import { FeesReportTab } from "@/components/reports/tabs/fees-report";
import {
  DEFAULT_FILTERS,
  ReportFiltersBar,
} from "@/components/reports/report-filters";
import { StudentReportTab } from "@/components/reports/tabs/student-report";
import { TeacherReportTab } from "@/components/reports/tabs/teacher-report";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { ReportFilters, ReportTab } from "@/lib/types/reports";

const TABS: {
  value: ReportTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "students", label: "Students", icon: UsersIcon },
  { value: "teachers", label: "Teachers", icon: GraduationCapIcon },
  { value: "fees", label: "Fees", icon: WalletIcon },
  { value: "attendance", label: "Attendance", icon: CalendarCheckIcon },
  { value: "exams", label: "Exams", icon: BookOpenCheckIcon },
];

function formatRange(filters: ReportFilters): string {
  try {
    const from = format(new Date(filters.range.from), "dd MMM yyyy");
    const to = format(new Date(filters.range.to), "dd MMM yyyy");
    const presetLabel =
      filters.preset === "weekly"
        ? "Weekly"
        : filters.preset === "monthly"
          ? "Monthly"
          : "Custom";
    return `${presetLabel} · ${from} – ${to}`;
  } catch {
    return "Custom range";
  }
}

export default function ReportsPage() {
  const [tab, setTab] = React.useState<ReportTab>("students");
  const [filters, setFilters] =
    React.useState<ReportFilters>(DEFAULT_FILTERS);

  const dateRangeLabel = formatRange(filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Reporting & Export Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Drill into student, teacher, fee, attendance and exam data — and
            export to PDF or Excel in one click.
          </p>
        </div>
        <span className="hidden rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground sm:inline">
          {dateRangeLabel}
        </span>
      </motion.div>

      <ReportFiltersBar tab={tab} value={filters} onChange={setFilters} />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as ReportTab)}
        className="space-y-4"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="size-4" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="students">
          <StudentReportTab filters={filters} dateRangeLabel={dateRangeLabel} />
        </TabsContent>
        <TabsContent value="teachers">
          <TeacherReportTab filters={filters} dateRangeLabel={dateRangeLabel} />
        </TabsContent>
        <TabsContent value="fees">
          <FeesReportTab filters={filters} dateRangeLabel={dateRangeLabel} />
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceReportTab
            filters={filters}
            dateRangeLabel={dateRangeLabel}
          />
        </TabsContent>
        <TabsContent value="exams">
          <ExamReportTab filters={filters} dateRangeLabel={dateRangeLabel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
