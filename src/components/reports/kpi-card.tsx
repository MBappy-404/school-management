"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import type { KPI } from "@/lib/types/reports";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  kpi: KPI;
  index?: number;
}

const toneClass: Record<NonNullable<KPI["tone"]>, string> = {
  positive: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
  negative: "from-rose-500/15 to-rose-500/5 text-rose-700",
  neutral: "from-indigo-500/15 to-indigo-500/5 text-indigo-700",
};

export function KpiCard({ kpi, index = 0 }: KpiCardProps) {
  const tone = kpi.tone ?? "neutral";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-border/60",
          "bg-gradient-to-br",
          toneClass[tone],
        )}
      >
        <CardContent className="p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/70">
            {kpi.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {kpi.value}
          </p>
          {kpi.delta && (
            <p className="mt-1 text-xs text-foreground/60">{kpi.delta}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function KpiGrid({ items }: { items: KPI[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((kpi, idx) => (
        <KpiCard key={kpi.label} kpi={kpi} index={idx} />
      ))}
    </div>
  );
}
