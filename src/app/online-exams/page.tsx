"use client";

import {
  CheckCircle2Icon,
  ClockIcon,
  FileQuestionIcon,
  PlusIcon,
  RadioIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { ONLINE_EXAMS } from "@/lib/mock-data/extended";

const STATUS_VARIANT: Record<
  string,
  "muted" | "info" | "danger" | "success"
> = {
  Draft: "muted",
  Published: "info",
  Live: "danger",
  Ended: "success",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OnlineExamsPage() {
  const total = ONLINE_EXAMS.length;
  const live = ONLINE_EXAMS.filter((e) => e.status === "Live").length;
  const upcoming = ONLINE_EXAMS.filter(
    (e) => e.status === "Published" || e.status === "Draft",
  ).length;
  const totalAttempts = ONLINE_EXAMS.reduce((s, e) => s + e.attempts, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Online Exams"
        description="অনলাইন পরীক্ষা — quiz creation, scheduling and live monitoring."
        actions={
          <Button>
            <PlusIcon /> Create Exam
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Exams"
          value={String(total)}
          icon={FileQuestionIcon}
          tone="indigo"
        />
        <KpiTile
          label="Live Now"
          value={String(live)}
          delta="ongoing"
          icon={RadioIcon}
          tone="rose"
        />
        <KpiTile
          label="Upcoming / Drafts"
          value={String(upcoming)}
          icon={ClockIcon}
          tone="amber"
        />
        <KpiTile
          label="Total Attempts"
          value={String(totalAttempts)}
          icon={CheckCircle2Icon}
          tone="emerald"
        />
      </section>

      <SectionCard title="Exam Schedule">
        <div className="grid gap-3 lg:grid-cols-2">
          {ONLINE_EXAMS.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {e.id}
                  </div>
                  <h3 className="mt-0.5 text-sm font-semibold">{e.title}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Class {e.className} · {e.subject}
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[e.status] ?? "muted"}>
                  {e.status === "Live" ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 animate-pulse rounded-full bg-current" />
                      Live
                    </span>
                  ) : (
                    e.status
                  )}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/40 p-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Duration
                  </div>
                  <div className="text-sm font-semibold tabular">
                    {e.duration} min
                  </div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Questions
                  </div>
                  <div className="text-sm font-semibold tabular">
                    {e.totalQuestions}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/40 p-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Marks
                  </div>
                  <div className="text-sm font-semibold tabular">
                    {e.totalMarks}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-muted-foreground">
                  Scheduled: {formatDate(e.scheduledOn)}
                </span>
                {e.attempts > 0 && (
                  <span className="text-muted-foreground">
                    {e.attempts} attempts ·{" "}
                    {e.passRate > 0 ? `${e.passRate}% pass` : "in progress"}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
