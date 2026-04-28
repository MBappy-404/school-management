"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AwardIcon,
  BellIcon,
  BookOpenIcon,
  BookTextIcon,
  BuildingIcon,
  BusIcon,
  CalendarCheckIcon,
  CalendarIcon,
  CalculatorIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileBadgeIcon,
  GraduationCapIcon,
  HomeIcon,
  IdCardIcon,
  ImageIcon,
  LayersIcon,
  LibraryBigIcon,
  MessageSquareIcon,
  NotebookPenIcon,
  PackageIcon,
  PieChartIcon,
  PlaneIcon,
  ScrollTextIcon,
  SettingsIcon,
  TableIcon,
  UserCheckIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavSection {
  label: string;
  bangla?: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  bangla?: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    bangla: "ড্যাশবোর্ড",
    items: [
      { href: "/", label: "Dashboard", bangla: "হোম", icon: HomeIcon },
      {
        href: "/calendar",
        label: "Academic Calendar",
        bangla: "ক্যালেন্ডার",
        icon: CalendarIcon,
      },
    ],
  },
  {
    label: "Academic",
    bangla: "একাডেমিক",
    items: [
      {
        href: "/admissions",
        label: "Admissions",
        bangla: "ভর্তি",
        icon: FileBadgeIcon,
        badge: "5",
      },
      { href: "/students", label: "Students", bangla: "শিক্ষার্থী", icon: UsersIcon },
      {
        href: "/teachers",
        label: "Teachers",
        bangla: "শিক্ষকবৃন্দ",
        icon: GraduationCapIcon,
      },
      {
        href: "/classes",
        label: "Classes & Sections",
        bangla: "শ্রেণি ও শাখা",
        icon: LayersIcon,
      },
      {
        href: "/routine",
        label: "Class Routine",
        bangla: "ক্লাস রুটিন",
        icon: TableIcon,
      },
      {
        href: "/subjects",
        label: "Subjects & Syllabus",
        bangla: "বিষয় ও সিলেবাস",
        icon: BookOpenIcon,
      },
      {
        href: "/homework",
        label: "Homework",
        bangla: "বাড়ির কাজ",
        icon: NotebookPenIcon,
      },
    ],
  },
  {
    label: "Examinations",
    bangla: "পরীক্ষা",
    items: [
      {
        href: "/exams",
        label: "Exams & Results",
        bangla: "পরীক্ষা",
        icon: ClipboardListIcon,
      },
      {
        href: "/online-exams",
        label: "Online Exams",
        bangla: "অনলাইন পরীক্ষা",
        icon: ScrollTextIcon,
      },
      {
        href: "/id-cards",
        label: "ID & Admit Cards",
        bangla: "আইডি কার্ড",
        icon: IdCardIcon,
      },
    ],
  },
  {
    label: "Operations",
    bangla: "অপারেশন",
    items: [
      {
        href: "/attendance",
        label: "Attendance",
        bangla: "উপস্থিতি",
        icon: CalendarCheckIcon,
      },
      {
        href: "/library",
        label: "Library",
        bangla: "লাইব্রেরি",
        icon: LibraryBigIcon,
      },
      {
        href: "/transport",
        label: "Transport",
        bangla: "পরিবহন",
        icon: BusIcon,
      },
      {
        href: "/hostel",
        label: "Hostel",
        bangla: "ছাত্রাবাস",
        icon: BuildingIcon,
      },
      {
        href: "/inventory",
        label: "Inventory",
        bangla: "মজুদ",
        icon: PackageIcon,
      },
    ],
  },
  {
    label: "Finance",
    bangla: "আর্থিক",
    items: [
      { href: "/fees", label: "Fees", bangla: "ফি", icon: WalletIcon },
      {
        href: "/accounting",
        label: "Accounting",
        bangla: "হিসাব",
        icon: CalculatorIcon,
      },
      {
        href: "/payroll",
        label: "Payroll",
        bangla: "বেতন",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    label: "HR & Communication",
    bangla: "এইচআর ও যোগাযোগ",
    items: [
      {
        href: "/leave",
        label: "HR / Leave",
        bangla: "ছুটি",
        icon: PlaneIcon,
      },
      {
        href: "/messaging",
        label: "SMS Center",
        bangla: "এসএমএস",
        icon: MessageSquareIcon,
      },
      {
        href: "/notices",
        label: "Notices",
        bangla: "নোটিশ",
        icon: BellIcon,
      },
      {
        href: "/gallery",
        label: "Gallery & Awards",
        bangla: "গ্যালারি",
        icon: ImageIcon,
      },
    ],
  },
  {
    label: "Insights",
    bangla: "প্রতিবেদন",
    items: [
      {
        href: "/reports",
        label: "Reports",
        bangla: "রিপোর্ট",
        icon: PieChartIcon,
      },
      {
        href: "/portal",
        label: "Parent Portal",
        bangla: "অভিভাবক",
        icon: UserCheckIcon,
      },
    ],
  },
  {
    label: "System",
    bangla: "সিস্টেম",
    items: [
      {
        href: "/settings",
        label: "Settings",
        bangla: "সেটিংস",
        icon: SettingsIcon,
      },
    ],
  },
];

// Surface a flat list for the command palette
export const NAV_FLAT = NAV_SECTIONS.flatMap((s) => s.items);

// Avoid unused-import warning for icons referenced only by type
void BookTextIcon;
void AwardIcon;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-4 px-3 py-3">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
              {section.label}
            </span>
            {section.bangla && (
              <span className="font-bangla text-[10px] text-muted-foreground/60">
                {section.bangla}
              </span>
            )}
          </div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-all",
                  "hover:bg-muted hover:text-foreground",
                  isActive &&
                    "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200",
                )}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                )}
                <Icon
                  className={cn(
                    "size-4 text-muted-foreground transition-colors group-hover:text-foreground",
                    isActive && "text-indigo-600 dark:text-indigo-300",
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
