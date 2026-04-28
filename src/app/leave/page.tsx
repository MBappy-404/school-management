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
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  LEAVE_REQUESTS,
  type LeaveRequest,
  type LeaveStatus,
} from "@/lib/mock-data/extended";

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

export default function LeavePage() {
  const [rows, setRows] = useState<LeaveRequest[]>(LEAVE_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Leave ${status.toLowerCase()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="HR · Leave Management"
        description="ছুটি — staff leave applications, approvals and history."
        actions={
          <Button>
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
    </div>
  );
}
