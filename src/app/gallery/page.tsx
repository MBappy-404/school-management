"use client";

import { useState } from "react";
import {
  CameraIcon,
  ImageIcon,
  PlusIcon,
  TrophyIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/dashboard/form-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import { ACHIEVEMENTS, type GalleryAlbum } from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";

const ACH_TONE: Record<string, "info" | "success" | "violet"> = {
  Academic: "info",
  Sports: "success",
  Cultural: "violet",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const COVERS = [
  "from-indigo-500 to-violet-600",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-rose-500",
];

export default function GalleryPage() {
  const GALLERY = useSchoolStore((s) => s.gallery);
  const addAlbum = useSchoolStore((s) => s.addAlbum);
  const [filter, setFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Sports" as GalleryAlbum["category"],
    count: 20,
  });

  const filtered = GALLERY.filter(
    (g) => filter === "All" || g.category === filter,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gallery & Achievements"
        description="স্মৃতি — albums, photos and student achievements showcase."
        actions={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> Add Album
            </Button>
            <Button
              onClick={() =>
                toast.info(
                  "Achievement form coming \u2014 use Albums to upload event photos",
                )
              }
            >
              <TrophyIcon /> Add Achievement
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Albums"
          value={String(GALLERY.length)}
          icon={ImageIcon}
          tone="indigo"
        />
        <KpiTile
          label="Total Photos"
          value={String(GALLERY.reduce((s, g) => s + g.count, 0))}
          icon={CameraIcon}
          tone="sky"
        />
        <KpiTile
          label="Achievements"
          value={String(ACHIEVEMENTS.length)}
          icon={TrophyIcon}
          tone="amber"
        />
        <KpiTile
          label="Categories"
          value="4"
          delta="Sports · Cultural · Academic · Trip"
          icon={ImageIcon}
          tone="violet"
        />
      </section>

      <Tabs defaultValue="albums">
        <TabsList>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="mt-4">
          <SectionCard
            title="Photo Albums"
            action={
              <div className="flex flex-wrap gap-1">
                {["All", "Sports", "Cultural", "Academic", "Field Trip"].map(
                  (c) => (
                    <Button
                      key={c}
                      size="sm"
                      variant={filter === c ? "default" : "outline"}
                      onClick={() => setFilter(c)}
                    >
                      {c}
                    </Button>
                  ),
                )}
              </div>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <article
                  key={g.id}
                  className="group cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`relative aspect-[4/3] bg-gradient-to-br ${g.cover} text-white`}
                  >
                    <div className="absolute inset-0 flex items-end p-4">
                      <div>
                        <Badge variant="muted">{g.category}</Badge>
                        <h3 className="mt-2 text-base font-semibold leading-tight drop-shadow">
                          {g.title}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
                      {g.count} photos
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
                    <span>{formatDate(g.date)}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      Open →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <SectionCard title="Hall of Fame">
            <ul className="grid gap-3 lg:grid-cols-2">
              {ACHIEVEMENTS.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4"
                >
                  <div className="bg-bd-gradient flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm">
                    <TrophyIcon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold">{a.title}</h3>
                      <Badge variant={ACH_TONE[a.category] ?? "muted"}>
                        {a.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.studentName} · Class {a.className} · Rank {a.rank}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatDate(a.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Album</DialogTitle>
            <DialogDescription>
              Create a new event / photo album.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <FormField label="Title">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Annual Cultural Programme 2026"
              />
            </FormField>
            <FormField label="Category">
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    category: (v as GalleryAlbum["category"]) ?? "Sports",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Field Trip">Field Trip</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Photo Count">
              <Input
                type="number"
                value={form.count}
                onChange={(e) =>
                  setForm({ ...form, count: Number(e.target.value) })
                }
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.title.trim()) {
                  toast.error("Title required");
                  return;
                }
                const cover =
                  COVERS[GALLERY.length % COVERS.length] ?? COVERS[0]!;
                const album: GalleryAlbum = {
                  id: `GAL-${Date.now().toString().slice(-5)}`,
                  title: form.title.trim(),
                  category: form.category,
                  date: new Date().toISOString().slice(0, 10),
                  cover,
                  count: form.count,
                };
                addAlbum(album);
                toast.success(`Added album: ${album.title}`);
                setCreateOpen(false);
                setForm({ title: "", category: "Sports", count: 20 });
              }}
            >
              Save Album
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
