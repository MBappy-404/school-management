"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint, MultiChartPoint } from "@/lib/types/reports";

const CHART_COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

interface SimpleBarProps {
  data: ChartPoint[];
  color?: string;
  label?: string;
  height?: number;
  formatter?: (value: number) => string;
}

export function BarChart({
  data,
  color = CHART_COLORS[0],
  label = "Value",
  height = 260,
  formatter,
}: SimpleBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
          formatter={(v) =>
            formatter && typeof v === "number" ? formatter(v) : (v as ReactNode)
          }
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" name={label} fill={color} radius={[6, 6, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

interface MultiBarProps {
  data: MultiChartPoint[];
  series: string[];
  height?: number;
  formatter?: (value: number) => string;
  stacked?: boolean;
}

export function MultiBarChart({
  data,
  series,
  height = 280,
  formatter,
  stacked = false,
}: MultiBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
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
        {series.map((key, idx) => (
          <Bar
            key={key}
            dataKey={key}
            fill={CHART_COLORS[idx % CHART_COLORS.length]}
            stackId={stacked ? "a" : undefined}
            radius={stacked ? 0 : [6, 6, 0, 0]}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
}
