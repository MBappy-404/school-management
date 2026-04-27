"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  HomeIcon,
  LayersIcon,
  PieChartIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavSection {
  label: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: HomeIcon }],
  },
  {
    label: "People",
    items: [
      { href: "/students", label: "Students", icon: UsersIcon },
      { href: "/teachers", label: "Teachers", icon: GraduationCapIcon },
      { href: "/classes", label: "Classes & Sections", icon: LayersIcon },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/fees", label: "Fees", icon: WalletIcon },
      { href: "/attendance", label: "Attendance", icon: CalendarCheckIcon },
      { href: "/exams", label: "Exams", icon: ClipboardListIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/notices", label: "Notices", icon: BellIcon },
      { href: "/reports", label: "Reports", icon: PieChartIcon },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings", icon: SettingsIcon }],
  },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-5 px-3 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
            {section.label}
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
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  isActive &&
                    "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 text-muted-foreground transition-colors group-hover:text-foreground",
                    isActive && "text-indigo-600 dark:text-indigo-300",
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
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
