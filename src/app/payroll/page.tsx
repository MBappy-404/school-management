"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  PauseCircleIcon,
  WalletIcon,
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
import { PAYROLL, type SalaryStatus } from "@/lib/mock-data/extended";
import { formatBDT } from "@/lib/utils/bdt";

const STATUS_VARIANT: Record<SalaryStatus, "success" | "warning" | "danger"> = {
  Paid: "success",
  Pending: "warning",
  Hold: "danger",
};

export default function PayrollPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return PAYROLL.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (
        search &&
        !`${p.staffName} ${p.designation} ${p.staffId}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalPayroll = PAYROLL.reduce((s, p) => s + p.net, 0);
  const totalPaid = PAYROLL.filter((p) => p.status === "Paid").reduce(
    (s, p) => s + p.net,
    0,
  );
  const pendingCount = PAYROLL.filter((p) => p.status === "Pending").length;
  const heldCount = PAYROLL.filter((p) => p.status === "Hold").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Payroll"
        description="বেতন — staff salary disbursement and history."
        actions={<Button><CreditCardIcon /> Run Payroll</Button>}
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Payroll"
          bilingualLabel="মোট"
          value={formatBDT(totalPayroll, { compact: true })}
          delta={`${PAYROLL.length} staff`}
          icon={WalletIcon}
          tone="indigo"
        />
        <KpiTile
          label="Disbursed"
          bilingualLabel="পরিশোধিত"
          value={formatBDT(totalPaid, { compact: true })}
          icon={CheckCircle2Icon}
          tone="emerald"
        />
        <KpiTile
          label="Pending"
          value={String(pendingCount)}
          delta="awaiting payment"
          icon={ClockIcon}
          tone="amber"
        />
        <KpiTile
          label="On Hold"
          value={String(heldCount)}
          icon={PauseCircleIcon}
          tone="rose"
        />
      </section>

      <SectionCard title="Salary Disbursement">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by name, designation or ID…"
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
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Hold">Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Staff</th>
                <th className="px-3 py-2.5">Designation</th>
                <th className="px-3 py-2.5 text-right">Basic</th>
                <th className="px-3 py-2.5 text-right">Allowance</th>
                <th className="px-3 py-2.5 text-right">Deduction</th>
                <th className="px-3 py-2.5 text-right">Net</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.staffName}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {p.staffId}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {p.designation}
                  </td>
                  <td className="px-3 py-2 text-right tabular">
                    {formatBDT(p.basic)}
                  </td>
                  <td className="px-3 py-2 text-right tabular text-emerald-600">
                    +{formatBDT(p.allowance)}
                  </td>
                  <td className="px-3 py-2 text-right tabular text-rose-600">
                    −{formatBDT(p.deduction)}
                  </td>
                  <td className="px-3 py-2 text-right tabular font-semibold">
                    {formatBDT(p.net)}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={STATUS_VARIANT[p.status]}>
                      {p.status}
                    </Badge>
                    {p.paidOn && (
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        on{" "}
                        {new Date(p.paidOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
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
