"use client";

import { useState } from "react";
import {
  MessageSquareIcon,
  SendIcon,
  UsersIcon,
  CheckCircle2Icon,
  ClockIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  SMS_TEMPLATES,
  type SmsTemplate,
  type AudienceType,
  type SmsLog,
} from "@/lib/mock-data/extended";
import { useSchoolStore } from "@/lib/store/school-store";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Delivered: "success",
  Queued: "warning",
  Failed: "danger",
};

export default function MessagingPage() {
  const SMS_LOGS = useSchoolStore((s) => s.smsLogs);
  const sendSms = useSchoolStore((s) => s.sendSms);
  const [selected, setSelected] = useState<SmsTemplate>(SMS_TEMPLATES[0]!);
  const [audience, setAudience] = useState<AudienceType>(selected.audience);
  const [body, setBody] = useState(selected.body);

  function pickTemplate(id: string) {
    const t = SMS_TEMPLATES.find((x) => x.id === id);
    if (t) {
      setSelected(t);
      setAudience(t.audience);
      setBody(t.body);
    }
  }

  function handleSend() {
    const recipients =
      audience === "All"
        ? 240
        : audience === "Students"
          ? 180
          : audience === "Teachers"
            ? 24
            : audience === "Guardians"
              ? 200
              : 32;
    const log: SmsLog = {
      id: `SMS-${Date.now().toString().slice(-6)}`,
      templateName: selected.name,
      audience,
      recipients,
      status: "Queued",
      sentAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      preview: body.slice(0, 80),
    };
    sendSms(log);
    toast.success("SMS queued for delivery", {
      description: `Audience: ${audience} · ${recipients} recipients`,
    });
  }

  const totalSent = SMS_LOGS.reduce((s, l) => s + l.recipients, 0);
  const delivered = SMS_LOGS.filter((l) => l.status === "Delivered").length;
  const queued = SMS_LOGS.filter((l) => l.status === "Queued").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SMS / Messaging Center"
        description="এসএমএস সেন্টার — bulk messaging to students, guardians and staff."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Templates"
          value={String(SMS_TEMPLATES.length)}
          icon={MessageSquareIcon}
          tone="indigo"
        />
        <KpiTile
          label="Total Sent"
          value={String(totalSent)}
          delta="last 7 days"
          icon={SendIcon}
          tone="emerald"
        />
        <KpiTile
          label="Delivered"
          value={String(delivered)}
          icon={CheckCircle2Icon}
          tone="sky"
        />
        <KpiTile
          label="Queued"
          value={String(queued)}
          icon={ClockIcon}
          tone="amber"
        />
      </section>

      <Tabs defaultValue="compose">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Send History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard className="lg:col-span-2" title="Compose Message">
              <div className="grid gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Template
                  </label>
                  <Select
                    value={selected.id}
                    onValueChange={(v) => pickTemplate(v ?? selected.id)}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SMS_TEMPLATES.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Audience
                  </label>
                  <Select
                    value={audience}
                    onValueChange={(v) =>
                      setAudience((v ?? "All") as AudienceType)
                    }
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All recipients</SelectItem>
                      <SelectItem value="Students">Students only</SelectItem>
                      <SelectItem value="Guardians">
                        Guardians only
                      </SelectItem>
                      <SelectItem value="Teachers">Teachers / Staff</SelectItem>
                      <SelectItem value="Class">Specific class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Message body
                  </label>
                  <Textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 resize-none"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      Variables supported: {"{{name}}, {{class}}, {{date}}"}
                    </span>
                    <span>{body.length} chars · {Math.ceil(body.length / 160)} SMS</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as draft</Button>
                  <Button onClick={handleSend}>
                    <SendIcon /> Send Message
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Live Preview" description="As recipients will see">
              <div className="rounded-2xl border bg-bd-soft p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UsersIcon className="size-3.5" />
                  Audience: <Badge variant="info">{audience}</Badge>
                </div>
                <div className="mt-3 rounded-xl border bg-card p-3 shadow-sm">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    From: BDMHS
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{body}</p>
                </div>
                <div className="mt-3 text-[10px] text-muted-foreground">
                  Estimated reach: ~ 240 recipients · ~৳ 0.45 / SMS
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <SectionCard title="Saved Templates">
            <div className="grid gap-3 lg:grid-cols-2">
              {SMS_TEMPLATES.map((t) => (
                <article
                  key={t.id}
                  className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">{t.name}</h3>
                    <Badge variant="info">{t.audience}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{t.body}</p>
                </article>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <SectionCard title="Send History">
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5">Sent</th>
                    <th className="px-3 py-2.5">Template</th>
                    <th className="px-3 py-2.5">Audience</th>
                    <th className="px-3 py-2.5">Recipients</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {SMS_LOGS.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs">{l.sentAt}</td>
                      <td className="px-3 py-2 font-medium">
                        {l.templateName}
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="muted">{l.audience}</Badge>
                      </td>
                      <td className="px-3 py-2 tabular">{l.recipients}</td>
                      <td className="px-3 py-2">
                        <Badge variant={STATUS_VARIANT[l.status] ?? "muted"}>
                          {l.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 max-w-md truncate text-xs text-muted-foreground">
                        {l.preview}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
