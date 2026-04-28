"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
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
import { FormField } from "@/components/dashboard/form-field";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "@/lib/mock-data/reports";
import { useSchoolStore } from "@/lib/store/school-store";
import type { Gender, StudentRow } from "@/lib/types/reports";
import { downloadStudentsExcel } from "@/lib/utils/page-exports";

type Status = StudentRow["status"];

const STATUS_TONE: Record<Status, string> = {
  Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Transferred:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Dropout: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

interface StudentFormState {
  id: string;
  name: string;
  className: string;
  section: string;
  gender: Gender;
  guardian: string;
  phone: string;
  admissionDate: string;
  status: Status;
}

const blankForm = (): StudentFormState => ({
  id: `STD-${Math.floor(1100 + Math.random() * 8000)}`,
  name: "",
  className: "1",
  section: "A",
  gender: "Male",
  guardian: "",
  phone: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  status: "Active",
});

export default function StudentsPage() {
  const rows = useSchoolStore((s) => s.students);
  const addStudent = useSchoolStore((s) => s.addStudent);
  const updateStudent = useSchoolStore((s) => s.updateStudent);
  const removeStudent = useSchoolStore((s) => s.removeStudent);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StudentRow | null>(null);
  const [form, setForm] = useState<StudentFormState>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((s) => {
      if (classFilter !== "all" && s.className !== classFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [rows, classFilter, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(blankForm());
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(row: StudentRow) {
    setEditing(row);
    setForm({ ...row });
    setErrors({});
    setDialogOpen(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.guardian.trim()) e.guardian = "Guardian name is required";
    if (!/^\+?[0-9 -]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editing) {
      updateStudent(editing.id, form);
      toast.success(`Updated ${form.name}`);
    } else {
      addStudent({ ...form });
      toast.success(`Added ${form.name}`);
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    const target = rows.find((r) => r.id === deleteId);
    removeStudent(deleteId);
    toast.success(`Removed ${target?.name ?? deleteId}`);
    setDeleteId(null);
  }

  function handleExport() {
    downloadStudentsExcel(filtered);
    toast.success(`Exported ${filtered.length} students`);
  }

  const columns = useMemo<ColumnDef<StudentRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Student ID",
        cell: ({ row }) => (
          <Link
            href={`/students/${row.original.id}`}
            className="font-mono text-xs text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            href={`/students/${row.original.id}`}
            className="font-medium hover:text-indigo-600 hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        accessorKey: "className",
        header: "Class",
        cell: ({ row }) =>
          `Class ${row.original.className} (${row.original.section})`,
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      { accessorKey: "guardian", header: "Guardian" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "admissionDate",
        header: "Admission",
        cell: ({ row }) =>
          new Date(row.original.admissionDate).toLocaleDateString("en-GB"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge className={STATUS_TONE[s] + " border-0"}>{s}</Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => openEdit(row.original)}
            >
              <PencilIcon />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => setDeleteId(row.original.id)}
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
        title="Students"
        description="Manage student admissions, class assignments and status."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <DownloadIcon /> Export Excel
            </Button>
            <Button onClick={openCreate}>
              <PlusIcon /> Add Student
            </Button>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
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
              <SelectItem value="all">All Classes</SelectItem>
              {CLASS_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </span>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
              <SelectItem value="Dropout">Dropout</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(classFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setClassFilter("all");
              setStatusFilter("all");
            }}
          >
            <ArrowLeftIcon /> Reset
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by name, ID, guardian..."
        emptyMessage="No students match the current filters."
      />

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UsersIcon className="size-4 text-indigo-500" />
              {editing ? "Edit Student" : "Add New Student"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Updating ${editing.name} (${editing.id}).`
                : "Fill in the new student's details. ID is auto-generated."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Student ID" htmlFor="sid">
              <Input id="sid" value={form.id} disabled className="font-mono" />
            </FormField>
            <FormField
              label="Full Name"
              htmlFor="name"
              required
              error={errors.name}
            >
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tasnim Sultana"
              />
            </FormField>
            <FormField label="Class" htmlFor="cls" required>
              <Select
                value={form.className}
                onValueChange={(v) =>
                  setForm({ ...form, className: v ?? form.className })
                }
              >
                <SelectTrigger id="cls" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Section" htmlFor="sec" required>
              <Select
                value={form.section}
                onValueChange={(v) =>
                  setForm({ ...form, section: v ?? form.section })
                }
              >
                <SelectTrigger id="sec" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Gender" htmlFor="gen">
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm({ ...form, gender: (v as Gender) ?? form.gender })
                }
              >
                <SelectTrigger id="gen" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Status" htmlFor="status">
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: (v as Status) ?? form.status })
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                  <SelectItem value="Dropout">Dropout</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label="Guardian Name"
              htmlFor="guardian"
              required
              error={errors.guardian}
            >
              <Input
                id="guardian"
                value={form.guardian}
                onChange={(e) =>
                  setForm({ ...form, guardian: e.target.value })
                }
                placeholder="e.g. Md. Karim"
              />
            </FormField>
            <FormField
              label="Phone"
              htmlFor="phone"
              required
              error={errors.phone}
            >
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+8801XXXXXXXXX"
              />
            </FormField>
            <FormField
              label="Admission Date"
              htmlFor="adate"
              className="sm:col-span-2"
            >
              <Input
                id="adate"
                type="date"
                value={form.admissionDate}
                onChange={(e) =>
                  setForm({ ...form, admissionDate: e.target.value })
                }
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editing ? "Save changes" : "Add student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove student?</DialogTitle>
            <DialogDescription>
              This is a frontend demo — the change is in-memory only and will
              reset on refresh.
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
