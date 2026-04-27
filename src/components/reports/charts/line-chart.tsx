"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/lib/types/reports";

interface LineChartProps {
  data: ChartPoint[];
  color?: string;
  label?: string;
  height?: number;
  formatter?: (value: number) => string;
}

export function LineChart({
  data,
  color = "#6366f1",
  label = "Value",
  height = 260,
  formatter,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
      >
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
          formatter={(v) =>
            formatter && typeof v === "number" ? formatter(v) : (v as ReactNode)
          }
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 1.5 }}
          activeDot={{ r: 6 }}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
