"use client";

import { useMemo, useState } from "react";
import {
  GraduationCapIcon,
  IdCardIcon,
  PrinterIcon,
  UserSquare2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { STUDENTS } from "@/lib/mock-data/reports";
import { SCHOOL_INFO } from "@/lib/mock-data/reports";

function StudentIDCard({
  student,
}: {
  student: (typeof STUDENTS)[number];
}) {
  return (
    <div className="aspect-[1.6/1] w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="bg-bd-gradient flex items-center justify-between px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-white/15">
            <GraduationCapIcon className="size-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-wider opacity-80">
              {SCHOOL_INFO.eiin}
            </div>
            <div className="text-[11px] font-semibold">
              {SCHOOL_INFO.name}
            </div>
          </div>
        </div>
        <Badge variant="muted">STUDENT</Badge>
      </div>
      <div className="flex gap-3 p-3">
        <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <UserSquare2Icon className="size-10" />
        </div>
        <div className="min-w-0 flex-1 space-y-1 text-[11px]">
          <div>
            <div className="text-[9px] uppercase text-muted-foreground">
              Name
            </div>
            <div className="truncate text-sm font-semibold">
              {student.name}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">
                ID
              </div>
              <div className="font-mono">{student.id}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">
                Class
              </div>
              <div>
                {student.className} ({student.section})
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">
                Guardian
              </div>
              <div className="truncate">{student.guardian}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase text-muted-foreground">
                Phone
              </div>
              <div className="font-mono text-[10px]">{student.phone}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-3 py-1.5 text-[9px] text-muted-foreground">
        <span>Valid till: Dec 2026</span>
        <span>Head Teacher</span>
      </div>
    </div>
  );
}

export default function IdCardsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      if (classFilter !== "All" && s.className !== classFilter) return false;
      if (
        search &&
        !`${s.name} ${s.id}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    }).slice(0, 12);
  }, [search, classFilter]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="ID & Admit Card Generator"
        description="পরিচয়পত্র — bulk-print student ID cards and exam admit cards."
        actions={
          <Button>
            <PrinterIcon /> Print Selected
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Students"
          value={String(STUDENTS.length)}
          icon={IdCardIcon}
          tone="indigo"
        />
        <KpiTile
          label="ID Cards Issued"
          value={String(STUDENTS.length - 4)}
          delta="4 pending"
          icon={IdCardIcon}
          tone="emerald"
        />
        <KpiTile
          label="Admit Cards Ready"
          value="62"
          delta="Mid-term 2026"
          icon={GraduationCapIcon}
          tone="violet"
        />
        <KpiTile
          label="Templates"
          value="3"
          delta="Student · Staff · Admit"
          icon={IdCardIcon}
          tone="rose"
        />
      </section>

      <Tabs defaultValue="ids">
        <TabsList>
          <TabsTrigger value="ids">Student ID Cards</TabsTrigger>
          <TabsTrigger value="admits">Admit Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="ids" className="mt-4">
          <SectionCard title="Generate Student ID Cards">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Search student…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Select
                value={classFilter}
                onValueChange={(v) => setClassFilter(v ?? "All")}
              >
                <SelectTrigger className="sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All classes</SelectItem>
                  {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <StudentIDCard key={s.id} student={s} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  No students match these filters.
                </div>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="admits" className="mt-4">
          <SectionCard
            title="Mid-term 2026 Admit Cards"
            description="Sample card preview"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {STUDENTS.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border bg-bd-soft p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-bd-gradient flex size-9 items-center justify-center rounded-xl text-white shadow-sm">
                      <IdCardIcon className="size-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Admit Card · Mid-term 2026
                      </div>
                      <div className="text-sm font-semibold">
                        {SCHOOL_INFO.name}
                      </div>
                    </div>
                  </div>
                  <div className="my-3 h-px bg-border" />
                  <dl className="grid grid-cols-2 gap-y-1 text-xs">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{s.name}</dd>
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="font-mono">{s.id}</dd>
                    <dt className="text-muted-foreground">Class</dt>
                    <dd>
                      {s.className} ({s.section})
                    </dd>
                    <dt className="text-muted-foreground">Exam centre</dt>
                    <dd>Main Hall A</dd>
                  </dl>
                  <div className="mt-3 rounded-lg border border-dashed p-2 text-center text-[11px] text-muted-foreground">
                    Carry this admit card to the exam venue.
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
