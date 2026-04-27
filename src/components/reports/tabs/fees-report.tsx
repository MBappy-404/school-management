"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { MultiBarChart } from "@/components/reports/charts/bar-chart";
import { PieChart } from "@/components/reports/charts/pie-chart";
import { DataTable } from "@/components/reports/data-table";
import { ExportToolbar } from "@/components/reports/export-toolbar";
import { KpiGrid } from "@/components/reports/kpi-card";
import { ReportSection } from "@/components/reports/report-section";
import { ReportEmpty, ReportError, ReportLoading } from "@/components/reports/states";
import { Badge } from "@/components/ui/badge";
import { getFeesReport } from "@/lib/api/reports";
import type { FeesReport, FeesRow, ReportFilters } from "@/lib/types/reports";
import { formatBDT } from "@/lib/utils/bdt";

const columns: ColumnDef<FeesRow>[] = [
  { accessorKey: "studentId", header: "Student ID" },
  { accessorKey: "studentName", header: "Student" },
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
    cell: ({ row }) => (
      <span
        className={
          row.original.due > 0 ? "text-rose-600 font-medium" : ""
        }
      >
        {formatBDT(row.original.due)}
      </span>
    ),
  },
  {
    accessorKey: "fine",
    header: "Fine",
    cell: ({ row }) =>
      row.original.fine ? formatBDT(row.original.fine) : "—",
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const v = row.original.paymentMethod;
      const tone =
        v === "bKash"
          ? "bg-pink-100 text-pink-700"
          : v === "Nagad"
            ? "bg-orange-100 text-orange-700"
            : v === "Cash"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600";
      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}
        >
          {v}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const v = row.original.status;
      const variant =
        v === "Paid" ? "default" : v === "Partial" ? "secondary" : "destructive";
      return <Badge variant={variant}>{v}</Badge>;
    },
  },
];

const excelColumns = [
  { header: "Student ID", accessor: (r: FeesRow) => r.studentId },
  { header: "Student Name", accessor: (r: FeesRow) => r.studentName },
  { header: "Class", accessor: (r: FeesRow) => `Class ${r.className}` },
  { header: "Section", accessor: (r: FeesRow) => r.section },
  { header: "Month", accessor: (r: FeesRow) => r.month },
  {
    header: "Amount (BDT)",
    accessor: (r: FeesRow) => r.amount,
    currency: true,
  },
  { header: "Paid (BDT)", accessor: (r: FeesRow) => r.paid, currency: true },
  { header: "Due (BDT)", accessor: (r: FeesRow) => r.due, currency: true },
  { header: "Fine (BDT)", accessor: (r: FeesRow) => r.fine, currency: true },
  { header: "Payment Method", accessor: (r: FeesRow) => r.paymentMethod },
  { header: "Payment Date", accessor: (r: FeesRow) => r.paymentDate },
  { header: "Status", accessor: (r: FeesRow) => r.status },
];

export function FeesReportTab({
  filters,
  dateRangeLabel,
}: {
  filters: ReportFilters;
  dateRangeLabel: string;
}) {
  const [data, setData] = React.useState<FeesReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getFeesReport(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  if (loading) return <ReportLoading />;
  if (error) return <ReportError message={error} onRetry={fetchData} />;
  if (!data) return <ReportEmpty />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{dateRangeLabel}</p>
        <ExportToolbar
          reportTitle="Fees Collection Report"
          fileBaseName="fees-report"
          captureRef={captureRef}
          dateRangeLabel={dateRangeLabel}
          excel={{ columns: excelColumns, rows: data.rows }}
        />
      </div>

      <div ref={captureRef} className="space-y-4">
        <KpiGrid items={data.kpis} />

        <ReportSection
          title="Monthly Collection by Method"
          description="bKash, Nagad and Cash collections per month (BDT)"
        >
          <MultiBarChart
            data={data.monthlyCollection}
            series={["bKash", "Nagad", "Cash"]}
            stacked
            formatter={(v) => formatBDT(v, { compact: true })}
          />
        </ReportSection>

        <div className="grid gap-3 lg:grid-cols-2">
          <ReportSection
            title="Dues vs Paid"
            description="Across the selected range"
          >
            <PieChart
              data={data.duesVsPaid}
              formatter={(v) => formatBDT(v, { compact: true })}
            />
          </ReportSection>
          <ReportSection
            title="Payment Method Breakdown"
            description="Share of total collection per channel"
          >
            <PieChart
              data={data.methodBreakdown}
              formatter={(v) => formatBDT(v, { compact: true })}
            />
          </ReportSection>
        </div>

        <ReportSection
          title="Student-wise Fees"
          description={`${data.rows.length} fee records`}
        >
          {data.rows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <DataTable
              columns={columns}
              data={data.rows}
              searchPlaceholder="Search by student, status..."
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}
