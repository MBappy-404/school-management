"use client";

import { useMemo, useState } from "react";
import {
  BellIcon,
  PinIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormField } from "@/components/dashboard/form-field";
import { EmptyState } from "@/components/dashboard/empty-state";
import { type Notice } from "@/lib/mock-data/notices";
import { useSchoolStore } from "@/lib/store/school-store";

const CATEGORY_TONE: Record<Notice["category"], string> = {
  Academic: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Event: "bg-violet-50 text-violet-700 border-violet-200",
  Holiday: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Exam: "bg-rose-50 text-rose-700 border-rose-200",
  General: "bg-slate-50 text-slate-700 border-slate-200",
};

interface NoticeForm {
  title: string;
  body: string;
  category: Notice["category"];
  audience: Notice["audience"];
  pinned: boolean;
}

const blankForm = (): NoticeForm => ({
  title: "",
  body: "",
  category: "General",
  audience: "All",
  pinned: false,
});

function formatRelative(iso: string): string {
  const days = Math.round(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoticesPage() {
  const notices = useSchoolStore((s) => s.notices);
  const publishNotice = useSchoolStore((s) => s.publishNotice);
  const togglePinNotice = useSchoolStore((s) => s.togglePinNotice);
  const removeNotice = useSchoolStore((s) => s.removeNotice);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NoticeForm>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return [...notices]
      .filter(
        (n) =>
          (categoryFilter === "all" || n.category === categoryFilter) &&
          (audienceFilter === "all" || n.audience === audienceFilter),
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      });
  }, [notices, categoryFilter, audienceFilter]);

  function openCreate() {
    setForm(blankForm());
    setErrors({});
    setDialogOpen(true);
  }
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.body.trim()) e.body = "Body is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit() {
    if (!validate()) return;
    const newNotice: Notice = {
      id: `NTC-${Date.now().toString().slice(-6)}`,
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      audience: form.audience,
      pinned: form.pinned,
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    publishNotice(newNotice);
    toast.success(`Published "${newNotice.title}"`);
    setDialogOpen(false);
  }
  function togglePin(id: string) {
    togglePinNotice(id);
  }
  function handleDelete() {
    if (!deleteId) return;
    removeNotice(deleteId);
    toast.success("Notice removed");
    setDeleteId(null);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <PageHeader
        title="Notice Board"
        description="Publish and manage school-wide announcements, exam routines and event notices."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon /> New Notice
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </span>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Holiday">Holiday</SelectItem>
              <SelectItem value="Exam">Exam</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Audience
          </span>
          <Select
            value={audienceFilter}
            onValueChange={(v) => setAudienceFilter(v ?? "all")}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="All">Everyone</SelectItem>
              <SelectItem value="Students">Students</SelectItem>
              <SelectItem value="Teachers">Teachers</SelectItem>
              <SelectItem value="Guardians">Guardians</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BellIcon}
          title="No notices found"
          description="Try resetting filters or publish a new notice."
          action={
            <Button onClick={openCreate}>
              <PlusIcon /> New Notice
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((n) => (
            <li
              key={n.id}
              className="rounded-2xl border bg-card p-4 transition hover:border-indigo-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.pinned && (
                      <PinIcon className="size-3.5 text-amber-500" />
                    )}
                    <h3 className="font-semibold">{n.title}</h3>
                    <Badge
                      className={`${CATEGORY_TONE[n.category]} border`}
                      variant="outline"
                    >
                      {n.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-muted-foreground/30 text-muted-foreground"
                    >
                      {n.audience}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BellIcon className="size-3" />
                      {formatRelative(n.publishedAt)}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{n.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => togglePin(n.id)}
                    aria-label={n.pinned ? "Unpin notice" : "Pin notice"}
                    title={n.pinned ? "Unpin notice" : "Pin notice"}
                  >
                    <PinIcon
                      className={n.pinned ? "text-amber-500" : "opacity-50"}
                    />
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setDeleteId(n.id)}
                    aria-label="Delete notice"
                  >
                    <Trash2Icon className="text-rose-500" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* New notice */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Publish a notice</DialogTitle>
            <DialogDescription>
              Notices appear on the dashboard and the notice board.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <FormField label="Title" htmlFor="ntitle" required error={errors.title}>
              <Input
                id="ntitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Mid-term Exam Routine Published"
              />
            </FormField>
            <FormField label="Body" htmlFor="nbody" required error={errors.body}>
              <Textarea
                id="nbody"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={4}
                placeholder="Write the notice content here..."
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category" htmlFor="ncat">
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      category: (v as Notice["category"]) ?? form.category,
                    })
                  }
                >
                  <SelectTrigger id="ncat" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Audience" htmlFor="naud">
                <Select
                  value={form.audience}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      audience: (v as Notice["audience"]) ?? form.audience,
                    })
                  }
                >
                  <SelectTrigger id="naud" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Everyone</SelectItem>
                    <SelectItem value="Students">Students</SelectItem>
                    <SelectItem value="Teachers">Teachers</SelectItem>
                    <SelectItem value="Guardians">Guardians</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <label className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                <PinIcon className="size-4 text-amber-500" />
                Pin to top
              </span>
              <Switch
                checked={form.pinned}
                onCheckedChange={(c) => setForm({ ...form, pinned: c })}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete notice?</DialogTitle>
            <DialogDescription>
              Demo only — change is in-memory and resets on refresh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2Icon /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
