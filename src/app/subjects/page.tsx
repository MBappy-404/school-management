"use client";

import { useMemo, useState } from "react";
import {
  BookOpenIcon,
  GraduationCapIcon,
  ListChecksIcon,
  StarIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { SUBJECTS } from "@/lib/mock-data/extended";

export default function SubjectsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = useMemo(() => {
    return SUBJECTS.filter((s) => {
      if (classFilter !== "All" && !s.classes.includes(classFilter))
        return false;
      if (typeFilter !== "All" && s.type !== typeFilter) return false;
      if (
        search &&
        !`${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, classFilter, typeFilter]);

  const compulsory = SUBJECTS.filter((s) => s.type === "Compulsory").length;
  const optional = SUBJECTS.filter((s) => s.type === "Optional").length;
  const totalMarks = SUBJECTS.reduce((s, x) => s + x.fullMarks, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subjects & Syllabus"
        description="বিষয় ও সিলেবাস — NCTB-aligned subject catalogue with mark distribution."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Subjects"
          bilingualLabel="মোট বিষয়"
          value={String(SUBJECTS.length)}
          icon={BookOpenIcon}
          tone="indigo"
        />
        <KpiTile
          label="Compulsory"
          bilingualLabel="আবশ্যিক"
          value={String(compulsory)}
          icon={ListChecksIcon}
          tone="emerald"
        />
        <KpiTile
          label="Optional"
          bilingualLabel="ঐচ্ছিক"
          value={String(optional)}
          icon={StarIcon}
          tone="violet"
        />
        <KpiTile
          label="Total Full Marks"
          value={String(totalMarks)}
          icon={GraduationCapIcon}
          tone="rose"
        />
      </section>

      <SectionCard
        title="Subject Catalogue"
        description="Filter by class or type. Click a row to view syllabus outline."
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search subject or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={classFilter} onValueChange={(v) => setClassFilter(v ?? "All")}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All classes</SelectItem>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "All")}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All types</SelectItem>
              <SelectItem value="Compulsory">Compulsory</SelectItem>
              <SelectItem value="Optional">Optional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="group rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {s.code}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">{s.name}</div>
                </div>
                <Badge variant={s.type === "Compulsory" ? "info" : "violet"}>
                  {s.type}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {s.classes.map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    Class {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                {s.syllabusOutline}
              </p>
              <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px]">
                <span className="text-muted-foreground">
                  Full <span className="tabular font-semibold text-foreground">
                    {s.fullMarks}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Pass <span className="tabular font-semibold text-foreground">
                    {s.passMarks}
                  </span>
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No subjects match these filters.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
