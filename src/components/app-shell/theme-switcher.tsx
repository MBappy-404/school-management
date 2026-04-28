"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // next-themes is client-only; render a placeholder during SSR / first paint.
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return <div className="size-8 rounded-md" aria-hidden />;
  }

  const cycle = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");
  };

  const Icon =
    theme === "dark" ? MoonIcon : theme === "system" ? MonitorIcon : SunIcon;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Theme: ${theme} (click to change)`}
      onClick={cycle}
      className={cn("relative")}
    >
      <Icon className="size-4" />
    </Button>
  );
}
