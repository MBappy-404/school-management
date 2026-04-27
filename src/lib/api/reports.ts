/**
 * Mock API layer.
 *
 * Each function returns a Promise that resolves after a simulated network
 * delay so the UI can exercise loading and error states. Swap the bodies of
 * these functions out for real `fetch` calls when the backend is ready —
 * the function signatures are designed to be backend-agnostic.
 */

import {
  buildAttendanceReport,
  buildExamReport,
  buildFeesReport,
  buildStudentReport,
  buildTeacherReport,
} from "@/lib/mock-data/reports";
import type {
  AttendanceReport,
  ExamReport,
  FeesReport,
  ReportFilters,
  StudentReport,
  TeacherReport,
} from "@/lib/types/reports";

function withDelay<T>(value: T, min = 500, max = 1000): Promise<T> {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures for error-state UX (~3%).
      if (Math.random() < 0.03) {
        reject(new Error("Network error – please retry."));
        return;
      }
      resolve(value);
    }, ms);
  });
}

function applyClassSection<T extends { className: string; section: string }>(
  rows: T[],
  filters: ReportFilters,
): T[] {
  return rows.filter((row) => {
    if (filters.classId !== "all" && row.className !== filters.classId) {
      return false;
    }
    if (filters.section !== "all" && row.section !== filters.section) {
      return false;
    }
    return true;
  });
}

export async function getStudentReport(
  filters: ReportFilters,
): Promise<StudentReport> {
  const base = buildStudentReport();
  let rows = applyClassSection(base.rows, filters);
  if (filters.studentId !== "all") {
    rows = rows.filter((r) => r.id === filters.studentId);
  }
  return withDelay({ ...base, rows });
}

export async function getTeacherReport(
  filters: ReportFilters,
): Promise<TeacherReport> {
  const base = buildTeacherReport();
  let rows = base.rows;
  if (filters.teacherId !== "all") {
    rows = rows.filter((r) => r.id === filters.teacherId);
  }
  return withDelay({ ...base, rows });
}

export async function getFeesReport(
  filters: ReportFilters,
): Promise<FeesReport> {
  const base = buildFeesReport();
  let rows = applyClassSection(base.rows, filters);
  if (filters.studentId !== "all") {
    rows = rows.filter((r) => r.studentId === filters.studentId);
  }
  if (filters.paymentMethod !== "All") {
    rows = rows.filter((r) => r.paymentMethod === filters.paymentMethod);
  }
  return withDelay({ ...base, rows });
}

export async function getAttendanceReport(
  filters: ReportFilters,
): Promise<AttendanceReport> {
  const base = buildAttendanceReport();
  let rows = applyClassSection(base.rows, filters);
  if (filters.studentId !== "all") {
    rows = rows.filter((r) => r.studentId === filters.studentId);
  }
  return withDelay({ ...base, rows });
}

export async function getExamReport(
  filters: ReportFilters,
): Promise<ExamReport> {
  const base = buildExamReport();
  let rows = applyClassSection(base.rows, filters);
  if (filters.studentId !== "all") {
    rows = rows.filter((r) => r.studentId === filters.studentId);
  }
  return withDelay({ ...base, rows });
}
