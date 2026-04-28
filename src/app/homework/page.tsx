"use client";

import { useMemo, useState } from "react";
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  NotebookPenIcon,
  PlusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  HOMEWORK,
  type Homework,
  type HomeworkStatus,
} from "@/lib/mock-data/extended";

const STATUS_VARIANT: Record<
  HomeworkStatus,
  "warning" | "info" | "success" | "muted"
> = {
  Pending: "muted",
  Assigned: "warning",
  Submitted: "info",
  Graded: "success",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function HomeworkPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered: Homework[] = useMemo(() => {
    return HOMEWORK.filter((h) => {
      if (classFilter !== "All" && h.className !== classFilter) return false;
      if (statusFilter !== "All" && h.status !== statusFilter) return false;
      if (
        search &&
        !`${h.title} ${h.subject}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, classFilter, statusFilter]);

  const counts = {
    total: HOMEWORK.length,
    assigned: HOMEWORK.filter((h) => h.status === "Assigned").length,
    submitted: HOMEWORK.filter((h) => h.status === "Submitted").length,
    graded: HOMEWORK.filter((h) => h.status === "Graded").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Homework / Daily Diary"
        description="বাড়ির কাজ — track assignments and student submissions."
        actions={
          <Button>
            <PlusIcon /> Assign Homework
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Assigned"
          bilingualLabel="মোট"
          value={String(counts.total)}
          icon={NotebookPenIcon}
          tone="indigo"
        />
        <KpiTile
          label="Active"
          value={String(counts.assigned)}
          delta="awaiting submission"
          icon={CircleDashedIcon}
          tone="amber"
        />
        <KpiTile
          label="Submitted"
          value={String(counts.submitted)}
          delta="awaiting grading"
          icon={CheckCircle2Icon}
          tone="sky"
        />
        <KpiTile
          label="Graded"
          value={String(counts.graded)}
          delta="completed cycle"
          icon={CheckCircle2Icon}
          tone="emerald"
        />
      </section>

      <SectionCard
        title="Assignment Board"
        description="Filter by class or status. Click a card to view full description."
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search title or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={classFilter} onValueChange={(v) => setClassFilter(v ?? "All")}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All classes</SelectItem>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Graded">Graded</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((h) => (
            <article
              key={h.id}
              className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {h.subject}
                </span>
                <Badge variant={STATUS_VARIANT[h.status]}>{h.status}</Badge>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold">
                {h.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {h.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
                <span>
                  Class {h.className} ({h.section})
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="size-3" />
                  Due {formatDate(h.dueDate)}
                </span>
              </div>
              <div className="mt-1 truncate text-[11px] text-muted-foreground">
                Assigned by {h.assignedBy}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No homework matches these filters.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
