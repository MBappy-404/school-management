"use client";

import { useState } from "react";
import {
  BedDoubleIcon,
  BuildingIcon,
  KeyIcon,
  PlusIcon,
  UsersIcon,
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
import { FormField } from "@/components/dashboard/form-field";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import type { HostelRoom } from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";
import { formatBDT } from "@/lib/utils/bdt";

const BLOCK_GRADIENTS: Record<string, string> = {
  "Boys A": "from-indigo-500 to-violet-600",
  "Boys B": "from-sky-500 to-blue-600",
  "Girls A": "from-rose-500 to-pink-600",
};

export default function HostelPage() {
  const HOSTEL_ROOMS = useSchoolStore((s) => s.hostelRooms);
  const addHostelRoom = useSchoolStore((s) => s.addHostelRoom);
  const [block, setBlock] = useState<string>("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    block: "Boys A" as HostelRoom["block"],
    roomNo: "",
    capacity: 4,
    monthlyFee: 3000,
    warden: "",
  });

  const filtered = HOSTEL_ROOMS.filter(
    (r) => block === "All" || r.block === block,
  );

  const totalCapacity = HOSTEL_ROOMS.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = HOSTEL_ROOMS.reduce((s, r) => s + r.occupied, 0);
  const vacantBeds = totalCapacity - totalOccupied;
  const monthlyRevenue = HOSTEL_ROOMS.reduce(
    (s, r) => s + r.occupied * r.monthlyFee,
    0,
  );

  const blocks = ["All", "Boys A", "Boys B", "Girls A"];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hostel"
        description="ছাত্রাবাস — room inventory, occupancy and warden assignment."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon /> Add Room
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Total Rooms"
          bilingualLabel="মোট কক্ষ"
          value={String(HOSTEL_ROOMS.length)}
          delta="3 blocks"
          icon={BuildingIcon}
          tone="indigo"
        />
        <KpiTile
          label="Beds Occupied"
          bilingualLabel="অধিকৃত"
          value={String(totalOccupied)}
          delta={`of ${totalCapacity} beds`}
          icon={BedDoubleIcon}
          tone="emerald"
        />
        <KpiTile
          label="Vacant Beds"
          value={String(vacantBeds)}
          icon={KeyIcon}
          tone="amber"
        />
        <KpiTile
          label="Monthly Revenue"
          value={formatBDT(monthlyRevenue, { compact: true })}
          icon={UsersIcon}
          tone="violet"
        />
      </section>

      <SectionCard
        title="Room Inventory"
        action={
          <div className="flex flex-wrap gap-1">
            {blocks.map((b) => (
              <Button
                key={b}
                size="sm"
                variant={block === b ? "default" : "outline"}
                onClick={() => setBlock(b)}
              >
                {b}
              </Button>
            ))}
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => {
            const free = r.capacity - r.occupied;
            const full = free === 0;
            return (
              <article
                key={r.id}
                className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${
                    BLOCK_GRADIENTS[r.block] ?? "from-slate-400 to-slate-600"
                  }`}
                />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {r.block}
                      </div>
                      <div className="text-sm font-semibold">{r.roomNo}</div>
                    </div>
                    <Badge
                      variant={full ? "danger" : free === r.capacity ? "muted" : "success"}
                    >
                      {full ? "Full" : `${free} free`}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-semibold tabular">
                      {r.occupied}/{r.capacity}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        BLOCK_GRADIENTS[r.block] ?? "from-slate-400 to-slate-600"
                      }`}
                      style={{
                        width: `${Math.round((r.occupied / r.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 border-t pt-2 text-[11px] text-muted-foreground">
                    Warden: <span className="font-medium text-foreground">{r.warden}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Fee: <span className="tabular font-semibold text-foreground">{formatBDT(r.monthlyFee)}</span> /mo
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Hostel Room</DialogTitle>
            <DialogDescription>
              Register a new room with block, capacity and warden.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Block">
              <Select
                value={form.block}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    block: (v as HostelRoom["block"]) ?? "Boys A",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boys A">Boys A</SelectItem>
                  <SelectItem value="Boys B">Boys B</SelectItem>
                  <SelectItem value="Girls A">Girls A</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Room No">
              <Input
                value={form.roomNo}
                onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
                placeholder="A-101"
              />
            </FormField>
            <FormField label="Capacity">
              <Input
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Monthly Fee">
              <Input
                type="number"
                value={form.monthlyFee}
                onChange={(e) =>
                  setForm({ ...form, monthlyFee: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Warden" className="sm:col-span-2">
              <Input
                value={form.warden}
                onChange={(e) => setForm({ ...form, warden: e.target.value })}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.roomNo.trim() || !form.warden.trim()) {
                  toast.error("Room No and Warden required");
                  return;
                }
                const room: HostelRoom = {
                  id: `HR-${Date.now().toString().slice(-5)}`,
                  block: form.block,
                  roomNo: form.roomNo.trim(),
                  capacity: form.capacity,
                  occupied: 0,
                  monthlyFee: form.monthlyFee,
                  warden: form.warden.trim(),
                };
                addHostelRoom(room);
                toast.success(`Added Room ${room.roomNo}`);
                setCreateOpen(false);
                setForm({
                  block: "Boys A",
                  roomNo: "",
                  capacity: 4,
                  monthlyFee: 3000,
                  warden: "",
                });
              }}
            >
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
