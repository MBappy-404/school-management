"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  GraduationCapIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { FormField } from "@/components/dashboard/form-field";
import { TEACHERS } from "@/lib/mock-data/reports";
import type { TeacherRow } from "@/lib/types/reports";
import { formatBDT } from "@/lib/utils/bdt";

const SUBJECTS = [
  "Bangla",
  "English",
  "Mathematics",
  "Science",
  "ICT",
  "Religion",
  "Social Science",
  "Bangladesh & Global Studies",
  "Higher Math",
  "Physics",
];

const DESIGNATIONS = [
  "Senior Teacher",
  "Assistant Teacher",
  "Head of Department",
  "Lecturer",
];

interface TeacherForm {
  id: string;
  name: string;
  subject: string;
  designation: string;
  attendancePct: number;
  monthlySalary: number;
  joinDate: string;
  phone: string;
}

const blankForm = (): TeacherForm => ({
  id: `TCH-${Math.floor(2100 + Math.random() * 4000)}`,
  name: "",
  subject: "Bangla",
  designation: "Assistant Teacher",
  attendancePct: 95,
  monthlySalary: 30000,
  joinDate: new Date().toISOString().slice(0, 10),
  phone: "",
});

export default function TeachersPage() {
  const [rows, setRows] = useState<TeacherRow[]>(TEACHERS);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherRow | null>(null);
  const [form, setForm] = useState<TeacherForm>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (t) => subjectFilter === "all" || t.subject === subjectFilter,
      ),
    [rows, subjectFilter],
  );

  function openCreate() {
    setEditing(null);
    setForm(blankForm());
    setErrors({});
    setDialogOpen(true);
  }
  function openEdit(row: TeacherRow) {
    setEditing(row);
    setForm({ ...row });
    setErrors({});
    setDialogOpen(true);
  }
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\+?[0-9 -]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (form.monthlySalary <= 0) e.monthlySalary = "Salary must be positive";
    if (form.attendancePct < 0 || form.attendancePct > 100)
      e.attendancePct = "Must be 0–100";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit() {
    if (!validate()) return;
    if (editing) {
      setRows((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...editing, ...form } : r)),
      );
      toast.success(`Updated ${form.name}`);
    } else {
      setRows((prev) => [{ ...form }, ...prev]);
      toast.success(`Added ${form.name}`);
    }
    setDialogOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    const target = rows.find((r) => r.id === deleteId);
    setRows((prev) => prev.filter((r) => r.id !== deleteId));
    toast.success(`Removed ${target?.name ?? deleteId}`);
    setDeleteId(null);
  }

  const columns = useMemo<ColumnDef<TeacherRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "subject", header: "Subject" },
      { accessorKey: "designation", header: "Designation" },
      {
        accessorKey: "attendancePct",
        header: "Attendance",
        cell: ({ row }) => `${row.original.attendancePct}%`,
      },
      {
        accessorKey: "monthlySalary",
        header: "Salary",
        cell: ({ row }) => formatBDT(row.original.monthlySalary),
      },
      {
        accessorKey: "joinDate",
        header: "Joined",
        cell: ({ row }) =>
          new Date(row.original.joinDate).toLocaleDateString("en-GB"),
      },
      { accessorKey: "phone", header: "Phone" },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => openEdit(row.original)}
              aria-label={`Edit ${row.original.name}`}
            >
              <PencilIcon />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setDeleteId(row.original.id)}
              aria-label={`Delete ${row.original.name}`}
            >
              <Trash2Icon className="text-rose-500" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeader
        title="Teachers"
        description="Manage teaching staff, subjects and payroll details."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon /> Add Teacher
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Subject
          </span>
          <Select
            value={subjectFilter}
            onValueChange={(v) => setSubjectFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by name, subject..."
        emptyMessage="No teachers match the current filters."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCapIcon className="size-4 text-violet-500" />
              {editing ? "Edit Teacher" : "Add New Teacher"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Updating ${editing.name} (${editing.id}).`
                : "Fill in the new teacher's details. ID is auto-generated."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Teacher ID" htmlFor="tid">
              <Input
                id="tid"
                value={form.id}
                disabled
                className="font-mono"
              />
            </FormField>
            <FormField
              label="Full Name"
              htmlFor="tname"
              required
              error={errors.name}
            >
              <Input
                id="tname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Md. Ashraful Islam"
              />
            </FormField>
            <FormField label="Subject" htmlFor="tsub" required>
              <Select
                value={form.subject}
                onValueChange={(v) =>
                  setForm({ ...form, subject: v ?? form.subject })
                }
              >
                <SelectTrigger id="tsub" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Designation" htmlFor="tdesig">
              <Select
                value={form.designation}
                onValueChange={(v) =>
                  setForm({ ...form, designation: v ?? form.designation })
                }
              >
                <SelectTrigger id="tdesig" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label="Monthly Salary (BDT)"
              htmlFor="tsalary"
              required
              error={errors.monthlySalary}
            >
              <Input
                id="tsalary"
                type="number"
                value={form.monthlySalary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    monthlySalary: Number(e.target.value || 0),
                  })
                }
                min={0}
                step={500}
              />
            </FormField>
            <FormField
              label="Attendance %"
              htmlFor="tatt"
              error={errors.attendancePct}
            >
              <Input
                id="tatt"
                type="number"
                value={form.attendancePct}
                onChange={(e) =>
                  setForm({
                    ...form,
                    attendancePct: Number(e.target.value || 0),
                  })
                }
                min={0}
                max={100}
              />
            </FormField>
            <FormField label="Join Date" htmlFor="tjoin">
              <Input
                id="tjoin"
                type="date"
                value={form.joinDate}
                onChange={(e) =>
                  setForm({ ...form, joinDate: e.target.value })
                }
              />
            </FormField>
            <FormField
              label="Phone"
              htmlFor="tphone"
              required
              error={errors.phone}
            >
              <Input
                id="tphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+8801XXXXXXXXX"
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editing ? "Save changes" : "Add teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove teacher?</DialogTitle>
            <DialogDescription>
              Demo only — change is kept in memory and resets on refresh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2Icon /> Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
