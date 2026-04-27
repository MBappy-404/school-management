import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CalendarCheckIcon,
  GraduationCapIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Student Reports",
    description:
      "Class-wise rolls, gender split, admissions and dropout tracking.",
    icon: UsersIcon,
  },
  {
    title: "Teacher Reports",
    description: "Roster, attendance summary and monthly payroll trends.",
    icon: GraduationCapIcon,
  },
  {
    title: "Fees Reports",
    description: "Bangladesh-first: bKash, Nagad and Cash collection breakdown.",
    icon: WalletIcon,
  },
  {
    title: "Attendance Reports",
    description: "Daily, weekly, monthly and class-wise attendance percentages.",
    icon: CalendarCheckIcon,
  },
  {
    title: "Exam Reports",
    description: "GPA distribution, pass/fail ratio and SSC-style top students.",
    icon: BookOpenCheckIcon,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-6 py-12 sm:px-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
          Reporting &amp; Export Center
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          School Management System
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          A modern, production-ready reporting console for{" "}
          <span className="font-medium text-foreground">
            Bangladesh Model High School
          </span>
          . Drill into students, teachers, fees, attendance and exams — and
          download the full report as PDF or Excel in one click.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link href="/reports" />}>
            Open Reports <ArrowRightIcon />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={
              <a
                href="https://github.com/MBappy-404/school-management"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            View on GitHub
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="group rounded-2xl border bg-card p-5 transition hover:border-indigo-200 hover:shadow-sm"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon className="size-5" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Built with Next.js 16 · Tailwind 4 · ShadCN · TanStack Table · Recharts
        · jsPDF · SheetJS
      </p>
    </main>
  );
}
