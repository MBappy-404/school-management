"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BellIcon,
  BusIcon,
  CalendarCheckIcon,
  CalendarIcon,
  ClipboardListIcon,
  FileBadgeIcon,
  GraduationCapIcon,
  LibraryBigIcon,
  PinIcon,
  ScrollIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { Sparkline } from "@/components/dashboard/sparkline";
import { MultiBarChart } from "@/components/reports/charts/bar-chart";
import {
  buildAttendanceReport,
  buildExamReport,
  buildFeesReport,
  buildStudentReport,
  buildTeacherReport,
  STUDENTS,
} from "@/lib/mock-data/reports";
import { EVENTS, NOTICES } from "@/lib/mock-data/notices";
import { ADMISSIONS, BOOK_ISSUES, BUS_ROUTES } from "@/lib/mock-data/extended";
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

  const totalCollected = fees.kpis.find(
    (k) => k.label === "Total Collected",
  )?.value;
  const totalDue = fees.kpis.find((k) => k.label === "Total Due")?.value;

  const recentAdmissions = [...STUDENTS]
    .sort(
      (a, b) =>
        new Date(b.admissionDate).getTime() -
        new Date(a.admissionDate).getTime(),
    )
    .slice(0, 5);

  const upcomingEvents = [...EVENTS]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const topNotices = [...NOTICES]
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 4);

  const presentToday = attendance.kpis.find(
    (k) => k.label === "Present Today",
  )?.value;
  const avgAttendance = attendance.kpis.find(
    (k) => k.label === "Avg Attendance %",
  )?.value;

  const passRate = exams.kpis.find((k) => k.label === "Pass Rate")?.value;

  // Trend mini-data for sparklines (deterministic)
  const studentTrend = [62, 64, 66, 68, 70, 73, 76, 78, 79, 80];
  const teacherTrend = [18, 19, 19, 20, 20, 21, 22, 23, 23, 24];
  const feesTrend = fees.monthlyCollection.map((m) => {
    const num = (v: unknown) => (typeof v === "number" ? v : 0);
    return num(m.bKash) + num(m.Nagad) + num(m.Cash);
  });
  const attendanceTrend = [88, 90, 87, 91, 89, 92, 90, 93, 91, 94];

  const pendingAdmissions = ADMISSIONS.filter(
    (a) => a.status === "Pending" || a.status === "Reviewing",
  ).length;
  // Use string compare (today is always >= yesterday lexicographically)
  const todayStr = new Date().toISOString().slice(0, 10);
  const overdueBooks = BOOK_ISSUES.filter(
    (b) => !b.returned && b.dueDate < todayStr,
  ).length;
  const transportRiders = BUS_ROUTES.reduce((s, r) => s + r.occupied, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Premium hero band */}
      <div className="hero-surface relative overflow-hidden rounded-3xl border p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-bd-gradient inline-block size-2 rounded-full" />
              <span className="font-medium uppercase tracking-wider text-muted-foreground">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Badge variant="info" className="ml-1">
                Academic Year 2026
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-bd-green">Md. Ashraful</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-bangla">আপনার বিদ্যালয়ের সারসংক্ষেপ</span>{" "}
              — overview of admissions, attendance, finance and academics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button render={<Link href="/admissions" />} variant="outline">
              <FileBadgeIcon /> Admissions
              {pendingAdmissions > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {pendingAdmissions}
                </span>
              )}
            </Button>
            <Button render={<Link href="/messaging" />} variant="outline">
              <BellIcon /> Send SMS
            </Button>
            <Button render={<Link href="/reports" />}>
              View Reports <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Top KPI row with sparklines */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Students"
          bilingualLabel="শিক্ষার্থী"
          value={String(students.rows.length)}
          delta={`${students.kpis[1]?.value} male / female`}
          icon={UsersIcon}
          tone="indigo"
          trend={studentTrend}
          changePercent={4.2}
        />
        <KpiTile
          label="Total Teachers"
          bilingualLabel="শিক্ষক"
          value={String(teachers.rows.length)}
          delta={`${teachers.kpis[3]?.value ?? "—"} subjects covered`}
          icon={GraduationCapIcon}
          tone="violet"
          trend={teacherTrend}
          changePercent={2.1}
        />
        <KpiTile
          label="Fees Collected"
          bilingualLabel="ফি আদায়"
          value={totalCollected ?? "—"}
          delta={`${totalDue ?? "—"} outstanding`}
          icon={WalletIcon}
          tone="emerald"
          trend={feesTrend}
          changePercent={8.4}
        />
        <KpiTile
          label="Attendance Today"
          bilingualLabel="উপস্থিতি"
          value={presentToday ?? "—"}
          delta={`Avg ${avgAttendance ?? "—"} this month`}
          icon={CalendarCheckIcon}
          tone="sky"
          trend={attendanceTrend}
          changePercent={1.6}
        />
      </section>

      {/* Secondary KPI strip — operations health */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            <FileBadgeIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Pending Admissions
            </div>
            <div className="text-xl font-semibold tabular">
              {pendingAdmissions}
            </div>
            <Link
              href="/admissions"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Review queue →
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <LibraryBigIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Library Overdue
            </div>
            <div className="text-xl font-semibold tabular">{overdueBooks}</div>
            <Link
              href="/library"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Send reminder →
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300">
            <BusIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Transport Riders
            </div>
            <div className="text-xl font-semibold tabular">
              {transportRiders}
            </div>
            <Link
              href="/transport"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              {BUS_ROUTES.length} routes →
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
            <TrendingUpIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Pass Rate
            </div>
            <div className="text-xl font-semibold tabular">
              {passRate ?? "—"}
            </div>
            <Link
              href="/exams"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              View exams →
            </Link>
          </div>
        </div>
      </section>

      {/* Main grid: chart + side cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Fee Collection — last 6 months"
          description="Stacked by payment method (bKash / Nagad / Cash)"
          action={
            <Link
              href="/fees"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              View all payments →
            </Link>
          }
        >
          <MultiBarChart
            data={fees.monthlyCollection}
            series={["bKash", "Nagad", "Cash"]}
            stacked
            formatter={(v) => formatBDT(v, { compact: true })}
          />
        </SectionCard>

        <SectionCard
          title="Today's Snapshot"
          description="Live class & attendance figures"
        >
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2 dark:bg-emerald-500/10">
              <span className="text-emerald-900 dark:text-emerald-200">
                Present
              </span>
              <span className="font-semibold tabular text-emerald-700 dark:text-emerald-200">
                {presentToday ?? "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-amber-50/60 px-3 py-2 dark:bg-amber-500/10">
              <span className="text-amber-900 dark:text-amber-200">Late</span>
              <span className="font-semibold tabular text-amber-700 dark:text-amber-200">
                {attendance.kpis.find((k) => k.label === "Late Today")?.value ??
                  "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-rose-50/60 px-3 py-2 dark:bg-rose-500/10">
              <span className="text-rose-900 dark:text-rose-200">Absent</span>
              <span className="font-semibold tabular text-rose-700 dark:text-rose-200">
                {attendance.kpis.find((k) => k.label === "Absent Today")
                  ?.value ?? "—"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-violet-50/60 px-3 py-2 dark:bg-violet-500/10">
              <span className="text-violet-900 dark:text-violet-200">
                Pass rate
              </span>
              <span className="font-semibold tabular text-violet-700 dark:text-violet-200">
                {passRate ?? "—"}
              </span>
            </li>
          </ul>
          <div className="mt-4 rounded-xl border bg-bd-soft p-3">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Attendance · last 10 days</span>
              <span className="text-emerald-700 dark:text-emerald-300">
                +1.6%
              </span>
            </div>
            <div className="mt-1 text-emerald-600 dark:text-emerald-400">
              <Sparkline values={attendanceTrend} width={300} height={36} />
            </div>
          </div>
        </SectionCard>
      </section>

      {/* Bottom grid: 3 columns */}
      <section className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          icon={<UsersIcon className="size-4" />}
          title="Recent Admissions"
          action={
            <Link
              href="/students"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              View all →
            </Link>
          }
        >
          <ul className="flex flex-col divide-y">
            {recentAdmissions.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
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
        </SectionCard>

        <SectionCard
          icon={<ClipboardListIcon className="size-4" />}
          title="Upcoming Events"
          action={
            <Link
              href="/calendar"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Full calendar →
            </Link>
          }
        >
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
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={
                        EVENT_BADGE[e.category] ??
                        "bg-muted px-1.5 py-0.5 text-muted-foreground"
                      }
                    >
                      <span className="rounded-md px-1.5 py-0.5">
                        {e.category}
                      </span>
                    </span>
                    {e.location && <span>· {e.location}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          icon={<ScrollIcon className="size-4" />}
          title="Notice Board"
          action={
            <Link
              href="/notices"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              All notices →
            </Link>
          }
        >
          <ul className="flex flex-col gap-2.5">
            {topNotices.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-3 rounded-xl border bg-background p-3"
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${NOTICE_DOT[n.category] ?? "bg-slate-400"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {n.pinned && (
                      <PinIcon className="size-3 text-rose-500" />
                    )}
                    <span className="truncate text-sm font-medium">
                      {n.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {n.category} · {formatDate(n.publishedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </section>

      {/* Quick links shortcut grid */}
      <SectionCard
        icon={<CalendarIcon className="size-4" />}
        title="Quick Actions"
        description="Jump to commonly used modules"
      >
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { href: "/admissions", label: "New Admission", icon: FileBadgeIcon, tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300" },
            { href: "/fees", label: "Record Payment", icon: WalletIcon, tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" },
            { href: "/attendance", label: "Mark Attendance", icon: CalendarCheckIcon, tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" },
            { href: "/messaging", label: "Send SMS", icon: BellIcon, tone: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" },
            { href: "/library", label: "Issue Book", icon: LibraryBigIcon, tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" },
            { href: "/notices", label: "Publish Notice", icon: ScrollIcon, tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-lg ${a.tone}`}
                >
                  <Icon className="size-4" />
                </span>
                <span>{a.label}</span>
                <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
