"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { BarChart } from "@/components/reports/charts/bar-chart";
import { LineChart } from "@/components/reports/charts/line-chart";
import { PieChart } from "@/components/reports/charts/pie-chart";
import { DataTable } from "@/components/reports/data-table";
import { ExportToolbar } from "@/components/reports/export-toolbar";
import { KpiGrid } from "@/components/reports/kpi-card";
import { ReportSection } from "@/components/reports/report-section";
import { ReportEmpty, ReportError, ReportLoading } from "@/components/reports/states";
import { Badge } from "@/components/ui/badge";
import { getStudentReport } from "@/lib/api/reports";
import type { ReportFilters, StudentReport, StudentRow } from "@/lib/types/reports";

const columns: ColumnDef<StudentRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Student Name" },
  {
    accessorKey: "className",
    header: "Class",
    cell: ({ row }) => `Class ${row.original.className}`,
  },
  { accessorKey: "section", header: "Section" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "guardian", header: "Guardian" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "admissionDate",
    header: "Admission",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const v = row.original.status;
      const variant =
        v === "Active"
          ? "default"
          : v === "Transferred"
            ? "secondary"
            : "destructive";
      return <Badge variant={variant}>{v}</Badge>;
    },
  },
];

const excelColumns = [
  { header: "ID", accessor: (r: StudentRow) => r.id },
  { header: "Name", accessor: (r: StudentRow) => r.name },
  { header: "Class", accessor: (r: StudentRow) => `Class ${r.className}` },
  { header: "Section", accessor: (r: StudentRow) => r.section },
  { header: "Gender", accessor: (r: StudentRow) => r.gender },
  { header: "Guardian", accessor: (r: StudentRow) => r.guardian },
  { header: "Phone", accessor: (r: StudentRow) => r.phone },
  { header: "Admission Date", accessor: (r: StudentRow) => r.admissionDate },
  { header: "Status", accessor: (r: StudentRow) => r.status },
];

export function StudentReportTab({
  filters,
  dateRangeLabel,
}: {
  filters: ReportFilters;
  dateRangeLabel: string;
}) {
  const [data, setData] = React.useState<StudentReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStudentReport(filters);
      setData(result);
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
          reportTitle="Student Report"
          fileBaseName="student-report"
          captureRef={captureRef}
          dateRangeLabel={dateRangeLabel}
          excel={{ columns: excelColumns, rows: data.rows }}
        />
      </div>

      <div ref={captureRef} className="space-y-4">
        <KpiGrid items={data.kpis} />

        <div className="grid gap-3 lg:grid-cols-3">
          <ReportSection
            title="Class-wise Distribution"
            description="Student count per class"
            className="lg:col-span-2"
          >
            <BarChart data={data.classDistribution} label="Students" />
          </ReportSection>

          <ReportSection
            title="Gender Split"
            description="Male vs Female"
          >
            <PieChart data={data.genderSplit} />
          </ReportSection>
        </div>

        <ReportSection
          title="Admission Trend"
          description="Monthly admissions for the academic year"
        >
          <LineChart data={data.admissionTrend} label="Admissions" />
        </ReportSection>

        <ReportSection
          title="Student Roll"
          description={`${data.rows.length} students match the current filters`}
        >
          {data.rows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <DataTable
              columns={columns}
              data={data.rows}
              searchPlaceholder="Search by name, class, ID..."
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}
