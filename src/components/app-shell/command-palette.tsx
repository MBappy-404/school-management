"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, ArrowRightIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { NAV_FLAT } from "./sidebar-nav";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  // Cmd/Ctrl + K toggles
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setQuery("");
      setActiveIdx(0);
    }
    onOpenChange(next);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_FLAT;
    return NAV_FLAT.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.bangla && i.bangla.includes(q)) ||
        i.href.toLowerCase().includes(q),
    );
  }, [query]);

  function handleSelect(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIdx];
      if (item) handleSelect(item.href);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="top-[20%] max-w-xl translate-y-0 gap-0 p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-2 border-b px-3 py-3">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Search pages, modules, students... (Bangla supported)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            ESC
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches found.
            </div>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {results.map((item, i) => {
                const Icon = item.icon;
                const active = i === activeIdx;
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => handleSelect(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm",
                        active
                          ? "bg-muted text-foreground"
                          : "text-foreground/80 hover:bg-muted/60",
                      )}
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.bangla && (
                        <span className="font-bangla text-xs text-muted-foreground">
                          {item.bangla}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {item.href}
                      </span>
                      <ArrowRightIcon className="size-3.5 text-muted-foreground/60" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-3 border-t px-3 py-2 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border bg-muted px-1 font-mono">↑↓</kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1 font-mono">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1 font-mono">⌘K</kbd>{" "}
            toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
