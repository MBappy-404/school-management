"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  to: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (value: number) => string;
}

/**
 * Animated count-up. Animates from 0 → `to` once on mount, using rAF.
 */
export function AnimatedCounter({
  to,
  duration = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
}: AnimatedCounterProps) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = 0;
    startRef.current = null;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (to - fromRef.current) * eased;
      setVal(next);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [to, duration]);

  const display = formatter ? formatter(val) : val.toFixed(decimals);
  return (
    <span className="tabular">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
