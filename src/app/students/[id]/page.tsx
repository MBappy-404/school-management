"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  GraduationCapIcon,
  MailIcon,
  PhoneIcon,
  PrinterIcon,
  TrendingUpIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { LineChart } from "@/components/reports/charts/line-chart";
import {
  DIARY_FOR_STUDENT_1000,
  FEE_HISTORY_FOR_STUDENT,
  HOMEWORK,
} from "@/lib/mock-data/extended";
import { STUDENTS } from "@/lib/mock-data/reports";
import { formatBDT } from "@/lib/utils/bdt";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Active: "success",
  Transferred: "warning",
  Dropout: "danger",
};

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const student = STUDENTS.find((s) => s.id === id);
  if (!student) notFound();

  const homework = HOMEWORK.filter(
    (h) => h.className === student.className,
  ).slice(0, 5);
  const dues = FEE_HISTORY_FOR_STUDENT.filter((f) => !f.paid);
  const totalPaid = FEE_HISTORY_FOR_STUDENT.filter((f) => f.paid).reduce(
    (s, f) => s + f.amount,
    0,
  );

  const performance = [
    { label: "Term 1", value: 76 },
    { label: "Term 2", value: 81 },
    { label: "Mid", value: 79 },
    { label: "Pre-final", value: 86 },
    { label: "Final", value: 89 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/students"
          className="-ml-2 inline-flex h-7 items-center gap-1 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" /> Back to Students
        </Link>
      </div>

      <PageHeader
        title={student.name}
        description={`Student Profile · ${student.id}`}
        actions={
          <>
            <Button variant="outline">
              <PrinterIcon /> Print ID
            </Button>
            <Button>Edit Profile</Button>
          </>
        }
      />

      <SectionCard
        bodyClassName="bg-bd-soft -mx-1 -mb-1 rounded-b-2xl"
      >
        <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto]">
          <div className="bg-bd-gradient flex size-20 items-center justify-center rounded-2xl text-white shadow-sm">
            <GraduationCapIcon className="size-10" />
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Class · Section
              </dt>
              <dd className="font-medium">
                {student.className} ({student.section})
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Gender
              </dt>
              <dd>{student.gender}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </dt>
              <dd>
                <Badge variant={STATUS_VARIANT[student.status] ?? "muted"}>
                  {student.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admitted
              </dt>
              <dd className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-muted-foreground" />
                {formatDate(student.admissionDate)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Guardian
              </dt>
              <dd className="inline-flex items-center gap-1.5">
                <UserIcon className="size-3.5 text-muted-foreground" />
                {student.guardian}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Contact
              </dt>
              <dd className="inline-flex items-center gap-1.5">
                <PhoneIcon className="size-3.5 text-muted-foreground" />
                {student.phone}
              </dd>
            </div>
          </dl>
          <div className="flex flex-col gap-2 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Paid
              </div>
              <div className="text-lg font-semibold tabular">
                {formatBDT(totalPaid)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Dues
              </div>
              <div
                className={`text-lg font-semibold tabular ${dues.length === 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {dues.length === 0
                  ? "Up to date"
                  : formatBDT(dues.reduce((s, d) => s + d.amount, 0))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="diary">Daily Diary</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <SectionCard title="Personal" icon={<UserIcon className="size-3.5 text-muted-foreground" />}>
              <dl className="grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-muted-foreground">Student ID</dt>
                <dd className="font-mono">{student.id}</dd>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{student.name}</dd>
                <dt className="text-muted-foreground">Gender</dt>
                <dd>{student.gender}</dd>
                <dt className="text-muted-foreground">Class</dt>
                <dd>
                  {student.className} ({student.section})
                </dd>
              </dl>
            </SectionCard>
            <SectionCard title="Guardian" icon={<UsersIcon className="size-3.5 text-muted-foreground" />}>
              <dl className="grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{student.guardian}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{student.phone}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="inline-flex items-center gap-1">
                  <MailIcon className="size-3" />
                  {student.guardian
                    .toLowerCase()
                    .replace(/\s+/g, ".")
                    .replace(/[^a-z.]/g, "")}@example.com
                </dd>
              </dl>
            </SectionCard>
            <SectionCard
              title="Quick Stats"
              icon={<TrendingUpIcon className="size-3.5 text-muted-foreground" />}
            >
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-semibold tabular">92%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average score</span>
                  <span className="font-semibold tabular">86 / 100</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending HW</span>
                  <span className="font-semibold tabular">{homework.length}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fee dues</span>
                  <span className="font-semibold tabular">
                    {formatBDT(dues.reduce((s, d) => s + d.amount, 0))}
                  </span>
                </li>
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <SectionCard
            title="Performance Trend"
            description="Average across major exams"
          >
            <LineChart data={performance} label="Avg Marks" color="#6366f1" />
          </SectionCard>
        </TabsContent>

        <TabsContent value="diary" className="mt-4">
          <SectionCard title="Daily Diary">
            <ul className="grid gap-2 lg:grid-cols-2">
              {DIARY_FOR_STUDENT_1000.map((d) => (
                <li
                  key={d.id}
                  className="rounded-xl border bg-card p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="info">{d.subject}</Badge>
                    <span className="text-muted-foreground">
                      {formatDate(d.date)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{d.note}</p>
                  <div className="mt-1 text-muted-foreground">— {d.teacher}</div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <SectionCard title="Fee History" icon={<WalletIcon className="size-3.5 text-muted-foreground" />}>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5">Month</th>
                    <th className="px-3 py-2.5">Amount</th>
                    <th className="px-3 py-2.5">Method</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {FEE_HISTORY_FOR_STUDENT.map((f) => (
                    <tr key={f.month} className="hover:bg-muted/30">
                      <td className="px-3 py-2">{f.month}</td>
                      <td className="px-3 py-2 tabular">
                        {formatBDT(f.amount)}
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="muted">{f.method}</Badge>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {f.date ? formatDate(f.date) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {f.paid ? (
                          <Badge variant="success">Paid</Badge>
                        ) : (
                          <Badge variant="danger">Due</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="homework" className="mt-4">
          <SectionCard title="Recent Homework">
            <ul className="grid gap-2 lg:grid-cols-2">
              {homework.length === 0 && (
                <li className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  No homework records.
                </li>
              )}
              {homework.map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border bg-card p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                        {h.subject}
                      </span>
                      <div className="mt-1 text-sm font-medium">{h.title}</div>
                    </div>
                    <Badge variant="warning">{h.status}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Due {formatDate(h.dueDate)} · Assigned by {h.assignedBy}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
