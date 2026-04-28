"use client";

import { useMemo, useState } from "react";
import { LayersIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import {
  CLASS_OPTIONS,
  SECTION_OPTIONS,
  STUDENTS,
  TEACHERS,
} from "@/lib/mock-data/reports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassCell {
  classNum: string;
  section: string;
  count: number;
  males: number;
  females: number;
  classTeacher: string;
}

export default function ClassesPage() {
  const [classFilter, setClassFilter] = useState<string>("all");

  const grid = useMemo<ClassCell[]>(() => {
    const teachers = TEACHERS;
    return CLASS_OPTIONS.flatMap((c, ci) =>
      SECTION_OPTIONS.map((s, si) => {
        const studentsInCell = STUDENTS.filter(
          (st) => st.className === c.value && st.section === s.value,
        );
        const males = studentsInCell.filter((st) => st.gender === "Male").length;
        const teacherIdx = (ci * 3 + si) % teachers.length;
        return {
          classNum: c.value,
          section: s.value,
          count: studentsInCell.length,
          males,
          females: studentsInCell.length - males,
          classTeacher: teachers[teacherIdx]?.name ?? "—",
        };
      }),
    );
  }, []);

  const filtered = useMemo(
    () =>
      grid.filter((g) => classFilter === "all" || g.classNum === classFilter),
    [grid, classFilter],
  );

  const totalSections = filtered.length;
  const totalStudents = filtered.reduce((acc, g) => acc + g.count, 0);
  const avgPerSection = totalSections
    ? Math.round(totalStudents / totalSections)
    : 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeader
        title="Classes & Sections"
        description="Class-wise section grid showing roll, gender split and class teacher."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Total Classes"
          value={String(CLASS_OPTIONS.length)}
          icon={LayersIcon}
          tone="indigo"
        />
        <StatTile
          label="Sections"
          value={String(totalSections)}
          delta="3 sections per class (A, B, C)"
          icon={LayersIcon}
          tone="violet"
        />
        <StatTile
          label="Avg Students per Section"
          value={String(avgPerSection)}
          delta={`${totalStudents} students total`}
          icon={UsersIcon}
          tone="emerald"
        />
      </section>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Class
          </span>
          <Select
            value={classFilter}
            onValueChange={(v) => setClassFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {CLASS_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {classFilter !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClassFilter("all")}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cell) => (
          <article
            key={`${cell.classNum}-${cell.section}`}
            className="rounded-2xl border bg-card p-4 transition hover:border-indigo-200 hover:shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Class {cell.classNum}
                </div>
                <div className="text-lg font-semibold">
                  Section {cell.section}
                </div>
              </div>
              <div className="rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-700">
                {cell.count}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-sky-50 px-2 py-1.5">
                <div className="text-[10px] uppercase text-sky-700">Male</div>
                <div className="font-semibold text-sky-900">{cell.males}</div>
              </div>
              <div className="rounded-lg bg-rose-50 px-2 py-1.5">
                <div className="text-[10px] uppercase text-rose-700">
                  Female
                </div>
                <div className="font-semibold text-rose-900">
                  {cell.females}
                </div>
              </div>
            </div>

            <div className="mt-3 border-t pt-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Class Teacher
              </div>
              <div className="mt-0.5 truncate text-sm font-medium">
                {cell.classTeacher}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
