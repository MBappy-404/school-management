"use client";

import { useMemo, useState } from "react";
import {
  CheckIcon,
  EyeIcon,
  FileBadgeIcon,
  FilterIcon,
  PrinterIcon,
  SearchIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  ADMISSIONS,
  type Admission,
  type AdmissionStatus,
} from "@/lib/mock-data/extended";
import { SCHOOL_INFO } from "@/lib/mock-data/reports";

const STATUS_VARIANT: Record<
  AdmissionStatus,
  "success" | "warning" | "info" | "danger"
> = {
  Approved: "success",
  Pending: "warning",
  Reviewing: "info",
  Rejected: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdmissionsPage() {
  const [rows, setRows] = useState<Admission[]>(ADMISSIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [classFilter, setClassFilter] = useState<string>("All");
  const [preview, setPreview] = useState<Admission | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (classFilter !== "All" && r.appliedClass !== classFilter) return false;
      if (
        search &&
        !`${r.applicantName} ${r.guardianName} ${r.id}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [rows, search, statusFilter, classFilter]);

  const counts = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter(
      (r) => r.status === "Pending" || r.status === "Reviewing",
    ).length;
    const approved = rows.filter((r) => r.status === "Approved").length;
    const rejected = rows.filter((r) => r.status === "Rejected").length;
    const avgScore =
      Math.round(rows.reduce((s, r) => s + r.score, 0) / total) || 0;
    return { total, pending, approved, rejected, avgScore };
  }, [rows]);

  function update(id: string, status: AdmissionStatus) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast.success(`Application ${status.toLowerCase()}`, {
      description: `${id} marked as ${status}.`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admissions"
        description="ভর্তি — applicant queue, screening scores and admission decisions."
        actions={
          <>
            <Button variant="outline">
              <PrinterIcon /> Print Queue
            </Button>
            <Button>
              <UserPlusIcon /> New Application
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Applications"
          bilingualLabel="মোট আবেদন"
          value={String(counts.total)}
          icon={FileBadgeIcon}
          tone="indigo"
        />
        <KpiTile
          label="Pending Review"
          bilingualLabel="অপেক্ষমাণ"
          value={String(counts.pending)}
          delta="awaiting decision"
          icon={FilterIcon}
          tone="amber"
        />
        <KpiTile
          label="Approved"
          bilingualLabel="অনুমোদিত"
          value={String(counts.approved)}
          delta={`${Math.round((counts.approved / counts.total) * 100)}% acceptance`}
          icon={CheckIcon}
          tone="emerald"
        />
        <KpiTile
          label="Avg Test Score"
          bilingualLabel="গড় স্কোর"
          value={`${counts.avgScore} / 100`}
          icon={EyeIcon}
          tone="sky"
        />
      </section>

      <SectionCard
        title="Applicant Queue"
        description="Filter, review and approve / reject pending applications."
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by applicant, guardian or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "All")}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">ID</th>
                <th className="px-3 py-2.5">Applicant</th>
                <th className="px-3 py-2.5">Class</th>
                <th className="px-3 py-2.5">Guardian / Phone</th>
                <th className="px-3 py-2.5">Applied</th>
                <th className="px-3 py-2.5">Score</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.applicantName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.gender} · {r.previousSchool}
                    </div>
                  </td>
                  <td className="px-3 py-2">Class {r.appliedClass}</td>
                  <td className="px-3 py-2">
                    <div>{r.guardianName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.phone}
                    </div>
                  </td>
                  <td className="px-3 py-2">{formatDate(r.appliedOn)}</td>
                  <td className="px-3 py-2 tabular">
                    <span
                      className={
                        r.score >= 80
                          ? "text-emerald-600"
                          : r.score >= 60
                            ? "text-amber-600"
                            : "text-rose-600"
                      }
                    >
                      {r.score}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Preview"
                        onClick={() => setPreview(r)}
                      >
                        <EyeIcon />
                      </Button>
                      {r.status !== "Approved" && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Approve"
                          onClick={() => update(r.id, "Approved")}
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10"
                        >
                          <CheckIcon />
                        </Button>
                      )}
                      {r.status !== "Rejected" && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Reject"
                          onClick={() => update(r.id, "Rejected")}
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10"
                        >
                          <XIcon />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No applications match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog
        open={preview !== null}
        onOpenChange={(o) => !o && setPreview(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admit Card Preview</DialogTitle>
            <DialogDescription>
              {preview ? `${preview.applicantName} · ${preview.id}` : ""}
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="rounded-2xl border bg-bd-soft p-4">
              <div className="flex items-center gap-3">
                <div className="bg-bd-gradient flex size-12 items-center justify-center rounded-xl text-white shadow-sm">
                  <FileBadgeIcon className="size-6" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {SCHOOL_INFO.eiin}
                  </div>
                  <div className="text-sm font-semibold">
                    {SCHOOL_INFO.name}
                  </div>
                  <div className="font-bangla text-[11px] text-muted-foreground">
                    বাংলাদেশ মডেল হাই স্কুল
                  </div>
                </div>
              </div>
              <div className="my-3 h-px bg-border" />
              <dl className="grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-muted-foreground">Application ID</dt>
                <dd className="font-mono">{preview.id}</dd>
                <dt className="text-muted-foreground">Applicant</dt>
                <dd className="font-medium">{preview.applicantName}</dd>
                <dt className="text-muted-foreground">Class applied</dt>
                <dd>Class {preview.appliedClass}</dd>
                <dt className="text-muted-foreground">Date of birth</dt>
                <dd>{formatDate(preview.dob)}</dd>
                <dt className="text-muted-foreground">Guardian</dt>
                <dd>{preview.guardianName}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{preview.phone}</dd>
                <dt className="text-muted-foreground">Test score</dt>
                <dd className="tabular">{preview.score} / 100</dd>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge variant={STATUS_VARIANT[preview.status]}>
                    {preview.status}
                  </Badge>
                </dd>
              </dl>
              <div className="mt-4 rounded-lg border border-dashed p-3 text-center text-[11px] text-muted-foreground">
                Examination Hall · Seat assigned on confirmation.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button onClick={() => toast.message("Admit card downloaded (demo)")}>
              <PrinterIcon /> Print Admit Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
