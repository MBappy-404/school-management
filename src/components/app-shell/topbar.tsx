"use client";

import { useState } from "react";
import { MenuIcon, SearchIcon, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { NotificationPanel } from "./notification-panel";
import { CommandPalette } from "./command-palette";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";

export function TopBar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open navigation"
              className="lg:hidden"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 sm:max-w-72">
          <SidebarBrand />
          <div className="flex-1 overflow-y-auto">
            <SidebarNav onNavigate={() => setSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <Breadcrumb />
      </div>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Search (Ctrl+K)"
        className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-lg border bg-card px-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/40 lg:flex"
      >
        <SearchIcon className="size-3.5" />
        <span className="flex-1 truncate">Search students, pages…</span>
        <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold">
          Ctrl K
        </span>
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Search"
        className="ml-auto inline-flex size-8 items-center justify-center rounded-md hover:bg-muted lg:hidden"
      >
        <SearchIcon className="size-4 text-muted-foreground" />
      </button>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <div className="flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 sm:inline-flex">
          <CalendarIcon className="size-3" />
          Academic Year 2026
        </span>

        <ThemeSwitcher />
        <NotificationPanel />

        <div className="ml-1 hidden items-center gap-2 rounded-full border bg-card px-1 py-0.5 pr-2.5 sm:flex">
          <Avatar className="size-7">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-tight md:flex">
            <span className="text-xs font-semibold">Md. Ashraful Islam</span>
            <span className="text-[10px] text-muted-foreground">
              Head Teacher · Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
