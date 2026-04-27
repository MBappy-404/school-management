"use client";

import { useState } from "react";
import {
  BellIcon,
  MenuIcon,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
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
        <SheetContent side="left" className="w-72 sm:max-w-72 p-0">
          <SidebarBrand />
          <div className="flex-1 overflow-y-auto">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative hidden flex-1 max-w-md items-center md:flex">
        <SearchIcon className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search students, teachers, classes..."
          className="h-8 w-full rounded-lg border border-input bg-background pl-8 pr-2.5 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 sm:inline">
          Academic Year 2026
        </span>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative"
        >
          <BellIcon />
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-rose-500" />
        </Button>

        <div className="hidden items-center gap-2 rounded-full border bg-card px-1 py-0.5 pr-2.5 sm:flex">
          <Avatar className="size-7">
            <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-none md:flex">
            <span className="text-xs font-semibold">Md. Ashraful Islam</span>
            <span className="text-[10px] text-muted-foreground">
              Head Teacher
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
