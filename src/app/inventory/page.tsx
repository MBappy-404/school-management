"use client";

import { useMemo, useState } from "react";
import {
  AlertCircleIcon,
  BoxesIcon,
  DownloadIcon,
  PackageIcon,
  PackagePlusIcon,
  TrendingDownIcon,
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
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/dashboard/form-field";
import type { InventoryItem } from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";
import { formatBDT } from "@/lib/utils/bdt";
import { downloadInventoryExcel } from "@/lib/utils/page-exports";

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

interface InvForm {
  name: string;
  category: InventoryItem["category"];
  unit: string;
  inStock: number;
  reorderLevel: number;
  unitPrice: number;
  supplier: string;
}

const blankInv = (): InvForm => ({
  name: "",
  category: "Stationery",
  unit: "pcs",
  inStock: 50,
  reorderLevel: 10,
  unitPrice: 100,
  supplier: "",
});

export default function InventoryPage() {
  const INVENTORY = useSchoolStore((s) => s.inventory);
  const addInventory = useSchoolStore((s) => s.addInventory);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<InvForm>(blankInv);

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
  }, [INVENTORY, search, catFilter]);

  function submitItem() {
    if (!form.name.trim() || !form.supplier.trim()) {
      toast.error("Name and supplier are required");
      return;
    }
    const item: InventoryItem = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      category: form.category,
      unit: form.unit,
      inStock: form.inStock,
      reorderLevel: form.reorderLevel,
      unitPrice: form.unitPrice,
      supplier: form.supplier.trim(),
      lastPurchased: new Date().toISOString().slice(0, 10),
    };
    addInventory(item);
    toast.success(`Added ${item.name}`);
    setCreateOpen(false);
    setForm(blankInv());
  }

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
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadInventoryExcel(filtered);
                toast.success(`Exported ${filtered.length} items`);
              }}
            >
              <DownloadIcon /> Export Excel
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <PackagePlusIcon /> Record Purchase
            </Button>
          </div>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Purchase / Add Item</DialogTitle>
            <DialogDescription>
              Add a new inventory item to stock.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Item Name" className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Category">
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    category:
                      (v as InventoryItem["category"]) ?? "Stationery",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Unit">
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </FormField>
            <FormField label="In Stock">
              <Input
                type="number"
                value={form.inStock}
                onChange={(e) =>
                  setForm({ ...form, inStock: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Reorder Level">
              <Input
                type="number"
                value={form.reorderLevel}
                onChange={(e) =>
                  setForm({ ...form, reorderLevel: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Unit Price (BDT)">
              <Input
                type="number"
                value={form.unitPrice}
                onChange={(e) =>
                  setForm({ ...form, unitPrice: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Supplier">
              <Input
                value={form.supplier}
                onChange={(e) =>
                  setForm({ ...form, supplier: e.target.value })
                }
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
