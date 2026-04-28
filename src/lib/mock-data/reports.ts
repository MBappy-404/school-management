import type {
  AttendanceReport,
  AttendanceRow,
  ExamReport,
  ExamRow,
  FeesReport,
  FeesRow,
  Gender,
  PaymentMethod,
  StudentReport,
  StudentRow,
  TeacherReport,
  TeacherRow,
} from "@/lib/types/reports";

// ---------- Static reference data ----------

export const SCHOOL_INFO = {
  name: "Bangladesh Model High School",
  address: "House 12, Road 7, Dhanmondi, Dhaka-1209, Bangladesh",
  phone: "+880 1711-000000",
  email: "info@bdmodelschool.edu.bd",
  eiin: "EIIN-100245",
  headTeacher: "Md. Ashraful Islam",
};

export const CLASS_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

export const SECTION_OPTIONS = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
];

export const PAYMENT_METHODS: PaymentMethod[] = ["bKash", "Nagad", "Cash"];

const BD_FIRST_NAMES = [
  "Mohammad",
  "Abdul",
  "Rakib",
  "Sajib",
  "Rasel",
  "Tariq",
  "Imran",
  "Sohel",
  "Nayeem",
  "Mahin",
  "Tanvir",
  "Shakib",
  "Fatima",
  "Ayesha",
  "Sumaiya",
  "Tasnim",
  "Nusrat",
  "Mariam",
  "Sabrina",
  "Tahmina",
  "Jannatul",
  "Israt",
  "Farhana",
  "Rumana",
];

const BD_LAST_NAMES = [
  "Rahman",
  "Hossain",
  "Islam",
  "Ahmed",
  "Khan",
  "Chowdhury",
  "Sheikh",
  "Kabir",
  "Akter",
  "Begum",
  "Sultana",
  "Karim",
  "Mia",
  "Uddin",
  "Sarker",
];

const SUBJECTS = [
  "Bangla",
  "English",
  "Mathematics",
  "Science",
  "ICT",
  "Religion",
  "Social Science",
  "Bangladesh & Global Studies",
  "Higher Math",
  "Physics",
];

const DESIGNATIONS = [
  "Senior Teacher",
  "Assistant Teacher",
  "Head of Department",
  "Lecturer",
];

// Deterministic pseudo-random so demo data is stable.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260101);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function int(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function bdName(gender: Gender): string {
  const first = pick(BD_FIRST_NAMES);
  const last = pick(BD_LAST_NAMES);
  // Light gender bias for demo
  if (gender === "Female" && !["Akter", "Begum", "Sultana"].includes(last)) {
    return `${first} ${last}`;
  }
  return `${first} ${last}`;
}

function phone(): string {
  return `+8801${int(3, 9)}${String(int(0, 99999999)).padStart(8, "0")}`;
}

function dateOffsetDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---------- Students ----------

export const STUDENTS: StudentRow[] = Array.from({ length: 80 }, (_, i) => {
  const gender: Gender = rand() > 0.45 ? "Male" : "Female";
  const classNum = int(1, 10);
  const sectionLetter = pick(["A", "B", "C"]);
  const status: StudentRow["status"] =
    rand() > 0.92 ? (rand() > 0.5 ? "Transferred" : "Dropout") : "Active";
  return {
    id: `STD-${String(1000 + i)}`,
    name: bdName(gender),
    className: String(classNum),
    section: sectionLetter,
    gender,
    admissionDate: dateOffsetDays(-int(30, 720)),
    status,
    guardian: bdName(rand() > 0.5 ? "Male" : "Female"),
    phone: phone(),
  };
});

export function buildStudentReport(rows: StudentRow[] = STUDENTS): StudentReport {
  const total = rows.length;
  const males = rows.filter((s) => s.gender === "Male").length;
  const females = total - males;
  const transfers = rows.filter((s) => s.status === "Transferred").length;
  const dropouts = rows.filter((s) => s.status === "Dropout").length;

  const classDistribution = CLASS_OPTIONS.map((c) => ({
    label: c.label,
    value: rows.filter((s) => s.className === c.value).length,
  }));

  const months = [
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];
  const admissionTrend = months.map((m) => ({
    label: m,
    value: int(2, 18),
  }));

  return {
    kpis: [
      { label: "Total Students", value: String(total), tone: "neutral" },
      {
        label: "Male / Female",
        value: `${males} / ${females}`,
        tone: "neutral",
      },
      {
        label: "Transfers",
        value: String(transfers),
        delta: "this term",
        tone: "negative",
      },
      {
        label: "Dropouts",
        value: String(dropouts),
        delta: "this term",
        tone: "negative",
      },
    ],
    rows,
    classDistribution,
    admissionTrend,
    genderSplit: [
      { label: "Male", value: males },
      { label: "Female", value: females },
    ],
  };
}

// ---------- Teachers ----------

export const TEACHERS: TeacherRow[] = Array.from({ length: 24 }, (_, i) => {
  const gender: Gender = rand() > 0.5 ? "Male" : "Female";
  return {
    id: `TCH-${String(2000 + i)}`,
    name: bdName(gender),
    subject: pick(SUBJECTS),
    designation: pick(DESIGNATIONS),
    attendancePct: 80 + Math.round(rand() * 19),
    monthlySalary: 22000 + int(0, 30) * 1000,
    joinDate: dateOffsetDays(-int(180, 2400)),
    phone: phone(),
  };
});

export function buildTeacherReport(rows: TeacherRow[] = TEACHERS): TeacherReport {
  const total = rows.length;
  const avgAttendance =
    rows.reduce((acc, t) => acc + t.attendancePct, 0) / Math.max(1, total);
  const totalSalary = rows.reduce((acc, t) => acc + t.monthlySalary, 0);

  const subjects = Array.from(new Set(rows.map((t) => t.subject)));
  const attendanceBySubject = subjects.map((s) => {
    const teachers = rows.filter((t) => t.subject === s);
    const avg =
      teachers.reduce((acc, t) => acc + t.attendancePct, 0) /
      Math.max(1, teachers.length);
    return { label: s, value: Math.round(avg) };
  });

  const months = [
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];
  const salaryTrend = months.map((m) => ({
    label: m,
    value: totalSalary + int(-15000, 15000),
  }));

  return {
    kpis: [
      { label: "Total Teachers", value: String(total) },
      {
        label: "Avg Attendance",
        value: `${avgAttendance.toFixed(1)}%`,
        tone: "positive",
      },
      {
        label: "Monthly Payroll",
        value: `৳ ${(totalSalary / 100000).toFixed(2)} L`,
        tone: "neutral",
      },
      {
        label: "Subjects Covered",
        value: String(subjects.length),
      },
    ],
    rows,
    attendanceBySubject,
    salaryTrend,
  };
}

// ---------- Fees ----------

const MONTHS_SHORT = [
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
];

export const FEES: FeesRow[] = STUDENTS.flatMap((student, idx) =>
  MONTHS_SHORT.slice(0, 6).map((m, mi) => {
    const amount = 1500 + int(0, 12) * 250;
    const paidPct = rand();
    const paid = paidPct > 0.85 ? amount : Math.round(amount * paidPct);
    const due = amount - paid;
    const fine = due > 0 && rand() > 0.6 ? int(50, 250) : 0;
    const status: FeesRow["status"] =
      due === 0 ? "Paid" : paid > 0 ? "Partial" : "Due";
    const method: PaymentMethod | "Pending" =
      paid > 0 ? pick(PAYMENT_METHODS) : "Pending";
    return {
      id: `FEE-${idx}-${mi}`,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      section: student.section,
      month: m,
      amount,
      paid,
      due,
      fine,
      paymentMethod: method,
      paymentDate: paid > 0 ? dateOffsetDays(-int(0, 180)) : "",
      status,
    };
  }),
);

export function buildFeesReport(rows: FeesRow[] = FEES): FeesReport {
  const totalDue = rows.reduce((a, f) => a + f.due, 0);
  const totalPaid = rows.reduce((a, f) => a + f.paid, 0);
  const totalFine = rows.reduce((a, f) => a + f.fine, 0);
  const collectionPct =
    totalPaid + totalDue > 0
      ? (totalPaid / (totalPaid + totalDue)) * 100
      : 0;

  const monthlyCollection = MONTHS_SHORT.slice(0, 6).map((m) => {
    const monthRows = rows.filter((f) => f.month === m);
    const bKash = monthRows
      .filter((f) => f.paymentMethod === "bKash")
      .reduce((a, f) => a + f.paid, 0);
    const Nagad = monthRows
      .filter((f) => f.paymentMethod === "Nagad")
      .reduce((a, f) => a + f.paid, 0);
    const Cash = monthRows
      .filter((f) => f.paymentMethod === "Cash")
      .reduce((a, f) => a + f.paid, 0);
    return { label: m, bKash, Nagad, Cash };
  });

  const methodBreakdown: { label: string; value: number }[] = [
    "bKash",
    "Nagad",
    "Cash",
  ].map((m) => ({
    label: m,
    value: rows
      .filter((f) => f.paymentMethod === m)
      .reduce((a, f) => a + f.paid, 0),
  }));

  return {
    kpis: [
      {
        label: "Total Collected",
        value: `৳ ${(totalPaid / 100000).toFixed(2)} L`,
        tone: "positive",
      },
      {
        label: "Total Due",
        value: `৳ ${(totalDue / 100000).toFixed(2)} L`,
        tone: "negative",
      },
      {
        label: "Fine Collected",
        value: `৳ ${totalFine.toLocaleString("en-BD")}`,
        tone: "neutral",
      },
      {
        label: "Collection Rate",
        value: `${collectionPct.toFixed(1)}%`,
        tone: collectionPct > 80 ? "positive" : "negative",
      },
    ],
    rows,
    monthlyCollection,
    duesVsPaid: [
      { label: "Paid", value: totalPaid },
      { label: "Due", value: totalDue },
    ],
    methodBreakdown,
  };
}

// ---------- Attendance ----------

export const ATTENDANCE_DAILY: AttendanceRow[] = STUDENTS.map((s, idx) => {
  const totalDays = 22;
  const presentDays = totalDays - int(0, 6);
  const attendancePct = (presentDays / totalDays) * 100;
  const today = pick(["Present", "Absent", "Late"] as const);
  return {
    id: `ATT-${idx}`,
    studentId: s.id,
    studentName: s.name,
    className: s.className,
    section: s.section,
    date: dateOffsetDays(0),
    status: today,
    totalDays,
    presentDays,
    attendancePct,
  };
});

export function buildAttendanceReport(): AttendanceReport {
  const total = ATTENDANCE_DAILY.length;
  const presentToday = ATTENDANCE_DAILY.filter(
    (r) => r.status === "Present",
  ).length;
  const lateToday = ATTENDANCE_DAILY.filter((r) => r.status === "Late").length;
  const absentToday = total - presentToday - lateToday;
  const avgPct =
    ATTENDANCE_DAILY.reduce((a, r) => a + r.attendancePct, 0) / total;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
  const daily = days.map((d) => ({
    label: d,
    value: 80 + int(0, 18),
  }));
  const weekly = ["W1", "W2", "W3", "W4"].map((w) => ({
    label: w,
    value: 82 + int(0, 16),
  }));
  const monthlyPct = [
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ].map((m) => ({
    label: m,
    value: 85 + int(0, 12),
  }));
  const classWise = CLASS_OPTIONS.map((c) => ({
    label: c.label,
    value: 80 + int(0, 18),
  }));

  return {
    kpis: [
      {
        label: "Present Today",
        value: `${presentToday} / ${total}`,
        tone: "positive",
      },
      {
        label: "Late Today",
        value: String(lateToday),
        tone: "neutral",
      },
      {
        label: "Absent Today",
        value: String(absentToday),
        tone: "negative",
      },
      {
        label: "Avg Attendance %",
        value: `${avgPct.toFixed(1)}%`,
        tone: avgPct > 85 ? "positive" : "negative",
      },
    ],
    rows: ATTENDANCE_DAILY,
    daily,
    weekly,
    monthlyPct,
    classWise,
  };
}

// ---------- Exams ----------

const EXAMS = ["First Term", "Mid Term", "Final Term"];

function gradeFromGpa(gpa: number): string {
  if (gpa >= 5) return "A+";
  if (gpa >= 4) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3) return "B";
  if (gpa >= 2) return "C";
  if (gpa >= 1) return "D";
  return "F";
}

export const EXAM_RESULTS: ExamRow[] = STUDENTS.flatMap((s, idx) =>
  EXAMS.map((e, ei) => {
    const totalMarks = 500;
    const pct = 35 + int(0, 60);
    const obtainedMarks = Math.round((totalMarks * pct) / 100);
    let gpa: number;
    if (pct >= 80) gpa = 5;
    else if (pct >= 70) gpa = 4;
    else if (pct >= 60) gpa = 3.5;
    else if (pct >= 50) gpa = 3;
    else if (pct >= 40) gpa = 2;
    else if (pct >= 33) gpa = 1;
    else gpa = 0;
    return {
      id: `EXM-${idx}-${ei}`,
      studentId: s.id,
      studentName: s.name,
      className: s.className,
      section: s.section,
      exam: e,
      totalMarks,
      obtainedMarks,
      gpa,
      grade: gradeFromGpa(gpa),
      result: gpa >= 1 ? "Pass" : "Fail",
    };
  }),
);

export function buildExamReport(): ExamReport {
  const passCount = EXAM_RESULTS.filter((r) => r.result === "Pass").length;
  const failCount = EXAM_RESULTS.length - passCount;
  const avgGpa =
    EXAM_RESULTS.reduce((a, r) => a + r.gpa, 0) / EXAM_RESULTS.length;
  const aPlus = EXAM_RESULTS.filter((r) => r.grade === "A+").length;

  const grades = ["A+", "A", "A-", "B", "C", "D", "F"];
  const gpaDistribution = grades.map((g) => ({
    label: g,
    value: EXAM_RESULTS.filter((r) => r.grade === g).length,
  }));

  const topStudents = [...EXAM_RESULTS]
    .filter((r) => r.exam === "Final Term")
    .sort((a, b) => b.obtainedMarks - a.obtainedMarks)
    .slice(0, 10);

  return {
    kpis: [
      {
        label: "Pass Rate",
        value: `${((passCount / EXAM_RESULTS.length) * 100).toFixed(1)}%`,
        tone: "positive",
      },
      {
        label: "Avg GPA",
        value: avgGpa.toFixed(2),
        tone: "neutral",
      },
      { label: "A+ Count", value: String(aPlus), tone: "positive" },
      { label: "Failures", value: String(failCount), tone: "negative" },
    ],
    rows: EXAM_RESULTS,
    passFail: [
      { label: "Pass", value: passCount },
      { label: "Fail", value: failCount },
    ],
    gpaDistribution,
    topStudents,
  };
}
