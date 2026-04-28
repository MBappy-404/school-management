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
  type Homework,
  type HomeworkStatus,
} from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/dashboard/form-field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const HOMEWORK = useSchoolStore((s) => s.homework);
  const addHomework = useSchoolStore((s) => s.addHomework);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    title: "",
    subject: "Bangla",
    className: "6",
    teacher: "Md. Ashraful Islam",
    description: "",
    dueDate: new Date(Date.now() + 3 * 86400000)
      .toISOString()
      .slice(0, 10),
  }));

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
  }, [HOMEWORK, search, classFilter, statusFilter]);

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
          <Button onClick={() => setCreateOpen(true)}>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Homework</DialogTitle>
            <DialogDescription>
              Assign a new homework / daily diary entry to a class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Title" className="sm:col-span-2">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Chapter 4 — Geometry exercises 4.1 to 4.3"
              />
            </FormField>
            <FormField label="Subject">
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </FormField>
            <FormField label="Class">
              <Select
                value={form.className}
                onValueChange={(v) =>
                  setForm({ ...form, className: v ?? "6" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Teacher">
              <Input
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              />
            </FormField>
            <FormField label="Due Date">
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </FormField>
            <FormField label="Description" className="sm:col-span-2">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.title.trim()) {
                  toast.error("Title required");
                  return;
                }
                const hw: Homework = {
                  id: `HW-${Date.now().toString().slice(-5)}`,
                  title: form.title.trim(),
                  subject: form.subject,
                  className: form.className,
                  section: "A",
                  assignedBy: form.teacher,
                  assignedOn: new Date().toISOString().slice(0, 10),
                  dueDate: form.dueDate,
                  status: "Assigned",
                  description: form.description,
                };
                addHomework(hw);
                toast.success(`Assigned: ${hw.title}`);
                setCreateOpen(false);
                setForm((f) => ({ ...f, title: "", description: "" }));
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
