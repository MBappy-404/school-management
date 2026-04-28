"use client";

import { cn } from "@/lib/utils";

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
  showArea?: boolean;
}

/**
 * Lightweight inline sparkline (no Recharts) for KPI tiles.
 * Renders a smoothed polyline + optional gradient area fill.
 */
export function Sparkline({
  values,
  width = 96,
  height = 28,
  stroke = "currentColor",
  fill = "currentColor",
  className,
  showArea = true,
}: SparklineProps) {
  if (!values.length) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return [x, y] as const;
    });

  const polyPoints = points.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPath =
    `M0,${height} ` +
    points.map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${width},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("block", className)}
      preserveAspectRatio="none"
    >
      {showArea && (
        <path
          d={areaPath}
          fill={fill}
          opacity={0.18}
        />
      )}
      <polyline
        points={polyPoints}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
