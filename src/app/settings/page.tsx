"use client";

import { useState } from "react";
import { SaveIcon, SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormField } from "@/components/dashboard/form-field";
import { SCHOOL_INFO } from "@/lib/mock-data/reports";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: SCHOOL_INFO.name,
    address: SCHOOL_INFO.address,
    phone: SCHOOL_INFO.phone,
    email: SCHOOL_INFO.email,
    eiin: SCHOOL_INFO.eiin.replace("EIIN-", ""),
    headTeacher: SCHOOL_INFO.headTeacher,
  });
  const [prefs, setPrefs] = useState({
    bnNumerals: false,
    weeklyOffSat: true,
    smsNotifications: true,
    emailReceipts: false,
  });

  function save() {
    toast.success("Settings saved (demo only — kept in memory).");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <PageHeader
        title="Settings"
        description="School profile, academic preferences and notification settings."
        actions={
          <Button onClick={save}>
            <SaveIcon /> Save changes
          </Button>
        }
      />

      <section className="rounded-2xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <SettingsIcon className="size-4 text-indigo-500" />
          <h2 className="font-semibold">School Profile</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="School Name" htmlFor="sname">
            <Input
              id="sname"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="EIIN" htmlFor="eiin">
            <Input
              id="eiin"
              value={form.eiin}
              onChange={(e) => setForm({ ...form, eiin: e.target.value })}
            />
          </FormField>
          <FormField
            label="Address"
            htmlFor="addr"
            className="sm:col-span-2"
          >
            <Input
              id="addr"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormField>
          <FormField label="Phone" htmlFor="ph">
            <Input
              id="ph"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </FormField>
          <FormField label="Email" htmlFor="em">
            <Input
              id="em"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormField>
          <FormField
            label="Head Teacher"
            htmlFor="ht"
            className="sm:col-span-2"
          >
            <Input
              id="ht"
              value={form.headTeacher}
              onChange={(e) =>
                setForm({ ...form, headTeacher: e.target.value })
              }
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 font-semibold">Preferences</h2>
        <ul className="flex flex-col divide-y">
          {[
            {
              key: "bnNumerals",
              title: "Use Bangla numerals",
              desc: "Display digits in Bangla (১, ২, ৩) on dashboards and reports.",
            },
            {
              key: "weeklyOffSat",
              title: "Weekly off on Saturday",
              desc: "Skip Saturday in attendance calculations.",
            },
            {
              key: "smsNotifications",
              title: "SMS notifications",
              desc: "Send fee due and absence alerts to guardian phones.",
            },
            {
              key: "emailReceipts",
              title: "Email receipts",
              desc: "Email a copy of payment receipts after each transaction.",
            },
          ].map((p) => (
            <li key={p.key} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
              </div>
              <Switch
                checked={prefs[p.key as keyof typeof prefs]}
                onCheckedChange={(c) =>
                  setPrefs({ ...prefs, [p.key]: c })
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
