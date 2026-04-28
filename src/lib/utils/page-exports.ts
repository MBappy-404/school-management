"use client";

import { exportToExcel } from "@/lib/utils/export-excel";
import type {
  FeesRow,
  StudentRow,
  TeacherRow,
} from "@/lib/types/reports";
import type {
  Admission,
  InventoryItem,
  LedgerEntry,
  PayrollRow,
} from "@/lib/mock-data/extended";

const today = () => new Date().toISOString().slice(0, 10);

export function downloadStudentsExcel(rows: StudentRow[]): void {
  exportToExcel<StudentRow>({
    filename: `students-${today()}`,
    sheetName: "Students",
    rows,
    meta: {
      School: "Bangladesh Model High School",
      Generated: today(),
      Count: String(rows.length),
    },
    columns: [
      { header: "Student ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Class", accessor: (r) => `Class ${r.className} (${r.section})` },
      { header: "Gender", accessor: "gender" },
      { header: "Guardian", accessor: "guardian" },
      { header: "Phone", accessor: "phone" },
      { header: "Admission", accessor: "admissionDate" },
      { header: "Status", accessor: "status" },
    ],
  });
}

export function downloadTeachersExcel(rows: TeacherRow[]): void {
  exportToExcel<TeacherRow>({
    filename: `teachers-${today()}`,
    sheetName: "Teachers",
    rows,
    meta: {
      School: "Bangladesh Model High School",
      Generated: today(),
      Count: String(rows.length),
    },
    columns: [
      { header: "Teacher ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Subject", accessor: "subject" },
      { header: "Designation", accessor: "designation" },
      { header: "Attendance %", accessor: "attendancePct" },
      { header: "Salary", accessor: "monthlySalary", currency: true },
      { header: "Joined", accessor: "joinDate" },
      { header: "Phone", accessor: "phone" },
    ],
  });
}

export function downloadFeesExcel(rows: FeesRow[]): void {
  exportToExcel<FeesRow>({
    filename: `fees-${today()}`,
    sheetName: "Fees",
    rows,
    meta: {
      School: "Bangladesh Model High School",
      Generated: today(),
      Count: String(rows.length),
    },
    columns: [
      { header: "Receipt", accessor: "id" },
      { header: "Student", accessor: "studentName" },
      { header: "Class", accessor: (r) => `Class ${r.className} (${r.section})` },
      { header: "Month", accessor: "month" },
      { header: "Amount", accessor: "amount", currency: true },
      { header: "Paid", accessor: "paid", currency: true },
      { header: "Due", accessor: "due", currency: true },
      { header: "Fine", accessor: "fine", currency: true },
      { header: "Method", accessor: "paymentMethod" },
      { header: "Status", accessor: "status" },
    ],
  });
}

export function downloadPayrollExcel(rows: PayrollRow[]): void {
  exportToExcel<PayrollRow>({
    filename: `payroll-${today()}`,
    sheetName: "Payroll",
    rows,
    columns: [
      { header: "Payroll ID", accessor: "id" },
      { header: "Staff", accessor: "staffName" },
      { header: "Designation", accessor: "designation" },
      { header: "Basic", accessor: "basic", currency: true },
      { header: "Allowance", accessor: "allowance", currency: true },
      { header: "Deduction", accessor: "deduction", currency: true },
      { header: "Net", accessor: "net", currency: true },
      { header: "Status", accessor: "status" },
      { header: "Paid On", accessor: "paidOn" },
    ],
  });
}

export function downloadInventoryExcel(rows: InventoryItem[]): void {
  exportToExcel<InventoryItem>({
    filename: `inventory-${today()}`,
    sheetName: "Inventory",
    rows,
    columns: [
      { header: "Item ID", accessor: "id" },
      { header: "Item", accessor: "name" },
      { header: "Category", accessor: "category" },
      { header: "Stock", accessor: "inStock" },
      { header: "Reorder", accessor: "reorderLevel" },
      { header: "Unit Price", accessor: "unitPrice", currency: true },
      {
        header: "Value",
        accessor: (r) => r.inStock * r.unitPrice,
        currency: true,
      },
      { header: "Supplier", accessor: "supplier" },
    ],
  });
}

export function downloadLedgerExcel(rows: LedgerEntry[]): void {
  exportToExcel<LedgerEntry>({
    filename: `accounting-${today()}`,
    sheetName: "Ledger",
    rows,
    columns: [
      { header: "Entry", accessor: "id" },
      { header: "Date", accessor: "date" },
      { header: "Type", accessor: "type" },
      { header: "Head", accessor: "head" },
      { header: "Description", accessor: "description" },
      { header: "Reference", accessor: "reference" },
      { header: "Amount", accessor: "amount", currency: true },
    ],
  });
}

export function downloadAdmissionsExcel(rows: Admission[]): void {
  exportToExcel<Admission>({
    filename: `admissions-${today()}`,
    sheetName: "Admissions",
    rows,
    columns: [
      { header: "Applicant ID", accessor: "id" },
      { header: "Name", accessor: "applicantName" },
      { header: "Class", accessor: (r) => `Class ${r.appliedClass}` },
      { header: "Gender", accessor: "gender" },
      { header: "Guardian", accessor: "guardianName" },
      { header: "Phone", accessor: "phone" },
      { header: "Applied", accessor: "appliedOn" },
      { header: "Status", accessor: "status" },
      { header: "Score", accessor: "score" },
    ],
  });
}
