"use client";

import type { ReactNode } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { ChartPoint } from "@/lib/types/reports";

const PIE_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#ec4899",
];

interface PieChartProps {
  data: ChartPoint[];
  height?: number;
  formatter?: (value: number) => string;
  donut?: boolean;
}

export function PieChart({
  data,
  height = 260,
  formatter,
  donut = true,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={donut ? "55%" : 0}
          outerRadius="85%"
          paddingAngle={donut ? 3 : 0}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) =>
            formatter && typeof v === "number" ? formatter(v) : (v as ReactNode)
          }
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RePieChart>
    </ResponsiveContainer>
  );
}
