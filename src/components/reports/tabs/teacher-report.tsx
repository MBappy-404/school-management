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
import { getTeacherReport } from "@/lib/api/reports";
import type { ReportFilters, TeacherReport, TeacherRow } from "@/lib/types/reports";
import { formatBDT } from "@/lib/utils/bdt";

const columns: ColumnDef<TeacherRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Teacher" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "designation", header: "Designation" },
  {
    accessorKey: "attendancePct",
    header: "Attendance %",
    cell: ({ row }) => `${row.original.attendancePct}%`,
  },
  {
    accessorKey: "monthlySalary",
    header: "Salary",
    cell: ({ row }) => formatBDT(row.original.monthlySalary),
  },
  { accessorKey: "joinDate", header: "Joined" },
  { accessorKey: "phone", header: "Phone" },
];

const excelColumns = [
  { header: "ID", accessor: (r: TeacherRow) => r.id },
  { header: "Name", accessor: (r: TeacherRow) => r.name },
  { header: "Subject", accessor: (r: TeacherRow) => r.subject },
  { header: "Designation", accessor: (r: TeacherRow) => r.designation },
  { header: "Attendance %", accessor: (r: TeacherRow) => r.attendancePct },
  {
    header: "Monthly Salary (BDT)",
    accessor: (r: TeacherRow) => r.monthlySalary,
    currency: true,
  },
  { header: "Join Date", accessor: (r: TeacherRow) => r.joinDate },
  { header: "Phone", accessor: (r: TeacherRow) => r.phone },
];

export function TeacherReportTab({
  filters,
  dateRangeLabel,
}: {
  filters: ReportFilters;
  dateRangeLabel: string;
}) {
  const [data, setData] = React.useState<TeacherReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getTeacherReport(filters));
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
          reportTitle="Teacher Report"
          fileBaseName="teacher-report"
          captureRef={captureRef}
          dateRangeLabel={dateRangeLabel}
          excel={{ columns: excelColumns, rows: data.rows }}
        />
      </div>

      <div ref={captureRef} className="space-y-4">
        <KpiGrid items={data.kpis} />

        <div className="grid gap-3 lg:grid-cols-2">
          <ReportSection
            title="Attendance by Subject"
            description="Average teacher attendance"
          >
            <BarChart
              data={data.attendanceBySubject}
              color="#10b981"
              label="Attendance %"
              formatter={(v) => `${v}%`}
            />
          </ReportSection>
          <ReportSection
            title="Monthly Payroll Trend"
            description="Total salary paid each month"
          >
            <LineChart
              data={data.salaryTrend}
              label="Payroll"
              formatter={(v) => formatBDT(v, { compact: true })}
            />
          </ReportSection>
        </div>

        <ReportSection
          title="Teacher Roster"
          description={`${data.rows.length} teachers`}
        >
          {data.rows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <DataTable
              columns={columns}
              data={data.rows}
              searchPlaceholder="Search by name, subject..."
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}
