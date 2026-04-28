"use client";

import { useState } from "react";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CalculatorIcon,
  DownloadIcon,
  PlusIcon,
  ScaleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/dashboard/form-field";
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
import { MultiBarChart } from "@/components/reports/charts/bar-chart";
import {
  type LedgerEntry,
  type LedgerHead,
  type LedgerType,
} from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";
import { formatBDT } from "@/lib/utils/bdt";
import { downloadLedgerExcel } from "@/lib/utils/page-exports";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}
function monthLabel(iso: string) {
  return new Date(iso + "-01").toLocaleDateString("en-GB", {
    month: "short",
  });
}

interface EntryForm {
  type: LedgerType;
  head: LedgerHead;
  amount: number;
  description: string;
  paymentMode: LedgerEntry["paymentMode"];
  date: string;
}

const blankEntry = (): EntryForm => ({
  type: "Income",
  head: "Tuition Fee",
  amount: 1000,
  description: "",
  paymentMode: "Cash",
  date: new Date().toISOString().slice(0, 10),
});

export default function AccountingPage() {
  const LEDGER = useSchoolStore((s) => s.ledger);
  const addLedgerEntry = useSchoolStore((s) => s.addLedgerEntry);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<EntryForm>(blankEntry);

  const filtered: LedgerEntry[] = LEDGER.filter((l) => {
    if (typeFilter !== "All" && l.type !== typeFilter) return false;
    if (
      search &&
      !`${l.head} ${l.description} ${l.reference}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  })
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalIncome = LEDGER.filter((l) => l.type === "Income").reduce(
    (s, l) => s + l.amount,
    0,
  );
  const totalExpense = LEDGER.filter((l) => l.type === "Expense").reduce(
    (s, l) => s + l.amount,
    0,
  );
  const net = totalIncome - totalExpense;
  const txnCount = LEDGER.length;

  const monthly = (() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const l of LEDGER) {
      const k = monthKey(l.date);
      const cur = map.get(k) ?? { income: 0, expense: 0 };
      if (l.type === "Income") cur.income += l.amount;
      else cur.expense += l.amount;
      map.set(k, cur);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-4)
      .map(([k, v]) => ({
        label: monthLabel(k),
        Income: v.income,
        Expense: v.expense,
      }));
  })();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Accounting"
        description="হিসাব — income and expense ledger with monthly reconciliation."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadLedgerExcel(filtered);
                toast.success(`Exported ${filtered.length} entries`);
              }}
            >
              <DownloadIcon /> Export Excel
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New Entry
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Income"
          bilingualLabel="মোট আয়"
          value={formatBDT(totalIncome, { compact: true })}
          icon={ArrowUpCircleIcon}
          tone="emerald"
        />
        <KpiTile
          label="Total Expense"
          bilingualLabel="ব্যয়"
          value={formatBDT(totalExpense, { compact: true })}
          icon={ArrowDownCircleIcon}
          tone="rose"
        />
        <KpiTile
          label="Net Position"
          bilingualLabel="নিট"
          value={formatBDT(net, { compact: true })}
          delta={net >= 0 ? "Surplus" : "Deficit"}
          icon={ScaleIcon}
          tone={net >= 0 ? "emerald" : "rose"}
          changePercent={totalIncome > 0 ? (net / totalIncome) * 100 : 0}
        />
        <KpiTile
          label="Transactions"
          value={String(txnCount)}
          delta="last 90 days"
          icon={CalculatorIcon}
          tone="indigo"
        />
      </section>

      <SectionCard
        title="Monthly Reconciliation"
        description="Income vs Expense — last 4 months"
      >
        <MultiBarChart
          data={monthly}
          series={["Income", "Expense"]}
          formatter={(v) => formatBDT(v, { compact: true })}
        />
      </SectionCard>

      <SectionCard title="Ledger">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search head, description or ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v ?? "All")}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Head</th>
                <th className="px-3 py-2.5">Description</th>
                <th className="px-3 py-2.5">Mode</th>
                <th className="px-3 py-2.5">Ref</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2 text-xs">{formatDate(l.date)}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={l.type === "Income" ? "success" : "danger"}
                    >
                      {l.head}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">{l.description}</td>
                  <td className="px-3 py-2">
                    <Badge variant="muted">{l.paymentMode}</Badge>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    {l.reference}
                  </td>
                  <td
                    className={`px-3 py-2 text-right tabular font-semibold ${
                      l.type === "Income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {l.type === "Income" ? "+" : "−"}
                    {formatBDT(l.amount)}
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
            <DialogTitle>New Ledger Entry</DialogTitle>
            <DialogDescription>
              Record a new income or expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Type">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: (v as LedgerType) ?? "Income" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Head">
              <Select
                value={form.head}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    head: (v as LedgerHead) ?? "Tuition Fee",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Tuition Fee",
                    "Admission Fee",
                    "Exam Fee",
                    "Transport Fee",
                    "Hostel Fee",
                    "Donation",
                    "Salary",
                    "Utility",
                    "Maintenance",
                    "Stationery",
                    "Event",
                    "Other",
                  ].map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Amount (BDT)">
              <Input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Mode">
              <Select
                value={form.paymentMode}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    paymentMode:
                      (v as LedgerEntry["paymentMode"]) ?? "Cash",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="bKash">bKash</SelectItem>
                  <SelectItem value="Nagad">Nagad</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
            <FormField label="Description" className="sm:col-span-2">
              <Input
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
                if (form.amount <= 0) {
                  toast.error("Amount must be positive");
                  return;
                }
                const entry: LedgerEntry = {
                  id: `LED-${Date.now().toString().slice(-6)}`,
                  date: form.date,
                  type: form.type,
                  head: form.head,
                  description: form.description || form.head,
                  amount: form.amount,
                  paymentMode: form.paymentMode,
                  reference: `REF-${Math.floor(Math.random() * 900000) + 100000}`,
                };
                addLedgerEntry(entry);
                toast.success(
                  `${form.type} recorded: ${formatBDT(form.amount)}`,
                );
                setCreateOpen(false);
                setForm(blankEntry());
              }}
            >
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
