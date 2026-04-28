/**
 * Extended mock data for the premium dashboard:
 * Admissions, Library, Transport, Hostel, Inventory, Routine,
 * Subjects, Homework, Accounting, Payroll, SMS, Calendar, Gallery,
 * Leave, Online Exam, Parent Portal.
 *
 * All data is deterministic — uses the same mulberry32 seed pattern as
 * `reports.ts` so demos are reproducible.
 */

import { STUDENTS, TEACHERS } from "./reports";

// Deterministic PRNG (separate seed so admissions/library data is stable)
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
const rand = mulberry32(20260214);
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)]!;
const int = (min: number, max: number): number =>
  Math.floor(rand() * (max - min + 1)) + min;
const offset = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const FIRST_NAMES = [
  "Mohammad",
  "Abdul",
  "Rakib",
  "Sajib",
  "Tariq",
  "Imran",
  "Sohel",
  "Nayeem",
  "Tanvir",
  "Shakib",
  "Fatima",
  "Ayesha",
  "Sumaiya",
  "Tasnim",
  "Mariam",
  "Sabrina",
  "Tahmina",
  "Jannatul",
  "Israt",
  "Farhana",
];
const LAST_NAMES = [
  "Rahman",
  "Hossain",
  "Islam",
  "Ahmed",
  "Khan",
  "Chowdhury",
  "Sheikh",
  "Akter",
  "Sultana",
  "Karim",
  "Mia",
  "Uddin",
  "Sarker",
];
const fullName = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

// =====================================================================
// Admissions — applicant queue
// =====================================================================

export type AdmissionStatus = "Pending" | "Reviewing" | "Approved" | "Rejected";

export interface Admission {
  id: string;
  applicantName: string;
  appliedClass: string;
  guardianName: string;
  phone: string;
  appliedOn: string; // ISO
  previousSchool: string;
  gender: "Male" | "Female";
  dob: string; // ISO
  status: AdmissionStatus;
  score: number; // 0-100
}

const PREV_SCHOOLS = [
  "Sunshine Kindergarten",
  "Little Steps Pre-school",
  "Dhanmondi Govt. Primary",
  "Mirpur Cantonment Public School",
  "Bashundhara Adarsha School",
  "Uttara High School",
  "Tejgaon Govt. Boys School",
  "Motijheel Ideal School",
];

export const ADMISSIONS: Admission[] = Array.from({ length: 22 }, (_, i) => {
  const applied = -int(0, 30);
  const score = int(45, 95);
  let status: AdmissionStatus = "Pending";
  if (i < 6) status = "Approved";
  else if (i < 9) status = "Rejected";
  else if (i < 14) status = "Reviewing";
  return {
    id: `ADM-${String(2026100 + i)}`,
    applicantName: fullName(),
    appliedClass: String(int(1, 10)),
    guardianName: fullName(),
    phone: `+8801${int(3, 9)}${String(int(0, 99999999)).padStart(8, "0")}`,
    appliedOn: offset(applied),
    previousSchool: pick(PREV_SCHOOLS),
    gender: rand() > 0.5 ? "Male" : "Female",
    dob: offset(-int(2200, 4500)),
    status,
    score,
  };
});

// =====================================================================
// Routine / Timetable
// =====================================================================

export interface Period {
  day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu";
  period: number; // 1..7
  subject: string;
  teacher: string;
}

export const ROUTINE_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu"] as const;
export const ROUTINE_PERIODS = [1, 2, 3, 4, 5, 6, 7] as const;
export const ROUTINE_PERIOD_TIMES = [
  "08:00 – 08:40",
  "08:45 – 09:25",
  "09:30 – 10:10",
  "10:15 – 10:55",
  "11:00 – 11:40",
  "11:45 – 12:25",
  "12:30 – 13:10",
];

const SUBJECTS_BY_CLASS = [
  "Bangla 1st",
  "Bangla 2nd",
  "English 1st",
  "English 2nd",
  "Mathematics",
  "Higher Math",
  "General Science",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Religion",
  "Social Science",
  "BGS",
  "Physical Education",
];

export function buildRoutine(className: string, section: string): Period[] {
  // deterministic by (class, section)
  const seed =
    Number.parseInt(className, 10) * 31 + section.charCodeAt(0) + 1234;
  const r = mulberry32(seed);
  const rPick = <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)]!;
  const periods: Period[] = [];
  for (const day of ROUTINE_DAYS) {
    for (const p of ROUTINE_PERIODS) {
      periods.push({
        day,
        period: p,
        subject: rPick(SUBJECTS_BY_CLASS),
        teacher: TEACHERS[Math.floor(r() * TEACHERS.length)]?.name ?? "Staff",
      });
    }
  }
  return periods;
}

// =====================================================================
// Subjects & Syllabus
// =====================================================================

export interface Subject {
  id: string;
  code: string;
  name: string;
  classes: string[];
  type: "Compulsory" | "Optional";
  fullMarks: number;
  passMarks: number;
  syllabusOutline: string;
}

export const SUBJECTS: Subject[] = [
  {
    id: "SUB-101",
    code: "BNG-101",
    name: "Bangla 1st Paper",
    classes: ["6", "7", "8", "9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline:
      "Prose, poetry, novel, drama from NCTB-prescribed text + grammar.",
  },
  {
    id: "SUB-102",
    code: "BNG-102",
    name: "Bangla 2nd Paper",
    classes: ["9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Grammar, composition, letter writing, essay, application.",
  },
  {
    id: "SUB-201",
    code: "ENG-101",
    name: "English 1st Paper",
    classes: ["6", "7", "8", "9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline:
      "Seen passages, MCQ, short questions, summary writing, theme.",
  },
  {
    id: "SUB-202",
    code: "ENG-102",
    name: "English 2nd Paper",
    classes: ["9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Grammar, vocabulary, paragraph, dialogue, story writing.",
  },
  {
    id: "SUB-301",
    code: "MAT-101",
    name: "Mathematics",
    classes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Algebra, geometry, trigonometry, statistics, mensuration.",
  },
  {
    id: "SUB-302",
    code: "MAT-201",
    name: "Higher Mathematics",
    classes: ["9", "10"],
    type: "Optional",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Sets, functions, calculus introduction, vector.",
  },
  {
    id: "SUB-401",
    code: "SCI-101",
    name: "General Science",
    classes: ["6", "7", "8"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Physical, life, earth & space, environmental science.",
  },
  {
    id: "SUB-411",
    code: "PHY-101",
    name: "Physics",
    classes: ["9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline:
      "Mechanics, heat, light, electricity, magnetism, modern physics.",
  },
  {
    id: "SUB-412",
    code: "CHE-101",
    name: "Chemistry",
    classes: ["9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Atoms, periodic table, chemical bonding, reactions.",
  },
  {
    id: "SUB-413",
    code: "BIO-101",
    name: "Biology",
    classes: ["9", "10"],
    type: "Optional",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Cell, genetics, human physiology, plants & animals.",
  },
  {
    id: "SUB-501",
    code: "ICT-101",
    name: "ICT",
    classes: ["6", "7", "8", "9", "10"],
    type: "Compulsory",
    fullMarks: 50,
    passMarks: 17,
    syllabusOutline: "Computer basics, networks, programming, cyber safety.",
  },
  {
    id: "SUB-601",
    code: "REL-101",
    name: "Religion & Moral Education",
    classes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline: "Faith, worship, ethics, history of religion.",
  },
  {
    id: "SUB-701",
    code: "BGS-101",
    name: "Bangladesh & Global Studies",
    classes: ["6", "7", "8"],
    type: "Compulsory",
    fullMarks: 100,
    passMarks: 33,
    syllabusOutline:
      "Geography, history, civics of Bangladesh and the world.",
  },
];

// =====================================================================
// Homework / Daily Diary
// =====================================================================

export type HomeworkStatus = "Assigned" | "Submitted" | "Graded" | "Pending";

export interface Homework {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  assignedBy: string;
  assignedOn: string;
  dueDate: string;
  status: HomeworkStatus;
  description: string;
}

export const HOMEWORK: Homework[] = Array.from({ length: 14 }, (_, i) => {
  const sub = pick(SUBJECTS);
  return {
    id: `HW-${String(2001 + i)}`,
    title: `${sub.name} — Chapter ${int(1, 12)} exercise`,
    subject: sub.name,
    className: pick(sub.classes),
    section: pick(["A", "B", "C"]),
    assignedBy: TEACHERS[int(0, TEACHERS.length - 1)]?.name ?? "Staff",
    assignedOn: offset(-int(0, 7)),
    dueDate: offset(int(1, 7)),
    status: pick(["Assigned", "Submitted", "Graded", "Pending"]),
    description: `Solve all questions of Chapter ${int(1, 12)} from textbook. Bring fair copy on due date.`,
  };
});

// =====================================================================
// Library
// =====================================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  category: "Bangla" | "English" | "Science" | "Reference" | "Religion" | "Story";
  isbn: string;
  copies: number;
  available: number;
  location: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerType: "Student" | "Teacher";
  borrowerName: string;
  borrowerId: string;
  issuedOn: string;
  dueDate: string;
  returned: boolean;
  fine: number;
}

const BOOK_TITLES = [
  { t: "Padma Nadir Majhi", a: "Manik Bandopadhyay", c: "Bangla" },
  { t: "Lalsalu", a: "Syed Waliullah", c: "Bangla" },
  { t: "Pather Panchali", a: "Bibhutibhushan Bandopadhyay", c: "Bangla" },
  { t: "Concise Higher Mathematics", a: "Md. Akram Hossain", c: "Reference" },
  { t: "English Grammar in Use", a: "Raymond Murphy", c: "English" },
  { t: "Things Fall Apart", a: "Chinua Achebe", c: "English" },
  { t: "A Brief History of Time", a: "Stephen Hawking", c: "Science" },
  { t: "Cosmos", a: "Carl Sagan", c: "Science" },
  { t: "Sahih al-Bukhari (Selected)", a: "Imam Bukhari", c: "Religion" },
  { t: "Bangla Sahitye Hashyo Rosh", a: "Various", c: "Bangla" },
  { t: "Three Stories", a: "Rabindranath Tagore", c: "Story" },
  { t: "Champion Mathematics 9-10", a: "Saiful Islam", c: "Reference" },
  { t: "Physics for HSC", a: "Tofazzal Hossain", c: "Science" },
  { t: "Treasure Island", a: "R. L. Stevenson", c: "English" },
] as const;

export const BOOKS: Book[] = BOOK_TITLES.map((b, i) => {
  const copies = int(3, 12);
  const available = int(0, copies);
  return {
    id: `BK-${String(5000 + i)}`,
    title: b.t,
    author: b.a,
    category: b.c as Book["category"],
    isbn: `978-984-${String(int(10000, 99999))}-${int(0, 9)}`,
    copies,
    available,
    location: `Shelf ${pick(["A", "B", "C", "D", "E"])}-${int(1, 12)}`,
  };
});

export const BOOK_ISSUES: BookIssue[] = Array.from({ length: 16 }, (_, i) => {
  const isStudent = rand() > 0.3;
  const book = BOOKS[int(0, BOOKS.length - 1)]!;
  const days = -int(1, 30);
  const due = days + int(7, 21);
  const returned = rand() > 0.55;
  return {
    id: `LIB-${String(7100 + i)}`,
    bookId: book.id,
    bookTitle: book.title,
    borrowerType: isStudent ? "Student" : "Teacher",
    borrowerName: isStudent
      ? STUDENTS[int(0, STUDENTS.length - 1)]?.name ?? "Student"
      : TEACHERS[int(0, TEACHERS.length - 1)]?.name ?? "Teacher",
    borrowerId: isStudent
      ? STUDENTS[int(0, STUDENTS.length - 1)]?.id ?? "STD-1000"
      : TEACHERS[int(0, TEACHERS.length - 1)]?.id ?? "TCH-100",
    issuedOn: offset(days),
    dueDate: offset(due),
    returned,
    fine: !returned && due < 0 ? Math.abs(due) * 5 : 0,
  };
});

// =====================================================================
// Transport — routes, vehicles, students
// =====================================================================

export interface BusRoute {
  id: string;
  name: string;
  driver: string;
  driverPhone: string;
  vehicleNo: string;
  capacity: number;
  occupied: number;
  pickupPoints: string[];
  monthlyFee: number;
}

export const BUS_ROUTES: BusRoute[] = [
  {
    id: "RT-01",
    name: "Dhanmondi – Mirpur",
    driver: "Md. Anwar Hossain",
    driverPhone: "+8801711-220011",
    vehicleNo: "Dhaka Metro-Cha-11-2034",
    capacity: 36,
    occupied: 32,
    pickupPoints: [
      "Dhanmondi 27",
      "Asad Gate",
      "Shyamoli Square",
      "Mirpur 1",
      "Mirpur 10",
      "School",
    ],
    monthlyFee: 1500,
  },
  {
    id: "RT-02",
    name: "Uttara – Airport",
    driver: "Md. Kamruzzaman",
    driverPhone: "+8801822-330022",
    vehicleNo: "Dhaka Metro-Cha-11-2289",
    capacity: 32,
    occupied: 28,
    pickupPoints: [
      "Uttara Sector 7",
      "House Building",
      "Airport",
      "Khilkhet",
      "Banani",
      "School",
    ],
    monthlyFee: 1800,
  },
  {
    id: "RT-03",
    name: "Bashundhara – Gulshan",
    driver: "Mr. Liton Mia",
    driverPhone: "+8801911-440033",
    vehicleNo: "Dhaka Metro-Cha-11-3115",
    capacity: 30,
    occupied: 24,
    pickupPoints: [
      "Bashundhara Gate-3",
      "Notun Bazar",
      "Gulshan 1",
      "Gulshan 2",
      "Mohakhali",
      "School",
    ],
    monthlyFee: 1700,
  },
  {
    id: "RT-04",
    name: "Mohammadpur – Lalmatia",
    driver: "Md. Faruk Ahmed",
    driverPhone: "+8801711-550044",
    vehicleNo: "Dhaka Metro-Cha-11-4101",
    capacity: 28,
    occupied: 19,
    pickupPoints: [
      "Mohammadpur Bus Stand",
      "Asad Gate",
      "Lalmatia Block A",
      "Dhanmondi 7",
      "School",
    ],
    monthlyFee: 1400,
  },
];

// =====================================================================
// Hostel
// =====================================================================

export interface HostelRoom {
  id: string;
  block: "Boys A" | "Boys B" | "Girls A";
  roomNo: string;
  capacity: number;
  occupied: number;
  monthlyFee: number;
  warden: string;
}

export const HOSTEL_ROOMS: HostelRoom[] = Array.from({ length: 18 }, (_, i) => {
  const block = ((i: number) =>
    i < 6 ? "Boys A" : i < 12 ? "Boys B" : "Girls A")(i) as HostelRoom["block"];
  const cap = int(2, 4);
  return {
    id: `HR-${String(101 + i)}`,
    block,
    roomNo: `${block === "Boys A" ? "A" : block === "Boys B" ? "B" : "G"}-${100 + i}`,
    capacity: cap,
    occupied: int(0, cap),
    monthlyFee: 4500,
    warden: block === "Girls A" ? "Mrs. Nasrin Sultana" : "Md. Jahangir Alam",
  };
});

// =====================================================================
// Inventory / Stock
// =====================================================================

export interface InventoryItem {
  id: string;
  name: string;
  category: "Stationery" | "Lab" | "Sports" | "Furniture" | "IT" | "Cleaning";
  unit: string;
  inStock: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
  lastPurchased: string;
}

const SUPPLIERS = [
  "Rahim Brothers Trading",
  "Jamuna Office Mart",
  "Anwar IT Solutions",
  "Bangla Furniture Ltd",
  "BD Sports House",
  "Cleanex Bangladesh",
];

export const INVENTORY: InventoryItem[] = [
  { name: "A4 Paper Ream", cat: "Stationery", unit: "ream", price: 350 },
  { name: "Whiteboard Marker", cat: "Stationery", unit: "pcs", price: 60 },
  { name: "Chalk (Box of 100)", cat: "Stationery", unit: "box", price: 180 },
  { name: "Test Tube", cat: "Lab", unit: "pcs", price: 25 },
  { name: "Microscope", cat: "Lab", unit: "pcs", price: 8500 },
  { name: "Football", cat: "Sports", unit: "pcs", price: 1100 },
  { name: "Cricket Ball", cat: "Sports", unit: "pcs", price: 280 },
  { name: "Student Bench", cat: "Furniture", unit: "pcs", price: 4800 },
  { name: "Teacher Chair", cat: "Furniture", unit: "pcs", price: 3500 },
  { name: "Desktop Computer", cat: "IT", unit: "pcs", price: 42000 },
  { name: "Projector", cat: "IT", unit: "pcs", price: 38000 },
  { name: "Phenyl 5L", cat: "Cleaning", unit: "bottle", price: 320 },
].map((it, i) => ({
  id: `INV-${String(8001 + i)}`,
  name: it.name,
  category: it.cat as InventoryItem["category"],
  unit: it.unit,
  inStock: int(2, 60),
  reorderLevel: int(5, 15),
  unitPrice: it.price,
  supplier: pick(SUPPLIERS),
  lastPurchased: offset(-int(5, 90)),
}));

// =====================================================================
// Accounting — income / expense ledger
// =====================================================================

export type LedgerType = "Income" | "Expense";
export type LedgerHead =
  | "Tuition Fee"
  | "Admission Fee"
  | "Exam Fee"
  | "Transport Fee"
  | "Hostel Fee"
  | "Library Fine"
  | "Donation"
  | "Salary"
  | "Utility"
  | "Maintenance"
  | "Stationery"
  | "Event"
  | "Lab"
  | "Other";

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerType;
  head: LedgerHead;
  description: string;
  amount: number;
  paymentMode: "Cash" | "bKash" | "Nagad" | "Bank";
  reference: string;
}

const INCOME_HEADS: LedgerHead[] = [
  "Tuition Fee",
  "Admission Fee",
  "Exam Fee",
  "Transport Fee",
  "Hostel Fee",
  "Donation",
];
const EXPENSE_HEADS: LedgerHead[] = [
  "Salary",
  "Utility",
  "Maintenance",
  "Stationery",
  "Event",
  "Lab",
  "Other",
];

export const LEDGER: LedgerEntry[] = Array.from({ length: 36 }, (_, i) => {
  const isIncome = rand() > 0.42;
  const head = isIncome ? pick(INCOME_HEADS) : pick(EXPENSE_HEADS);
  const baseAmount = isIncome
    ? int(8000, 220000)
    : head === "Salary"
      ? int(180000, 480000)
      : int(2500, 65000);
  return {
    id: `LDG-${String(11001 + i)}`,
    date: offset(-int(0, 90)),
    type: isIncome ? "Income" : "Expense",
    head,
    description: isIncome
      ? `${head} collection`
      : `${head} payment / disbursement`,
    amount: baseAmount,
    paymentMode: pick(["Cash", "bKash", "Nagad", "Bank"]),
    reference: `REF-${String(int(100000, 999999))}`,
  };
});

// =====================================================================
// Payroll — staff salary
// =====================================================================

export type SalaryStatus = "Paid" | "Pending" | "Hold";

export interface PayrollRow {
  id: string;
  staffId: string;
  staffName: string;
  designation: string;
  basic: number;
  allowance: number;
  deduction: number;
  net: number;
  month: string; // YYYY-MM
  status: SalaryStatus;
  paidOn?: string;
}

const CURRENT_MONTH = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

export const PAYROLL: PayrollRow[] = TEACHERS.map((t, i) => {
  const basic = 18000 + int(0, 18) * 1000;
  const allowance = int(2000, 8000);
  const deduction = int(500, 2500);
  const net = basic + allowance - deduction;
  const statusOpts: SalaryStatus[] = i < 18 ? ["Paid"] : i < 22 ? ["Pending"] : ["Hold"];
  return {
    id: `PAY-${String(13001 + i)}`,
    staffId: t.id,
    staffName: t.name,
    designation: t.designation,
    basic,
    allowance,
    deduction,
    net,
    month: CURRENT_MONTH,
    status: statusOpts[0]!,
    paidOn: statusOpts[0] === "Paid" ? offset(-int(1, 5)) : undefined,
  };
});

// =====================================================================
// SMS / Messaging — templates + history
// =====================================================================

export type AudienceType =
  | "All"
  | "Students"
  | "Guardians"
  | "Teachers"
  | "Class";

export interface SmsTemplate {
  id: string;
  name: string;
  body: string; // supports {{name}}, {{class}} etc.
  audience: AudienceType;
}

export const SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: "TPL-001",
    name: "Fee Due Reminder",
    audience: "Guardians",
    body:
      "Dear {{guardian}}, this is a reminder that {{name}}'s monthly tuition fee is due. Please pay by 10th. — Bangladesh Model High School",
  },
  {
    id: "TPL-002",
    name: "Absent Notification",
    audience: "Guardians",
    body:
      "Dear Guardian, your child {{name}} ({{class}}-{{section}}) was absent from school today {{date}}. — BD Model High School",
  },
  {
    id: "TPL-003",
    name: "Result Published",
    audience: "Guardians",
    body:
      "Dear Guardian, the {{exam}} result of {{name}} has been published. GPA: {{gpa}}. Login to portal for details.",
  },
  {
    id: "TPL-004",
    name: "School Closed",
    audience: "All",
    body:
      "School will remain closed on {{date}} due to {{reason}}. Classes will resume next working day.",
  },
  {
    id: "TPL-005",
    name: "PTM Invitation",
    audience: "Guardians",
    body:
      "You are invited to the Parent-Teacher Meeting on {{date}} at {{time}}. Class: {{class}}. — Head Teacher",
  },
];

export interface SmsLog {
  id: string;
  templateName: string;
  audience: AudienceType;
  recipients: number;
  sentAt: string;
  status: "Delivered" | "Queued" | "Failed";
  preview: string;
}

export const SMS_LOGS: SmsLog[] = [
  {
    id: "SMS-001",
    templateName: "Fee Due Reminder",
    audience: "Guardians",
    recipients: 47,
    sentAt: offset(-1) + "T10:30",
    status: "Delivered",
    preview:
      "Dear Guardian, this is a reminder that monthly tuition fee is due...",
  },
  {
    id: "SMS-002",
    templateName: "Absent Notification",
    audience: "Guardians",
    recipients: 12,
    sentAt: offset(0) + "T09:15",
    status: "Delivered",
    preview: "Your child was absent from school today...",
  },
  {
    id: "SMS-003",
    templateName: "PTM Invitation",
    audience: "Guardians",
    recipients: 240,
    sentAt: offset(-3) + "T14:00",
    status: "Delivered",
    preview: "Parent-Teacher Meeting on next Saturday...",
  },
  {
    id: "SMS-004",
    templateName: "School Closed",
    audience: "All",
    recipients: 380,
    sentAt: offset(-7) + "T08:00",
    status: "Delivered",
    preview: "School will remain closed on Friday due to bad weather...",
  },
  {
    id: "SMS-005",
    templateName: "Custom Notice",
    audience: "Teachers",
    recipients: 24,
    sentAt: offset(0) + "T11:45",
    status: "Queued",
    preview: "Coordination meeting at 2:00 PM in conference room.",
  },
];

// =====================================================================
// Calendar — academic year events
// =====================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "Holiday" | "Exam" | "Sports" | "Cultural" | "Meeting" | "Admission";
  description?: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  // upcoming
  { id: "CE-001", title: "Mid-term Exam — Class 6-10", date: offset(2), type: "Exam" },
  { id: "CE-002", title: "Inter-section Football", date: offset(5), type: "Sports" },
  { id: "CE-003", title: "Annual Cultural Programme", date: offset(8), type: "Cultural" },
  { id: "CE-004", title: "Pohela Boishakh", date: offset(14), type: "Cultural" },
  { id: "CE-005", title: "May Day Holiday", date: offset(18), type: "Holiday" },
  { id: "CE-006", title: "Admission for KG 2027", date: offset(25), type: "Admission" },
  { id: "CE-007", title: "Quarterly PTM", date: offset(11), type: "Meeting" },
  // past
  { id: "CE-101", title: "Independence Day", date: offset(-32), type: "Holiday" },
  { id: "CE-102", title: "Annual Sports Day", date: offset(-2), type: "Sports" },
  { id: "CE-103", title: "Bangla New Year Rally", date: offset(-25), type: "Cultural" },
];

// =====================================================================
// Gallery / Achievements
// =====================================================================

export interface GalleryAlbum {
  id: string;
  title: string;
  category: "Sports" | "Cultural" | "Academic" | "Field Trip";
  date: string;
  cover: string; // gradient/illustration name
  count: number;
}

export const GALLERY: GalleryAlbum[] = [
  { id: "GAL-01", title: "Annual Sports Day 2025", category: "Sports", date: offset(-12), cover: "from-indigo-500 to-violet-600", count: 48 },
  { id: "GAL-02", title: "21st February Programme", category: "Cultural", date: offset(-60), cover: "from-rose-500 to-orange-500", count: 32 },
  { id: "GAL-03", title: "National Science Fair", category: "Academic", date: offset(-45), cover: "from-emerald-500 to-teal-600", count: 28 },
  { id: "GAL-04", title: "Cox's Bazar Field Trip", category: "Field Trip", date: offset(-90), cover: "from-amber-500 to-pink-500", count: 64 },
  { id: "GAL-05", title: "Inter-school Math Olympiad", category: "Academic", date: offset(-30), cover: "from-sky-500 to-blue-600", count: 18 },
  { id: "GAL-06", title: "Pohela Boishakh Rally", category: "Cultural", date: offset(-25), cover: "from-rose-400 to-red-600", count: 41 },
];

export interface Achievement {
  id: string;
  title: string;
  studentName: string;
  className: string;
  category: "Academic" | "Sports" | "Cultural";
  rank: string;
  date: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "ACH-01", title: "1st in Inter-school Math Olympiad (Dhaka Division)", studentName: "Rakib Hossain", className: "10", category: "Academic", rank: "1st", date: offset(-30) },
  { id: "ACH-02", title: "Champion — Inter-section Football", studentName: "Tanvir Khan", className: "9", category: "Sports", rank: "Captain", date: offset(-12) },
  { id: "ACH-03", title: "Best Recitation — 21st February", studentName: "Sumaiya Akter", className: "8", category: "Cultural", rank: "1st", date: offset(-60) },
  { id: "ACH-04", title: "Runner-up — National Science Fair", studentName: "Imran Ahmed", className: "9", category: "Academic", rank: "2nd", date: offset(-45) },
  { id: "ACH-05", title: "Best Speaker — Bangla Debate", studentName: "Tahmina Sultana", className: "10", category: "Cultural", rank: "1st", date: offset(-20) },
];

// =====================================================================
// HR / Leave
// =====================================================================

export type LeaveType = "Casual" | "Sick" | "Earned" | "Maternity" | "Study";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  designation: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export const LEAVE_REQUESTS: LeaveRequest[] = TEACHERS.slice(0, 12).map(
  (t, i) => {
    const from = -int(0, 30);
    const days = int(1, 5);
    const types: LeaveType[] = ["Casual", "Sick", "Earned", "Maternity", "Study"];
    const statuses: LeaveStatus[] = i < 5 ? ["Approved"] : i < 9 ? ["Pending"] : ["Rejected"];
    return {
      id: `LV-${String(14001 + i)}`,
      staffId: t.id,
      staffName: t.name,
      designation: t.designation,
      type: types[i % types.length]!,
      fromDate: offset(from),
      toDate: offset(from + days - 1),
      days,
      reason:
        i % 3 === 0
          ? "Personal family matter"
          : i % 3 === 1
            ? "Medical appointment / sickness"
            : "Higher education preparation",
      status: statuses[0]!,
      appliedOn: offset(from - 2),
    };
  },
);

// =====================================================================
// Online Exam
// =====================================================================

export interface OnlineExam {
  id: string;
  title: string;
  className: string;
  subject: string;
  duration: number; // minutes
  totalQuestions: number;
  totalMarks: number;
  scheduledOn: string;
  status: "Draft" | "Published" | "Live" | "Ended";
  attempts: number;
  passRate: number; // 0-100
}

export const ONLINE_EXAMS: OnlineExam[] = [
  { id: "OEX-01", title: "Class 9 — Math Chapter 1 Quiz", className: "9", subject: "Mathematics", duration: 30, totalQuestions: 20, totalMarks: 20, scheduledOn: offset(2), status: "Published", attempts: 0, passRate: 0 },
  { id: "OEX-02", title: "Class 8 — Science Pre-test", className: "8", subject: "General Science", duration: 45, totalQuestions: 30, totalMarks: 30, scheduledOn: offset(-2), status: "Ended", attempts: 92, passRate: 78 },
  { id: "OEX-03", title: "Class 10 — English Mock", className: "10", subject: "English", duration: 60, totalQuestions: 50, totalMarks: 100, scheduledOn: offset(0), status: "Live", attempts: 18, passRate: 0 },
  { id: "OEX-04", title: "Class 7 — Bangla Vocab", className: "7", subject: "Bangla 1st Paper", duration: 20, totalQuestions: 25, totalMarks: 25, scheduledOn: offset(-7), status: "Ended", attempts: 84, passRate: 91 },
  { id: "OEX-05", title: "Class 6 — ICT Basics", className: "6", subject: "ICT", duration: 25, totalQuestions: 20, totalMarks: 20, scheduledOn: offset(5), status: "Draft", attempts: 0, passRate: 0 },
];

// =====================================================================
// Parent Portal / Student detail extras
// =====================================================================

export interface DiaryEntry {
  id: string;
  date: string;
  subject: string;
  note: string;
  teacher: string;
}

export const DIARY_FOR_STUDENT_1000: DiaryEntry[] = [
  { id: "DR-1", date: offset(-1), subject: "Mathematics", note: "Excellent progress in Algebra exercise.", teacher: "Mrs. Shamima Khan" },
  { id: "DR-2", date: offset(-2), subject: "English", note: "Bring vocabulary notebook tomorrow.", teacher: "Mr. Tariqul Islam" },
  { id: "DR-3", date: offset(-3), subject: "Bangla", note: "Recitation practice — 'Banglar Mukh ami dekhiyachi'.", teacher: "Mr. Faruk Hossain" },
  { id: "DR-4", date: offset(-5), subject: "ICT", note: "Submit lab report before Wednesday.", teacher: "Mrs. Salma Begum" },
];

export const FEE_HISTORY_FOR_STUDENT = [
  { month: "Jul 2025", amount: 2500, paid: true, method: "bKash", date: offset(-180) },
  { month: "Aug 2025", amount: 2500, paid: true, method: "Nagad", date: offset(-150) },
  { month: "Sep 2025", amount: 2500, paid: true, method: "Cash", date: offset(-120) },
  { month: "Oct 2025", amount: 2500, paid: true, method: "bKash", date: offset(-90) },
  { month: "Nov 2025", amount: 2500, paid: true, method: "bKash", date: offset(-60) },
  { month: "Dec 2025", amount: 2500, paid: true, method: "bKash", date: offset(-30) },
  { month: "Jan 2026", amount: 2500, paid: false, method: "—", date: "" },
];

// =====================================================================
// Notifications (top-bar dropdown)
// =====================================================================

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: "fee" | "exam" | "attendance" | "system" | "notice";
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "N-001",
    title: "5 new admission applications",
    body: "Pending review for Class 6 (3) and Class 1 (2).",
    category: "system",
    time: "2m ago",
    unread: true,
  },
  {
    id: "N-002",
    title: "Today's attendance — 91%",
    body: "73 of 80 students present. 3 late, 4 absent.",
    category: "attendance",
    time: "1h ago",
    unread: true,
  },
  {
    id: "N-003",
    title: "Fees collected ৳ 12,500",
    body: "5 transactions in the last hour via bKash.",
    category: "fee",
    time: "2h ago",
    unread: true,
  },
  {
    id: "N-004",
    title: "Mid-term exam published",
    body: "Class 6-10 routine published. Notify guardians.",
    category: "exam",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "N-005",
    title: "Library overdue books — 3",
    body: "Send reminder SMS to borrowers with fines.",
    category: "system",
    time: "2 days ago",
    unread: false,
  },
];
