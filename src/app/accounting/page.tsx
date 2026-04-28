"use client";

import { useState } from "react";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CalculatorIcon,
  ScaleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { MultiBarChart } from "@/components/reports/charts/bar-chart";
import { LEDGER, type LedgerEntry } from "@/lib/mock-data/extended";
import { formatBDT } from "@/lib/utils/bdt";

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

export default function AccountingPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

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
    </div>
  );
}
