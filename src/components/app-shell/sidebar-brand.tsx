import Link from "next/link";
import { GraduationCapIcon } from "lucide-react";

import { SCHOOL_INFO } from "@/lib/mock-data/reports";

export function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 border-b px-4 py-3.5 transition-opacity hover:opacity-90"
    >
      <div className="bg-bd-gradient flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/10">
        <GraduationCapIcon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold leading-tight">
          {SCHOOL_INFO.name}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {SCHOOL_INFO.eiin}
          </span>
          <span className="font-bangla text-[10px] text-muted-foreground/70">
            ঢাকা
          </span>
        </div>
      </div>
    </Link>
  );
}
