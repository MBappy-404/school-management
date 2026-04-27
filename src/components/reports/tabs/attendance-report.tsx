"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { BarChart } from "@/components/reports/charts/bar-chart";
import { LineChart } from "@/components/reports/charts/line-chart";
import { DataTable } from "@/components/reports/data-table";
import { ExportToolbar } from "@/components/reports/export-toolbar";
import { KpiGrid } from "@/components/reports/kpi-card";
import { ReportSection } from "@/components/reports/report-section";
import { ReportEmpty, ReportError, ReportLoading } from "@/components/reports/states";
import { Badge } from "@/components/ui/badge";
import { getAttendanceReport } from "@/lib/api/reports";
import type { AttendanceReport, AttendanceRow, ReportFilters } from "@/lib/types/reports";

const columns: ColumnDef<AttendanceRow>[] = [
  { accessorKey: "studentId", header: "Student ID" },
  { accessorKey: "studentName", header: "Student" },
  {
    accessorKey: "className",
    header: "Class",
    cell: ({ row }) =>
      `Class ${row.original.className} (${row.original.section})`,
  },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "status",
    header: "Today",
    cell: ({ row }) => {
      const v = row.original.status;
      const variant =
        v === "Present" ? "default" : v === "Late" ? "secondary" : "destructive";
      return <Badge variant={variant}>{v}</Badge>;
    },
  },
  {
    accessorKey: "presentDays",
    header: "Present / Total",
    cell: ({ row }) =>
      `${row.original.presentDays} / ${row.original.totalDays}`,
  },
  {
    accessorKey: "attendancePct",
    header: "Attendance %",
    cell: ({ row }) => `${row.original.attendancePct.toFixed(1)}%`,
  },
];

const excelColumns = [
  { header: "Student ID", accessor: (r: AttendanceRow) => r.studentId },
  { header: "Student Name", accessor: (r: AttendanceRow) => r.studentName },
  { header: "Class", accessor: (r: AttendanceRow) => `Class ${r.className}` },
  { header: "Section", accessor: (r: AttendanceRow) => r.section },
  { header: "Date", accessor: (r: AttendanceRow) => r.date },
  { header: "Status", accessor: (r: AttendanceRow) => r.status },
  { header: "Present Days", accessor: (r: AttendanceRow) => r.presentDays },
  { header: "Total Days", accessor: (r: AttendanceRow) => r.totalDays },
  {
    header: "Attendance %",
    accessor: (r: AttendanceRow) => Number(r.attendancePct.toFixed(1)),
  },
];

export function AttendanceReportTab({
  filters,
  dateRangeLabel,
}: {
  filters: ReportFilters;
  dateRangeLabel: string;
}) {
  const [data, setData] = React.useState<AttendanceReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAttendanceReport(filters));
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
          reportTitle="Attendance Report"
          fileBaseName="attendance-report"
          captureRef={captureRef}
          dateRangeLabel={dateRangeLabel}
          excel={{ columns: excelColumns, rows: data.rows }}
        />
      </div>

      <div ref={captureRef} className="space-y-4">
        <KpiGrid items={data.kpis} />

        <div className="grid gap-3 lg:grid-cols-2">
          <ReportSection
            title="Daily Attendance %"
            description="Last 5 working days"
          >
            <BarChart
              data={data.daily}
              color="#10b981"
              label="Attendance"
              formatter={(v) => `${v}%`}
            />
          </ReportSection>
          <ReportSection
            title="Weekly Summary"
            description="Past four weeks"
          >
            <BarChart
              data={data.weekly}
              color="#6366f1"
              label="Attendance"
              formatter={(v) => `${v}%`}
            />
          </ReportSection>
        </div>

        <ReportSection
          title="Monthly Attendance %"
          description="Trend over the academic year"
        >
          <LineChart
            data={data.monthlyPct}
            label="Attendance"
            formatter={(v) => `${v}%`}
          />
        </ReportSection>

        <ReportSection
          title="Class-wise Attendance"
          description="Average attendance per class"
        >
          <BarChart
            data={data.classWise}
            color="#f59e0b"
            label="Attendance"
            formatter={(v) => `${v}%`}
          />
        </ReportSection>

        <ReportSection
          title="Student Attendance Roll"
          description={`${data.rows.length} records`}
        >
          {data.rows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <DataTable
              columns={columns}
              data={data.rows}
              searchPlaceholder="Search by student, class..."
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}
