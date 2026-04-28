"use client";

import { useState } from "react";
import {
  BusIcon,
  GaugeIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { BusRoute } from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";
import { formatBDT } from "@/lib/utils/bdt";

export default function TransportPage() {
  const BUS_ROUTES = useSchoolStore((s) => s.busRoutes);
  const addBusRoute = useSchoolStore((s) => s.addBusRoute);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    driver: "",
    driverPhone: "",
    vehicleNo: "",
    capacity: 30,
    monthlyFee: 1500,
    pickupPoints: "",
  });
  const totalCapacity = BUS_ROUTES.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = BUS_ROUTES.reduce((s, r) => s + r.occupied, 0);
  const monthlyRevenue = BUS_ROUTES.reduce(
    (s, r) => s + r.occupied * r.monthlyFee,
    0,
  );
  const utilization = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transport"
        description="পরিবহন — bus routes, drivers, capacity and student assignments."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon /> Add Route
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Active Routes"
          bilingualLabel="রুট"
          value={String(BUS_ROUTES.length)}
          icon={BusIcon}
          tone="indigo"
        />
        <KpiTile
          label="Total Riders"
          bilingualLabel="যাত্রী"
          value={String(totalOccupied)}
          delta={`of ${totalCapacity} seats`}
          icon={UserIcon}
          tone="sky"
        />
        <KpiTile
          label="Utilization"
          value={`${utilization}%`}
          icon={GaugeIcon}
          tone="emerald"
        />
        <KpiTile
          label="Monthly Revenue"
          bilingualLabel="মাসিক আয়"
          value={formatBDT(monthlyRevenue, { compact: true })}
          icon={BusIcon}
          tone="violet"
        />
      </section>

      <SectionCard
        title="Route Cards"
        description="Each route shows driver, vehicle, capacity, pickup points and fee."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {BUS_ROUTES.map((r) => {
            const pct = Math.round((r.occupied / r.capacity) * 100);
            return (
              <article
                key={r.id}
                className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {r.id}
                    </div>
                    <h3 className="mt-0.5 text-sm font-semibold">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {r.vehicleNo}
                    </p>
                  </div>
                  <Badge
                    variant={
                      pct >= 95 ? "danger" : pct >= 80 ? "warning" : "success"
                    }
                  >
                    {pct}% full
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <UserIcon className="size-3.5" />
                    {r.driver}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <PhoneIcon className="size-3.5" />
                    {r.driverPhone}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1">
                  <MapPinIcon className="size-3.5 text-muted-foreground" />
                  {r.pickupPoints.map((p, i) => (
                    <span key={p} className="flex items-center gap-1">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                        {p}
                      </span>
                      {i < r.pickupPoints.length - 1 && (
                        <span className="text-muted-foreground/60">→</span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-end justify-between border-t pt-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Riders / Capacity
                    </div>
                    <div className="text-lg font-semibold tabular">
                      {r.occupied}{" "}
                      <span className="text-sm text-muted-foreground">
                        / {r.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Monthly Fee
                    </div>
                    <div className="text-lg font-semibold tabular">
                      {formatBDT(r.monthlyFee)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Bus Route</DialogTitle>
            <DialogDescription>
              Register a new transport route with driver and pickup points.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Route Name" className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mirpur - Uttara"
              />
            </FormField>
            <FormField label="Driver">
              <Input
                value={form.driver}
                onChange={(e) => setForm({ ...form, driver: e.target.value })}
              />
            </FormField>
            <FormField label="Driver Phone">
              <Input
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
              />
            </FormField>
            <FormField label="Vehicle No">
              <Input
                value={form.vehicleNo}
                onChange={(e) =>
                  setForm({ ...form, vehicleNo: e.target.value })
                }
                placeholder="DHA-METRO-XX-1234"
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
            <FormField
              label="Pickup Points (comma separated)"
              className="sm:col-span-2"
            >
              <Input
                value={form.pickupPoints}
                onChange={(e) =>
                  setForm({ ...form, pickupPoints: e.target.value })
                }
                placeholder="Mirpur 10, Kalshi, Airport, School"
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.driver.trim()) {
                  toast.error("Route name and driver required");
                  return;
                }
                const route: BusRoute = {
                  id: `BUS-${Date.now().toString().slice(-5)}`,
                  name: form.name.trim(),
                  driver: form.driver.trim(),
                  driverPhone: form.driverPhone || "01XXXXXXXXX",
                  vehicleNo: form.vehicleNo || "DHAKA-METRO",
                  capacity: form.capacity,
                  occupied: 0,
                  pickupPoints: form.pickupPoints
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean),
                  monthlyFee: form.monthlyFee,
                };
                addBusRoute(route);
                toast.success(`Added route ${route.name}`);
                setCreateOpen(false);
                setForm({
                  name: "",
                  driver: "",
                  driverPhone: "",
                  vehicleNo: "",
                  capacity: 30,
                  monthlyFee: 1500,
                  pickupPoints: "",
                });
              }}
            >
              Add Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
