"use client";

import { useMemo, useState } from "react";
import {
  AlertCircleIcon,
  BoxesIcon,
  PackageIcon,
  PackagePlusIcon,
  TrendingDownIcon,
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
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { INVENTORY } from "@/lib/mock-data/extended";
import { formatBDT } from "@/lib/utils/bdt";

const CATEGORY_TONE: Record<string, "indigo" | "violet" | "success" | "warning" | "info" | "danger"> = {
  Stationery: "indigo",
  Lab: "violet",
  Sports: "success",
  Furniture: "warning",
  IT: "info",
  Cleaning: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const filtered = useMemo(() => {
    return INVENTORY.filter((it) => {
      if (catFilter !== "All" && it.category !== catFilter) return false;
      if (
        search &&
        !`${it.name} ${it.supplier}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, catFilter]);

  const totalItems = INVENTORY.length;
  const lowStock = INVENTORY.filter((i) => i.inStock <= i.reorderLevel).length;
  const totalValue = INVENTORY.reduce(
    (s, i) => s + i.inStock * i.unitPrice,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="মজুদ — stock items, reorder levels and supplier records."
        actions={
          <Button>
            <PackagePlusIcon /> Record Purchase
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Items"
          value={String(totalItems)}
          delta="6 categories"
          icon={BoxesIcon}
          tone="indigo"
        />
        <KpiTile
          label="Inventory Value"
          value={formatBDT(totalValue, { compact: true })}
          icon={PackageIcon}
          tone="emerald"
        />
        <KpiTile
          label="Low Stock"
          value={String(lowStock)}
          delta="needs reorder"
          icon={TrendingDownIcon}
          tone="rose"
        />
        <KpiTile
          label="Suppliers"
          value="6 active"
          icon={AlertCircleIcon}
          tone="amber"
        />
      </section>

      <SectionCard title="Stock List">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search item or supplier…"
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
              <SelectItem value="Stationery">Stationery</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Item</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Stock</th>
                <th className="px-3 py-2.5">Reorder</th>
                <th className="px-3 py-2.5">Unit Price</th>
                <th className="px-3 py-2.5">Value</th>
                <th className="px-3 py-2.5">Supplier / Last</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((i) => {
                const low = i.inStock <= i.reorderLevel;
                return (
                  <tr key={i.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2">
                      <div className="font-medium">{i.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        {i.id}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={CATEGORY_TONE[i.category] ?? "muted"}>
                        {i.category}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 tabular">
                      <span className={low ? "font-semibold text-rose-600" : "font-semibold"}>
                        {i.inStock}
                      </span>
                      <span className="text-muted-foreground"> {i.unit}</span>
                    </td>
                    <td className="px-3 py-2 tabular text-muted-foreground">
                      {i.reorderLevel}
                    </td>
                    <td className="px-3 py-2 tabular">
                      {formatBDT(i.unitPrice)}
                    </td>
                    <td className="px-3 py-2 tabular font-medium">
                      {formatBDT(i.inStock * i.unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div>{i.supplier}</div>
                      <div className="text-muted-foreground">
                        {formatDate(i.lastPurchased)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
