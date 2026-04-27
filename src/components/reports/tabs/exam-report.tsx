"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { BarChart } from "@/components/reports/charts/bar-chart";
import { PieChart } from "@/components/reports/charts/pie-chart";
import { DataTable } from "@/components/reports/data-table";
import { ExportToolbar } from "@/components/reports/export-toolbar";
import { KpiGrid } from "@/components/reports/kpi-card";
import { ReportSection } from "@/components/reports/report-section";
import { ReportEmpty, ReportError, ReportLoading } from "@/components/reports/states";
import { Badge } from "@/components/ui/badge";
import { getExamReport } from "@/lib/api/reports";
import type { ExamReport, ExamRow, ReportFilters } from "@/lib/types/reports";

const columns: ColumnDef<ExamRow>[] = [
  { accessorKey: "studentId", header: "Student ID" },
  { accessorKey: "studentName", header: "Student" },
  {
    accessorKey: "className",
    header: "Class",
    cell: ({ row }) =>
      `Class ${row.original.className} (${row.original.section})`,
  },
  { accessorKey: "exam", header: "Exam" },
  {
    accessorKey: "obtainedMarks",
    header: "Marks",
    cell: ({ row }) =>
      `${row.original.obtainedMarks} / ${row.original.totalMarks}`,
  },
  {
    accessorKey: "gpa",
    header: "GPA",
    cell: ({ row }) => row.original.gpa.toFixed(2),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const g = row.original.grade;
      const tone =
        g === "A+"
          ? "bg-emerald-100 text-emerald-700"
          : g === "A" || g === "A-"
            ? "bg-indigo-100 text-indigo-700"
            : g === "F"
              ? "bg-rose-100 text-rose-700"
              : "bg-amber-100 text-amber-700";
      return (
        <span
          className={`inline-flex w-9 justify-center rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}
        >
          {g}
        </span>
      );
    },
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <Badge
        variant={row.original.result === "Pass" ? "default" : "destructive"}
      >
        {row.original.result}
      </Badge>
    ),
  },
];

const excelColumns = [
  { header: "Student ID", accessor: (r: ExamRow) => r.studentId },
  { header: "Student Name", accessor: (r: ExamRow) => r.studentName },
  { header: "Class", accessor: (r: ExamRow) => `Class ${r.className}` },
  { header: "Section", accessor: (r: ExamRow) => r.section },
  { header: "Exam", accessor: (r: ExamRow) => r.exam },
  { header: "Total Marks", accessor: (r: ExamRow) => r.totalMarks },
  { header: "Obtained Marks", accessor: (r: ExamRow) => r.obtainedMarks },
  { header: "GPA", accessor: (r: ExamRow) => r.gpa },
  { header: "Grade", accessor: (r: ExamRow) => r.grade },
  { header: "Result", accessor: (r: ExamRow) => r.result },
];

export function ExamReportTab({
  filters,
  dateRangeLabel,
}: {
  filters: ReportFilters;
  dateRangeLabel: string;
}) {
  const [data, setData] = React.useState<ExamReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getExamReport(filters));
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
          reportTitle="Exam Result Report"
          fileBaseName="exam-report"
          captureRef={captureRef}
          dateRangeLabel={dateRangeLabel}
          excel={{ columns: excelColumns, rows: data.rows }}
        />
      </div>

      <div ref={captureRef} className="space-y-4">
        <KpiGrid items={data.kpis} />

        <div className="grid gap-3 lg:grid-cols-2">
          <ReportSection
            title="GPA Distribution"
            description="SSC-style grading scale"
          >
            <BarChart
              data={data.gpaDistribution}
              color="#6366f1"
              label="Students"
            />
          </ReportSection>
          <ReportSection
            title="Pass / Fail Ratio"
            description="Across all exams"
          >
            <PieChart data={data.passFail} />
          </ReportSection>
        </div>

        <ReportSection
          title="Top 10 Students — Final Term"
          description="Ranked by total marks obtained"
        >
          {data.topStudents.length === 0 ? (
            <ReportEmpty />
          ) : (
            <ol className="space-y-2">
              {data.topStudents.map((s, idx) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium">{s.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.studentId} · Class {s.className}
                        {s.section}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {s.obtainedMarks}/{s.totalMarks}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GPA {s.gpa.toFixed(2)} · {s.grade}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </ReportSection>

        <ReportSection
          title="Result Sheet"
          description={`${data.rows.length} exam results`}
        >
          {data.rows.length === 0 ? (
            <ReportEmpty />
          ) : (
            <DataTable
              columns={columns}
              data={data.rows}
              searchPlaceholder="Search by student, exam, grade..."
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}
