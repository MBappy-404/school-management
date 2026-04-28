"use client";

import { useState } from "react";
import {
  AlertTriangleIcon,
  BookCheckIcon,
  BookOpenIcon,
  HandCoinsIcon,
  LibraryBigIcon,
  PlusIcon,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  BOOKS,
  BOOK_ISSUES,
  type Book,
  type BookIssue,
} from "@/lib/mock-data/extended";
import { formatBDT } from "@/lib/utils/bdt";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const TODAY = new Date().toISOString().slice(0, 10);

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const totalCopies = BOOKS.reduce((s, b) => s + b.copies, 0);
  const availableCopies = BOOKS.reduce((s, b) => s + b.available, 0);
  const issued = BOOK_ISSUES.filter((b) => !b.returned).length;
  const overdue = BOOK_ISSUES.filter(
    (b) => !b.returned && b.dueDate < TODAY,
  ).length;
  const totalFines = BOOK_ISSUES.reduce((s, b) => s + b.fine, 0);

  const filtered: Book[] = BOOKS.filter((b) => {
    if (catFilter !== "All" && b.category !== catFilter) return false;
    if (
      search &&
      !`${b.title} ${b.author} ${b.isbn}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Library"
        description="লাইব্রেরি — book catalogue, issue & return, member fines."
        actions={
          <>
            <Button variant="outline">
              <PlusIcon /> Add Book
            </Button>
            <Button>
              <BookCheckIcon /> Issue Book
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Books"
          bilingualLabel="মোট বই"
          value={`${BOOKS.length} titles`}
          delta={`${totalCopies} copies`}
          icon={LibraryBigIcon}
          tone="indigo"
        />
        <KpiTile
          label="Available Copies"
          value={String(availableCopies)}
          delta={`${totalCopies - availableCopies} issued`}
          icon={BookOpenIcon}
          tone="emerald"
        />
        <KpiTile
          label="Currently Issued"
          value={String(issued)}
          icon={BookCheckIcon}
          tone="sky"
        />
        <KpiTile
          label="Overdue / Fines"
          value={`${overdue} overdue`}
          delta={`${formatBDT(totalFines)} fines`}
          icon={AlertTriangleIcon}
          tone="rose"
        />
      </section>

      <Tabs defaultValue="catalogue">
        <TabsList>
          <TabsTrigger value="catalogue">Book Catalogue</TabsTrigger>
          <TabsTrigger value="issues">Issue / Return</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="mt-4">
          <SectionCard title="Books">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Search title, author or ISBN…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Select value={catFilter} onValueChange={(v) => setCatFilter(v ?? "All")}>
                <SelectTrigger className="sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All categories</SelectItem>
                  <SelectItem value="Bangla">Bangla</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                  <SelectItem value="Religion">Religion</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5">Title / Author</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">ISBN</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((b) => {
                    const lowStock = b.available === 0;
                    return (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2">
                          <div className="font-medium">{b.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {b.author}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="muted">{b.category}</Badge>
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px]">
                          {b.isbn}
                        </td>
                        <td className="px-3 py-2 text-xs">{b.location}</td>
                        <td className="px-3 py-2 tabular">
                          <span
                            className={
                              lowStock
                                ? "font-semibold text-rose-600"
                                : "font-semibold"
                            }
                          >
                            {b.available}
                          </span>
                          <span className="text-muted-foreground"> / {b.copies}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="issues" className="mt-4">
          <SectionCard title="Issue / Return Log">
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5">Issue ID</th>
                    <th className="px-3 py-2.5">Book</th>
                    <th className="px-3 py-2.5">Borrower</th>
                    <th className="px-3 py-2.5">Issued / Due</th>
                    <th className="px-3 py-2.5">Fine</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {BOOK_ISSUES.map((b: BookIssue) => {
                    const isOverdue = !b.returned && b.dueDate < TODAY;
                    return (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2 font-mono text-xs">{b.id}</td>
                        <td className="px-3 py-2">
                          <div className="font-medium">{b.bookTitle}</div>
                        </td>
                        <td className="px-3 py-2">
                          <div>{b.borrowerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {b.borrowerType} · {b.borrowerId}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {formatDate(b.issuedOn)} →{" "}
                          <span
                            className={isOverdue ? "text-rose-600" : ""}
                          >
                            {formatDate(b.dueDate)}
                          </span>
                        </td>
                        <td className="px-3 py-2 tabular">
                          {b.fine > 0 ? (
                            <span className="inline-flex items-center gap-1 text-rose-600">
                              <HandCoinsIcon className="size-3" />
                              {formatBDT(b.fine)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {b.returned ? (
                            <Badge variant="success">Returned</Badge>
                          ) : isOverdue ? (
                            <Badge variant="danger">Overdue</Badge>
                          ) : (
                            <Badge variant="info">Issued</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
