"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck2Icon,
  CheckIcon,
  HourglassIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { FormField } from "@/components/dashboard/form-field";
import {
  type LeaveRequest,
  type LeaveStatus,
  type LeaveType,
} from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";

const STATUS_VARIANT: Record<LeaveStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

interface LeaveForm {
  staffName: string;
  designation: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

const blankLeaveForm = (): LeaveForm => ({
  staffName: "",
  designation: "Assistant Teacher",
  type: "Casual",
  fromDate: new Date().toISOString().slice(0, 10),
  toDate: new Date().toISOString().slice(0, 10),
  reason: "",
});

export default function LeavePage() {
  const rows = useSchoolStore((s) => s.leaves);
  const teachers = useSchoolStore((s) => s.teachers);
  const addLeave = useSchoolStore((s) => s.addLeave);
  const updateLeave = useSchoolStore((s) => s.updateLeave);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<LeaveForm>(blankLeaveForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (
        search &&
        !`${r.staffName} ${r.designation}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [rows, search, statusFilter]);

  const counts = {
    pending: rows.filter((r) => r.status === "Pending").length,
    approved: rows.filter((r) => r.status === "Approved").length,
    rejected: rows.filter((r) => r.status === "Rejected").length,
    totalDays: rows.reduce((s, r) => s + r.days, 0),
  };

  function update(id: string, status: LeaveStatus) {
    updateLeave(id, { status });
    toast.success(`Leave ${status.toLowerCase()}`);
  }

  function submitLeave() {
    const e: Record<string, string> = {};
    if (!form.staffName.trim()) e.staffName = "Required";
    if (!form.reason.trim()) e.reason = "Required";
    if (form.toDate < form.fromDate) e.toDate = "Must be after start";
    setErrors(e);
    if (Object.keys(e).length) return;
    const days = daysBetween(form.fromDate, form.toDate);
    const matching = teachers.find((t) => t.name === form.staffName);
    const leave: LeaveRequest = {
      id: `LV-${Date.now().toString().slice(-6)}`,
      staffId: matching?.id ?? `TCH-${Date.now().toString().slice(-4)}`,
      staffName: form.staffName.trim(),
      designation: form.designation,
      type: form.type,
      fromDate: form.fromDate,
      toDate: form.toDate,
      days,
      reason: form.reason.trim(),
      status: "Pending",
      appliedOn: new Date().toISOString().slice(0, 10),
    };
    addLeave(leave);
    toast.success(`Leave applied: ${days} day(s)`);
    setCreateOpen(false);
    setForm(blankLeaveForm());
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="HR · Leave Management"
        description="ছুটি — staff leave applications, approvals and history."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon /> New Leave
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Pending Approval"
          value={String(counts.pending)}
          icon={HourglassIcon}
          tone="amber"
        />
        <KpiTile
          label="Approved"
          value={String(counts.approved)}
          icon={CheckIcon}
          tone="emerald"
        />
        <KpiTile
          label="Rejected"
          value={String(counts.rejected)}
          icon={XIcon}
          tone="rose"
        />
        <KpiTile
          label="Total Leave Days"
          value={String(counts.totalDays)}
          icon={CalendarCheck2Icon}
          tone="indigo"
        />
      </section>

      <SectionCard title="Leave Requests">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search staff…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "All")}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Staff</th>
                <th className="px-3 py-2.5">Type</th>
                <th className="px-3 py-2.5">Period</th>
                <th className="px-3 py-2.5">Days</th>
                <th className="px-3 py-2.5">Reason</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.staffName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.designation}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="muted">{r.type}</Badge>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {formatDate(r.fromDate)} → {formatDate(r.toDate)}
                  </td>
                  <td className="px-3 py-2 tabular">{r.days}</td>
                  <td className="px-3 py-2 max-w-xs truncate text-xs text-muted-foreground">
                    {r.reason}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.status === "Pending" && (
                      <div className="inline-flex gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => update(r.id, "Approved")}
                          aria-label="Approve"
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => update(r.id, "Rejected")}
                          aria-label="Reject"
                        >
                          <XIcon />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
            <DialogDescription>
              Submit a new leave request for staff.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Staff Name" error={errors.staffName} className="sm:col-span-2">
              <Input
                value={form.staffName}
                onChange={(e) => setForm({ ...form, staffName: e.target.value })}
                placeholder="Md. Jahangir Alam"
              />
            </FormField>
            <FormField label="Designation">
              <Input
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
            </FormField>
            <FormField label="Type">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: (v as LeaveType) ?? "Casual" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Sick">Sick</SelectItem>
                  <SelectItem value="Earned">Earned</SelectItem>
                  <SelectItem value="Maternity">Maternity</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="From">
              <Input
                type="date"
                value={form.fromDate}
                onChange={(e) =>
                  setForm({ ...form, fromDate: e.target.value })
                }
              />
            </FormField>
            <FormField label="To" error={errors.toDate}>
              <Input
                type="date"
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              />
            </FormField>
            <FormField label="Reason" error={errors.reason} className="sm:col-span-2">
              <Textarea
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitLeave}>Submit Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
