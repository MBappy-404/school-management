export interface Notice {
  id: string;
  title: string;
  body: string;
  category: "Academic" | "Event" | "Holiday" | "Exam" | "General";
  audience: "All" | "Students" | "Teachers" | "Guardians";
  publishedAt: string; // ISO date
  pinned: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string; // ISO date
  category: "Exam" | "Holiday" | "Sports" | "Cultural" | "Meeting";
  location?: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const offset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const NOTICES: Notice[] = [
  {
    id: "NTC-001",
    title: "Annual Sports Day — 12 May",
    body: "All students must report by 8:00 AM in sports uniform. Guardians are welcome to attend the inaugural ceremony.",
    category: "Event",
    audience: "All",
    publishedAt: offset(-2),
    pinned: true,
  },
  {
    id: "NTC-002",
    title: "Mid-term Examination Routine Published",
    body: "The mid-term examination routine for Classes 6–10 is now available on the notice board. Parents are requested to review with their children.",
    category: "Exam",
    audience: "Students",
    publishedAt: offset(-4),
    pinned: true,
  },
  {
    id: "NTC-003",
    title: "Eid-ul-Fitr Holiday Notice",
    body: "The school will remain closed from 8 to 16 April. Classes will resume on 17 April. Wish you all a happy Eid.",
    category: "Holiday",
    audience: "All",
    publishedAt: offset(-7),
    pinned: false,
  },
  {
    id: "NTC-004",
    title: "Bangla Debate Competition — Inter-section Round",
    body: "Interested students of Classes 9–10 should register with their class teacher by next Sunday.",
    category: "Event",
    audience: "Students",
    publishedAt: offset(-10),
    pinned: false,
  },
  {
    id: "NTC-005",
    title: "Teacher Coordination Meeting",
    body: "All subject teachers must attend the coordination meeting on Saturday at 2:00 PM in the conference room.",
    category: "General",
    audience: "Teachers",
    publishedAt: offset(-12),
    pinned: false,
  },
  {
    id: "NTC-006",
    title: "Guardian-Teacher Conference",
    body: "The quarterly guardian-teacher meeting is scheduled for next Thursday, 4:00 PM. Class-wise schedules are posted on the bulletin.",
    category: "Academic",
    audience: "Guardians",
    publishedAt: offset(-15),
    pinned: false,
  },
];

export const EVENTS: SchoolEvent[] = [
  {
    id: "EVT-001",
    title: "Class 10 Math Mid-term",
    date: offset(2),
    category: "Exam",
    location: "Hall A",
  },
  {
    id: "EVT-002",
    title: "Class 9 English Mid-term",
    date: offset(3),
    category: "Exam",
    location: "Hall A",
  },
  {
    id: "EVT-003",
    title: "Inter-section Football Final",
    date: offset(5),
    category: "Sports",
    location: "School Field",
  },
  {
    id: "EVT-004",
    title: "Annual Cultural Programme",
    date: offset(8),
    category: "Cultural",
    location: "Auditorium",
  },
  {
    id: "EVT-005",
    title: "Pohela Boishakh Celebration",
    date: offset(14),
    category: "Cultural",
  },
  {
    id: "EVT-006",
    title: "Staff Meeting",
    date: offset(1),
    category: "Meeting",
    location: "Conference Room",
  },
];

export function todayISO(): string {
  return today();
}
