import Link from "next/link";
import { GraduationCapIcon } from "lucide-react";

import { SCHOOL_INFO } from "@/lib/mock-data/reports";

export function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 px-4 py-4 transition-opacity hover:opacity-80"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
        <GraduationCapIcon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold leading-tight">
          {SCHOOL_INFO.name}
        </div>
        <div className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {SCHOOL_INFO.eiin}
        </div>
      </div>
    </Link>
  );
}
