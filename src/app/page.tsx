"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarCheckIcon,
  CalendarIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  PinIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { MultiBarChart } from "@/components/reports/charts/bar-chart";
import {
  buildFeesReport,
  buildStudentReport,
  buildTeacherReport,
  buildAttendanceReport,
  buildExamReport,
  STUDENTS,
} from "@/lib/mock-data/reports";
import { EVENTS, NOTICES } from "@/lib/mock-data/notices";
import { formatBDT } from "@/lib/utils/bdt";

const NOTICE_DOT: Record<string, string> = {
  Academic: "bg-indigo-500",
  Event: "bg-violet-500",
  Holiday: "bg-emerald-500",
  Exam: "bg-rose-500",
  General: "bg-slate-400",
};

const EVENT_BADGE: Record<string, string> = {
  Exam: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  Holiday:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Sports: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  Cultural:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  Meeting: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRelative(iso: string): string {
  const days = Math.round(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

export default function DashboardPage() {
  const fees = buildFeesReport();
  const students = buildStudentReport();
  const teachers = buildTeacherReport();
  const attendance = buildAttendanceReport();
  const exams = buildExamReport();

  // Total fees collected this academic year
  const totalCollected = fees.kpis.find(
    (k) => k.label === "Total Collected",
  )?.value;
  const totalDue = fees.kpis.find((k) => k.label === "Total Due")?.value;

  // Latest 5 admissions by date
  const recentAdmissions = [...STUDENTS]
    .sort(
      (a, b) =>
        new Date(b.admissionDate).getTime() -
        new Date(a.admissionDate).getTime(),
    )
    .slice(0, 5);

  // Top 4 upcoming events — compare ISO date strings lexicographically
  // (events are seeded relative to "today" so they are already in the future)
  const upcomingEvents = [...EVENTS]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  // Pinned notices first, then by date
  const topNotices = [...NOTICES]
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 4);

  // Today's attendance numbers
  const presentToday = attendance.kpis.find(
    (k) => k.label === "Present Today",
  )?.value;
  const avgAttendance = attendance.kpis.find(
    (k) => k.label === "Avg Attendance %",
  )?.value;

  // Pass rate
  const passRate = exams.kpis.find((k) => k.label === "Pass Rate")?.value;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="At-a-glance health of the school — students, teachers, fees, attendance and exams."
        actions={
          <Button render={<Link href="/reports" />} variant="outline">
            View Reports <ArrowRightIcon />
          </Button>
        }
      />

      {/* Top KPI row */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total Students"
          value={String(students.rows.length)}
          delta={`${students.kpis[1]?.value} male / female`}
          icon={UsersIcon}
          tone="indigo"
        />
        <StatTile
          label="Total Teachers"
          value={String(teachers.rows.length)}
          delta={`${teachers.kpis[3]?.value ?? "—"} subjects covered`}
          icon={GraduationCapIcon}
          tone="violet"
        />
        <StatTile
          label="Fees Collected"
          value={totalCollected ?? "—"}
          delta={`${totalDue ?? "—"} outstanding`}
          icon={WalletIcon}
          tone="emerald"
        />
        <StatTile
          label="Attendance Today"
          value={presentToday ?? "—"}
          delta={`Avg ${avgAttendance ?? "—"} this month`}
          icon={CalendarCheckIcon}
          tone="sky"
        />
      </section>

      {/* Main grid: chart + side cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Fee Collection — last 6 months</h2>
              <p className="text-xs text-muted-foreground">
                Stacked by payment method (bKash, Nagad, Cash)
              </p>
            </div>
            <Link
              href="/fees"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              View all payments →
            </Link>
          </div>
          <MultiBarChart
            data={fees.monthlyCollection}
            series={["bKash", "Nagad", "Cash"]}
            stacked
            formatter={(v) => formatBDT(v, { compact: true })}
          />
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Today&apos;s Snapshot</h2>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2">
              <span className="text-emerald-900">Present</span>
              <span className="font-semibold text-emerald-700">
                {presentToday ?? "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-amber-50/60 px-3 py-2">
              <span className="text-amber-900">Late</span>
              <span className="font-semibold text-amber-700">
                {attendance.kpis.find((k) => k.label === "Late Today")?.value ??
                  "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-rose-50/60 px-3 py-2">
              <span className="text-rose-900">Absent</span>
              <span className="font-semibold text-rose-700">
                {attendance.kpis.find((k) => k.label === "Absent Today")
                  ?.value ?? "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-violet-50/60 px-3 py-2">
              <span className="text-violet-900">Pass rate</span>
              <span className="font-semibold text-violet-700">
                {passRate ?? "—"}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Bottom grid: 3 columns */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Recent admissions */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent Admissions</h2>
            <Link
              href="/students"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="flex flex-col divide-y">
            {recentAdmissions.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {s.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Class {s.className} ({s.section}) · {s.id}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {formatRelative(s.admissionDate)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming events */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Events</h2>
            <ClipboardListIcon className="size-4 text-muted-foreground" />
          </div>
          <ul className="flex flex-col gap-2.5">
            {upcomingEvents.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No upcoming events.
              </li>
            )}
            {upcomingEvents.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-xl border bg-background p-3"
              >
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2 py-1 text-center leading-tight">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    {new Date(e.date).toLocaleDateString("en-GB", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-sm font-semibold">
                    {new Date(e.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.title}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${EVENT_BADGE[e.category] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {e.category}
                    </span>
                    {e.location && (
                      <span className="truncate text-[11px] text-muted-foreground">
                        <CalendarIcon className="mr-1 inline size-3" />
                        {e.location}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Notices */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Notice Board</h2>
            <Link
              href="/notices"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              All notices →
            </Link>
          </div>
          <ul className="flex flex-col divide-y">
            {topNotices.map((n) => (
              <li key={n.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${NOTICE_DOT[n.category] ?? "bg-slate-400"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-1.5">
                    {n.pinned && (
                      <PinIcon className="size-3 shrink-0 text-amber-500" />
                    )}
                    <span className="line-clamp-1 text-sm font-medium">
                      {n.title}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {n.body}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <BellIcon className="size-3" />
                    <span>{formatRelative(n.publishedAt)}</span>
                    <span>·</span>
                    <span>{n.audience}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
