export type ReportTab =
  | "students"
  | "teachers"
  | "fees"
  | "attendance"
  | "exams";

export type DateRangePreset = "weekly" | "monthly" | "custom";

export type PaymentMethod = "bKash" | "Nagad" | "Cash" | "All";

export type Gender = "Male" | "Female";

export interface DateRange {
  from: string; // ISO date
  to: string; // ISO date
}

export interface ReportFilters {
  preset: DateRangePreset;
  range: DateRange;
  classId: string; // "all" | "1".."10"
  section: string; // "all" | "A" | "B" | "C"
  studentId: string; // "all" | id
  teacherId: string; // "all" | id
  paymentMethod: PaymentMethod;
}

export interface KPI {
  label: string;
  value: string;
  delta?: string;
  tone?: "positive" | "negative" | "neutral";
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface MultiChartPoint {
  label: string;
  [series: string]: number | string;
}

// ---------- Student ----------
export interface StudentRow {
  id: string;
  name: string;
  className: string;
  section: string;
  gender: Gender;
  admissionDate: string;
  status: "Active" | "Transferred" | "Dropout";
  guardian: string;
  phone: string;
}

export interface StudentReport {
  kpis: KPI[];
  rows: StudentRow[];
  classDistribution: ChartPoint[];
  admissionTrend: ChartPoint[];
  genderSplit: ChartPoint[];
}

// ---------- Teacher ----------
export interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  designation: string;
  attendancePct: number;
  monthlySalary: number;
  joinDate: string;
  phone: string;
}

export interface TeacherReport {
  kpis: KPI[];
  rows: TeacherRow[];
  attendanceBySubject: ChartPoint[];
  salaryTrend: ChartPoint[];
}

// ---------- Fees ----------
export interface FeesRow {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  month: string;
  amount: number;
  paid: number;
  due: number;
  fine: number;
  paymentMethod: PaymentMethod | "Pending";
  paymentDate: string;
  status: "Paid" | "Partial" | "Due";
}

export interface FeesReport {
  kpis: KPI[];
  rows: FeesRow[];
  monthlyCollection: MultiChartPoint[]; // bKash/Nagad/Cash per month
  duesVsPaid: ChartPoint[];
  methodBreakdown: ChartPoint[];
}

// ---------- Attendance ----------
export interface AttendanceRow {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  totalDays: number;
  presentDays: number;
  attendancePct: number;
}

export interface AttendanceReport {
  kpis: KPI[];
  rows: AttendanceRow[];
  daily: ChartPoint[];
  weekly: ChartPoint[];
  monthlyPct: ChartPoint[];
  classWise: ChartPoint[];
}

// ---------- Exam ----------
export interface ExamRow {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  exam: string;
  totalMarks: number;
  obtainedMarks: number;
  gpa: number;
  grade: string;
  result: "Pass" | "Fail";
}

export interface ExamReport {
  kpis: KPI[];
  rows: ExamRow[];
  passFail: ChartPoint[];
  gpaDistribution: ChartPoint[];
  topStudents: ExamRow[];
}
