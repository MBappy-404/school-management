"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

const LABEL_OVERRIDES: Record<string, string> = {
  "": "Dashboard",
  students: "Students",
  teachers: "Teachers",
  classes: "Classes & Sections",
  fees: "Fees",
  attendance: "Attendance",
  exams: "Exams",
  notices: "Notices",
  reports: "Reports",
  settings: "Settings",
  admissions: "Admissions",
  routine: "Class Routine",
  subjects: "Subjects & Syllabus",
  homework: "Homework",
  library: "Library",
  transport: "Transport",
  hostel: "Hostel",
  accounting: "Accounting",
  payroll: "Payroll",
  inventory: "Inventory",
  messaging: "SMS Center",
  calendar: "Academic Calendar",
  gallery: "Gallery & Achievements",
  "id-cards": "ID & Admit Cards",
  leave: "HR / Leave",
  "online-exams": "Online Exams",
  portal: "Parent Portal",
};

function pretty(seg: string): string {
  if (seg in LABEL_OVERRIDES) return LABEL_OVERRIDES[seg]!;
  return seg
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted hover:text-foreground"
      >
        <HomeIcon className="size-3" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {parts.map((seg, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/");
        const isLast = i === parts.length - 1;
        return (
          <Fragment key={href}>
            <ChevronRightIcon className="size-3 text-muted-foreground/60" />
            {isLast ? (
              <span className="rounded-md px-1.5 py-1 font-medium text-foreground">
                {pretty(seg)}
              </span>
            ) : (
              <Link
                href={href}
                className="rounded-md px-1.5 py-1 hover:bg-muted hover:text-foreground"
              >
                {pretty(seg)}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
