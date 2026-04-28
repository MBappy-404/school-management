"use client";

import {
  BookOpenIcon,
  CalendarCheck2Icon,
  CheckCircle2Icon,
  ClockIcon,
  GraduationCapIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
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
  });
}

export default function ParentPortalPage() {
  const child = STUDENTS[0]!;
  const attendancePct = 92;
  const lastTerm = [
    { label: "Bangla", value: 84 },
    { label: "English", value: 79 },
    { label: "Math", value: 91 },
    { label: "Science", value: 87 },
    { label: "ICT", value: 95 },
    { label: "Social", value: 82 },
  ];
  const homework = HOMEWORK.filter((h) => h.className === child.className).slice(0, 4);
  const dues = FEE_HISTORY_FOR_STUDENT.filter((f) => !f.paid);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Parent Portal Preview"
        description="অভিভাবক পোর্টাল — what guardians see when they log in."
      />

      <SectionCard
        title="Welcome"
        description="Today's snapshot for your child."
        bodyClassName="bg-bd-soft -mx-1 -mb-1 rounded-b-2xl"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-bd-gradient flex size-14 items-center justify-center rounded-2xl text-white shadow-sm">
            <GraduationCapIcon className="size-7" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Student
            </div>
            <div className="text-lg font-semibold">{child.name}</div>
            <div className="text-xs text-muted-foreground">
              Class {child.className} ({child.section}) · ID {child.id}
            </div>
          </div>
          <Button variant="outline">View full profile</Button>
        </div>
      </SectionCard>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Attendance"
          bilingualLabel="উপস্থিতি"
          value={`${attendancePct}%`}
          delta="this month"
          icon={CalendarCheck2Icon}
          tone="emerald"
        />
        <KpiTile
          label="Avg Score"
          bilingualLabel="গড় নম্বর"
          value="86"
          delta="last term"
          icon={TrendingUpIcon}
          tone="indigo"
        />
        <KpiTile
          label="Pending HW"
          value={String(homework.length)}
          icon={BookOpenIcon}
          tone="amber"
        />
        <KpiTile
          label="Fees Due"
          value={dues.length === 0 ? "Up to date" : `${dues.length} month`}
          delta={
            dues.length === 0
              ? undefined
              : formatBDT(dues.reduce((s, d) => s + d.amount, 0))
          }
          icon={WalletIcon}
          tone={dues.length === 0 ? "emerald" : "rose"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Last Term Performance"
          description="Subject-wise marks (out of 100)"
        >
          <LineChart data={lastTerm} label="Marks" color="#6366f1" />
        </SectionCard>

        <SectionCard title="Daily Diary">
          <ul className="flex flex-col gap-2">
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
                <p className="mt-2">{d.note}</p>
                <div className="mt-1 text-muted-foreground">— {d.teacher}</div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Pending Homework">
          {homework.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No pending homework. 🎉
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {homework.map((h) => (
                <li
                  key={h.id}
                  className="flex items-start justify-between gap-2 rounded-xl border bg-card p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{h.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {h.subject} · Due {formatDate(h.dueDate)}
                    </div>
                  </div>
                  <Badge variant="warning">{h.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Fee History">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Status</th>
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
                    <td className="px-3 py-2">
                      {f.paid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2Icon className="size-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600">
                          <ClockIcon className="size-3.5" /> Due
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
