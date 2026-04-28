"use client";

import { create } from "zustand";

import {
  ADMISSIONS,
  BOOK_ISSUES,
  BOOKS,
  BUS_ROUTES,
  GALLERY,
  HOMEWORK,
  HOSTEL_ROOMS,
  INVENTORY,
  LEAVE_REQUESTS,
  LEDGER,
  ONLINE_EXAMS,
  PAYROLL,
  SMS_LOGS,
  type Admission,
  type Book,
  type BookIssue,
  type BusRoute,
  type GalleryAlbum,
  type Homework,
  type HostelRoom,
  type InventoryItem,
  type LeaveRequest,
  type LedgerEntry,
  type OnlineExam,
  type PayrollRow,
  type SmsLog,
} from "@/lib/mock-data/extended";
import { NOTICES, type Notice } from "@/lib/mock-data/notices";
import { FEES, STUDENTS, TEACHERS } from "@/lib/mock-data/reports";
import type {
  FeesRow,
  StudentRow,
  TeacherRow,
} from "@/lib/types/reports";

export interface SchoolState {
  students: StudentRow[];
  teachers: TeacherRow[];
  fees: FeesRow[];
  notices: Notice[];
  admissions: Admission[];
  homework: Homework[];
  leaves: LeaveRequest[];
  payroll: PayrollRow[];
  inventory: InventoryItem[];
  ledger: LedgerEntry[];
  smsLogs: SmsLog[];
  gallery: GalleryAlbum[];
  busRoutes: BusRoute[];
  hostelRooms: HostelRoom[];
  onlineExams: OnlineExam[];
  books: Book[];
  bookIssues: BookIssue[];

  // Mutations
  addStudent: (s: StudentRow) => void;
  updateStudent: (id: string, patch: Partial<StudentRow>) => void;
  removeStudent: (id: string) => void;

  addTeacher: (t: TeacherRow) => void;
  updateTeacher: (id: string, patch: Partial<TeacherRow>) => void;
  removeTeacher: (id: string) => void;

  recordFeePayment: (row: FeesRow) => void;
  setFees: (rows: FeesRow[]) => void;

  publishNotice: (n: Notice) => void;
  togglePinNotice: (id: string) => void;
  removeNotice: (id: string) => void;

  addAdmission: (a: Admission) => void;
  updateAdmission: (id: string, patch: Partial<Admission>) => void;

  addHomework: (h: Homework) => void;

  addLeave: (l: LeaveRequest) => void;
  updateLeave: (id: string, patch: Partial<LeaveRequest>) => void;

  markPayroll: (id: string, status: PayrollRow["status"]) => void;

  addInventory: (i: InventoryItem) => void;
  removeInventory: (id: string) => void;

  addLedgerEntry: (e: LedgerEntry) => void;

  sendSms: (log: SmsLog) => void;

  addAlbum: (a: GalleryAlbum) => void;

  addBusRoute: (r: BusRoute) => void;

  addHostelRoom: (h: HostelRoom) => void;

  addOnlineExam: (e: OnlineExam) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  students: STUDENTS,
  teachers: TEACHERS,
  fees: FEES,
  notices: NOTICES,
  admissions: ADMISSIONS,
  homework: HOMEWORK,
  leaves: LEAVE_REQUESTS,
  payroll: PAYROLL,
  inventory: INVENTORY,
  ledger: LEDGER,
  smsLogs: SMS_LOGS,
  gallery: GALLERY,
  busRoutes: BUS_ROUTES,
  hostelRooms: HOSTEL_ROOMS,
  onlineExams: ONLINE_EXAMS,
  books: BOOKS,
  bookIssues: BOOK_ISSUES,

  addStudent: (s) => set((state) => ({ students: [s, ...state.students] })),
  updateStudent: (id, patch) =>
    set((state) => ({
      students: state.students.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  removeStudent: (id) =>
    set((state) => ({ students: state.students.filter((r) => r.id !== id) })),

  addTeacher: (t) => set((state) => ({ teachers: [t, ...state.teachers] })),
  updateTeacher: (id, patch) =>
    set((state) => ({
      teachers: state.teachers.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  removeTeacher: (id) =>
    set((state) => ({ teachers: state.teachers.filter((r) => r.id !== id) })),

  recordFeePayment: (row) => set((state) => ({ fees: [row, ...state.fees] })),
  setFees: (rows) => set(() => ({ fees: rows })),

  publishNotice: (n) => set((state) => ({ notices: [n, ...state.notices] })),
  togglePinNotice: (id) =>
    set((state) => ({
      notices: state.notices.map((r) =>
        r.id === id ? { ...r, pinned: !r.pinned } : r,
      ),
    })),
  removeNotice: (id) =>
    set((state) => ({ notices: state.notices.filter((r) => r.id !== id) })),

  addAdmission: (a) => set((state) => ({ admissions: [a, ...state.admissions] })),
  updateAdmission: (id, patch) =>
    set((state) => ({
      admissions: state.admissions.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    })),

  addHomework: (h) => set((state) => ({ homework: [h, ...state.homework] })),

  addLeave: (l) => set((state) => ({ leaves: [l, ...state.leaves] })),
  updateLeave: (id, patch) =>
    set((state) => ({
      leaves: state.leaves.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  markPayroll: (id, status) =>
    set((state) => ({
      payroll: state.payroll.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              paidOn:
                status === "Paid"
                  ? new Date().toISOString().slice(0, 10)
                  : r.paidOn,
            }
          : r,
      ),
    })),

  addInventory: (i) =>
    set((state) => ({ inventory: [i, ...state.inventory] })),
  removeInventory: (id) =>
    set((state) => ({ inventory: state.inventory.filter((r) => r.id !== id) })),

  addLedgerEntry: (e) => set((state) => ({ ledger: [e, ...state.ledger] })),

  sendSms: (log) => set((state) => ({ smsLogs: [log, ...state.smsLogs] })),

  addAlbum: (a) => set((state) => ({ gallery: [a, ...state.gallery] })),

  addBusRoute: (r) =>
    set((state) => ({ busRoutes: [r, ...state.busRoutes] })),

  addHostelRoom: (h) =>
    set((state) => ({ hostelRooms: [h, ...state.hostelRooms] })),

  addOnlineExam: (e) =>
    set((state) => ({ onlineExams: [e, ...state.onlineExams] })),
}));
