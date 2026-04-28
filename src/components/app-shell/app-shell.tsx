import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card/60 backdrop-blur-sm lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="border-t bg-bd-soft px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <p className="text-[11px] font-medium leading-tight">
              All systems operational
            </p>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            v0.2.0 · Premium Edition
            <br />
            <span className="font-bangla">বাংলাদেশ মডেল হাই স্কুল</span>
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-page mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
