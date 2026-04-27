"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { PlusIcon, WalletIcon } from "lucide-react";
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
import {
  FEES,
  PAYMENT_METHODS,
  STUDENTS,
} from "@/lib/mock-data/reports";
import type { FeesRow, PaymentMethod } from "@/lib/types/reports";
import { formatBDT } from "@/lib/utils/bdt";

const STATUS_TONE: Record<FeesRow["status"], string> = {
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Partial:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Due: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const METHOD_TONE: Record<string, string> = {
  bKash: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
  Nagad: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  Cash: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
  Pending:
    "bg-muted text-muted-foreground",
};

interface PaymentForm {
  studentId: string;
  month: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

const blankForm = (): PaymentForm => ({
  studentId: STUDENTS[0]?.id ?? "",
  month: new Date().toLocaleString("en-US", { month: "short" }),
  amount: 2500,
  paymentMethod: "bKash",
});

export default function FeesPage() {
  const [rows, setRows] = useState<FeesRow[]>(FEES);
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (methodFilter !== "all" && r.paymentMethod !== methodFilter)
        return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [rows, methodFilter, statusFilter]);

  const totalCollected = filtered.reduce((acc, r) => acc + r.paid, 0);
  const totalDue = filtered.reduce((acc, r) => acc + r.due, 0);
  const totalFine = filtered.reduce((acc, r) => acc + r.fine, 0);

  function openCreate() {
    setForm(blankForm());
    setErrors({});
    setDialogOpen(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.amount <= 0) e.amount = "Amount must be positive";
    if (!form.studentId) e.studentId = "Select a student";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const student = STUDENTS.find((s) => s.id === form.studentId);
    if (!student) return;
    const id = `FEE-${Date.now().toString().slice(-7)}`;
    const newRow: FeesRow = {
      id,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      section: student.section,
      month: form.month,
      amount: form.amount,
      paid: form.amount,
      due: 0,
      fine: 0,
      paymentMethod: form.paymentMethod,
      paymentDate: new Date().toISOString().slice(0, 10),
      status: "Paid",
    };
    setRows((prev) => [newRow, ...prev]);
    toast.success(
      `Recorded ${formatBDT(form.amount)} from ${student.name} via ${form.paymentMethod}`,
    );
    setDialogOpen(false);
  }

  const columns = useMemo<ColumnDef<FeesRow>[]>(
    () => [
      { accessorKey: "id", header: "Receipt #" },
      { accessorKey: "studentId", header: "Student ID" },
      { accessorKey: "studentName", header: "Name" },
      {
        accessorKey: "className",
        header: "Class",
        cell: ({ row }) =>
          `Class ${row.original.className} (${row.original.section})`,
      },
      { accessorKey: "month", header: "Month" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatBDT(row.original.amount),
      },
      {
        accessorKey: "paid",
        header: "Paid",
        cell: ({ row }) => formatBDT(row.original.paid),
      },
      {
        accessorKey: "due",
        header: "Due",
        cell: ({ row }) =>
          row.original.due > 0 ? (
            <span className="font-medium text-rose-600">
              {formatBDT(row.original.due)}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Method",
        cell: ({ row }) => (
          <Badge
            className={
              (METHOD_TONE[row.original.paymentMethod] ??
                "bg-muted text-muted-foreground") + " border-0"
            }
          >
            {row.original.paymentMethod}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={STATUS_TONE[row.original.status] + " border-0"}>
            {row.original.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeader
        title="Fees Collection"
        description="Record monthly tuition payments via bKash, Nagad or Cash."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon /> Record Payment
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Collected"
          value={formatBDT(totalCollected, { compact: true })}
          delta={`${filtered.length} transactions`}
          icon={WalletIcon}
          tone="emerald"
        />
        <StatTile
          label="Outstanding Dues"
          value={formatBDT(totalDue, { compact: true })}
          delta="across visible rows"
          icon={WalletIcon}
          tone="rose"
        />
        <StatTile
          label="Fines"
          value={formatBDT(totalFine)}
          delta="late-payment penalties"
          icon={WalletIcon}
          tone="amber"
        />
      </section>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Method
          </span>
          <Select
            value={methodFilter}
            onValueChange={(v) => setMethodFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {PAYMENT_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
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
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Due">Due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by student, receipt, month..."
        emptyMessage="No payments match the current filters."
      />

      {/* Record payment modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WalletIcon className="size-4 text-emerald-500" />
              Record Payment
            </DialogTitle>
            <DialogDescription>
              Add a new fee collection entry. Receipt # is generated.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <FormField
              label="Student"
              htmlFor="fstud"
              required
              error={errors.studentId}
            >
              <Select
                value={form.studentId}
                onValueChange={(v) =>
                  setForm({ ...form, studentId: v ?? form.studentId })
                }
              >
                <SelectTrigger id="fstud" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {STUDENTS.slice(0, 40).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.id} · {s.name} (Class {s.className})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Month" htmlFor="fmonth">
                <Select
                  value={form.month}
                  onValueChange={(v) =>
                    setForm({ ...form, month: v ?? form.month })
                  }
                >
                  <SelectTrigger id="fmonth" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Method" htmlFor="fmethod">
                <Select
                  value={form.paymentMethod}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      paymentMethod:
                        (v as PaymentMethod) ?? form.paymentMethod,
                    })
                  }
                >
                  <SelectTrigger id="fmethod" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField
              label="Amount (BDT)"
              htmlFor="famount"
              required
              error={errors.amount}
            >
              <Input
                id="famount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value || 0) })
                }
                min={0}
                step={50}
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <PlusIcon /> Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
