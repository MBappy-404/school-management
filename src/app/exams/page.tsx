"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AwardIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/reports/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { FormField } from "@/components/dashboard/form-field";
import { CLASS_OPTIONS, EXAM_RESULTS } from "@/lib/mock-data/reports";
import type { ExamRow } from "@/lib/types/reports";

const EXAMS = ["First Term", "Mid Term", "Final Term"] as const;

const GRADE_TONE: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-800",
  A: "bg-emerald-50 text-emerald-700",
  "A-": "bg-sky-50 text-sky-700",
  B: "bg-indigo-50 text-indigo-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-orange-50 text-orange-700",
  F: "bg-rose-100 text-rose-700",
};

function gradeFromGpa(gpa: number): string {
  if (gpa >= 5) return "A+";
  if (gpa >= 4) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3) return "B";
  if (gpa >= 2) return "C";
  if (gpa >= 1) return "D";
  return "F";
}

function gpaFromMarks(obtained: number, total: number): number {
  const pct = (obtained / total) * 100;
  if (pct >= 80) return 5;
  if (pct >= 70) return 4;
  if (pct >= 60) return 3.5;
  if (pct >= 50) return 3;
  if (pct >= 40) return 2;
  if (pct >= 33) return 1;
  return 0;
}

interface MarksForm {
  obtainedMarks: number;
}

export default function ExamsPage() {
  const [rows, setRows] = useState<ExamRow[]>(EXAM_RESULTS);
  const [examFilter, setExamFilter] = useState<string>("Final Term");
  const [classFilter, setClassFilter] = useState<string>("all");

  const [editing, setEditing] = useState<ExamRow | null>(null);
  const [form, setForm] = useState<MarksForm>({ obtainedMarks: 0 });

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (examFilter !== "all" && r.exam !== examFilter) return false;
        if (classFilter !== "all" && r.className !== classFilter) return false;
        return true;
      }),
    [rows, examFilter, classFilter],
  );

  const total = filtered.length;
  const passCount = filtered.filter((r) => r.result === "Pass").length;
  const failCount = total - passCount;
  const aPlus = filtered.filter((r) => r.grade === "A+").length;
  const avgGpa =
    total > 0 ? filtered.reduce((a, r) => a + r.gpa, 0) / total : 0;

  const topStudents = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => b.obtainedMarks - a.obtainedMarks)
        .slice(0, 5),
    [filtered],
  );

  function openEdit(row: ExamRow) {
    setEditing(row);
    setForm({ obtainedMarks: row.obtainedMarks });
  }
  function handleSubmit() {
    if (!editing) return;
    const obtained = Math.max(
      0,
      Math.min(editing.totalMarks, form.obtainedMarks),
    );
    const gpa = gpaFromMarks(obtained, editing.totalMarks);
    const grade = gradeFromGpa(gpa);
    const result = gpa >= 1 ? "Pass" : "Fail";
    setRows((prev) =>
      prev.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              obtainedMarks: obtained,
              gpa,
              grade,
              result,
            }
          : r,
      ),
    );
    toast.success(
      `Updated ${editing.studentName}: ${obtained}/${editing.totalMarks} (${grade}, GPA ${gpa.toFixed(2)})`,
    );
    setEditing(null);
  }

  const columns = useMemo<ColumnDef<ExamRow>[]>(
    () => [
      { accessorKey: "studentId", header: "Student ID" },
      { accessorKey: "studentName", header: "Name" },
      {
        accessorKey: "className",
        header: "Class",
        cell: ({ row }) =>
          `Class ${row.original.className} (${row.original.section})`,
      },
      { accessorKey: "exam", header: "Exam" },
      {
        accessorKey: "obtainedMarks",
        header: "Marks",
        cell: ({ row }) =>
          `${row.original.obtainedMarks}/${row.original.totalMarks}`,
      },
      {
        accessorKey: "gpa",
        header: "GPA",
        cell: ({ row }) => row.original.gpa.toFixed(2),
      },
      {
        accessorKey: "grade",
        header: "Grade",
        cell: ({ row }) => (
          <Badge
            className={
              (GRADE_TONE[row.original.grade] ?? "bg-muted") + " border-0"
            }
          >
            {row.original.grade}
          </Badge>
        ),
      },
      {
        accessorKey: "result",
        header: "Result",
        cell: ({ row }) => (
          <Badge
            className={
              (row.original.result === "Pass"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700") + " border-0"
            }
          >
            {row.original.result}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => openEdit(row.original)}
            aria-label={`Edit marks for ${row.original.studentName}`}
          >
            <PencilIcon />
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeader
        title="Exams & Results"
        description="View and edit SSC-style result sheets. Filter by exam, class or section."
      />

      <section className="grid gap-3 sm:grid-cols-4">
        <StatTile
          label="Total Results"
          value={String(total)}
          icon={ClipboardListIcon}
          tone="indigo"
        />
        <StatTile
          label="Pass Rate"
          value={total ? `${((passCount / total) * 100).toFixed(1)}%` : "—"}
          delta={`${passCount} pass, ${failCount} fail`}
          icon={GraduationCapIcon}
          tone="emerald"
        />
        <StatTile
          label="Avg GPA"
          value={avgGpa.toFixed(2)}
          delta="GPA out of 5.00"
          icon={GraduationCapIcon}
          tone="violet"
        />
        <StatTile
          label="A+ Count"
          value={String(aPlus)}
          delta="GPA 5.00"
          icon={AwardIcon}
          tone="amber"
        />
      </section>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Exam
          </span>
          <Select
            value={examFilter}
            onValueChange={(v) => setExamFilter(v ?? examFilter)}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All exams</SelectItem>
              {EXAMS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Class
          </span>
          <Select
            value={classFilter}
            onValueChange={(v) => setClassFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {CLASS_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={filtered}
            searchPlaceholder="Search by student, ID..."
            emptyMessage="No results match the current filters."
          />
        </div>
        <aside className="rounded-2xl border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <AwardIcon className="size-4 text-amber-500" /> Top Students
          </h3>
          {topStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data.</p>
          ) : (
            <ol className="flex flex-col gap-2.5">
              {topStudents.map((s, idx) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border bg-background p-2.5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-700">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {s.studentName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Class {s.className} ({s.section}) · {s.obtainedMarks}/
                      {s.totalMarks}
                    </div>
                  </div>
                  <Badge
                    className={
                      (GRADE_TONE[s.grade] ?? "bg-muted") + " shrink-0 border-0"
                    }
                  >
                    {s.grade}
                  </Badge>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      {/* Edit marks dialog */}
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Marks</DialogTitle>
            <DialogDescription>
              {editing
                ? `${editing.studentName} · ${editing.exam} · Class ${editing.className} (${editing.section})`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="flex flex-col gap-3">
              <FormField label={`Marks (out of ${editing.totalMarks})`} htmlFor="emarks">
                <Input
                  id="emarks"
                  type="number"
                  value={form.obtainedMarks}
                  min={0}
                  max={editing.totalMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      obtainedMarks: Number(e.target.value || 0),
                    })
                  }
                />
              </FormField>
              <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                Live preview · GPA{" "}
                <span className="font-semibold text-foreground">
                  {gpaFromMarks(
                    Math.max(
                      0,
                      Math.min(editing.totalMarks, form.obtainedMarks),
                    ),
                    editing.totalMarks,
                  ).toFixed(2)}
                </span>{" "}
                · Grade{" "}
                <span className="font-semibold text-foreground">
                  {gradeFromGpa(
                    gpaFromMarks(
                      Math.max(
                        0,
                        Math.min(editing.totalMarks, form.obtainedMarks),
                      ),
                      editing.totalMarks,
                    ),
                  )}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save marks</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
