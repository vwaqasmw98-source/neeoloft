'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import toast from 'react-hot-toast';

type Settings = {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  socialTwitter: string;
  socialLinkedin: string;
  socialInstagram: string;
  enableChatbot: boolean;
  enableBookings: boolean;
  maintenanceMode: boolean;
};

const defaults: Settings = {
  siteName: 'Neeoloft',
  siteTagline: 'AI-first web & automation agency',
  contactEmail: 'hello@neeoloft.com',
  contactPhone: '',
  socialTwitter: 'https://twitter.com/neeoloft',
  socialLinkedin: 'https://linkedin.com/company/neeoloft',
  socialInstagram: '',
  enableChatbot: true,
  enableBookings: true,
  maintenanceMode: false,
};

export function SettingsClient() {
  const [data, setData] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((d) => setData({ ...defaults, ...(d.settings || {}) }))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function save(key: keyof Settings, value: unknown) {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      setData((cur) => ({ ...cur, [key]: value }));
      toast.success('Saved');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Update your site's branding, contact info, and feature flags — no deploy required."
      />

      <div className="space-y-4">
        <Section title="Branding" description="Site name and tagline shown in headers, footers, and metadata.">
          <Field
            label="Site name"
            value={data.siteName}
            onSave={(v) => save('siteName', v)}
            saving={saving}
          />
          <Field
            label="Tagline"
            value={data.siteTagline}
            onSave={(v) => save('siteTagline', v)}
            saving={saving}
          />
        </Section>

        <Section title="Contact" description="How customers reach you.">
          <Field
            label="Contact email"
            value={data.contactEmail}
            onSave={(v) => save('contactEmail', v)}
            saving={saving}
            type="email"
          />
          <Field
            label="Contact phone"
            value={data.contactPhone}
            onSave={(v) => save('contactPhone', v)}
            saving={saving}
          />
        </Section>

        <Section title="Social" description="Links shown in the footer and structured data.">
          <Field
            label="Twitter / X"
            value={data.socialTwitter}
            onSave={(v) => save('socialTwitter', v)}
            saving={saving}
          />
          <Field
            label="LinkedIn"
            value={data.socialLinkedin}
            onSave={(v) => save('socialLinkedin', v)}
            saving={saving}
          />
          <Field
            label="Instagram"
            value={data.socialInstagram}
            onSave={(v) => save('socialInstagram', v)}
            saving={saving}
          />
        </Section>

        <Section title="Features" description="Toggle platform features without redeploying.">
          <Toggle
            label="AI chatbot"
            description="Show the Aria chatbot widget on the public site."
            checked={data.enableChatbot}
            onChange={(v) => save('enableChatbot', v)}
          />
          <Toggle
            label="Bookings"
            description="Allow visitors to book a strategy call from the site."
            checked={data.enableBookings}
            onChange={(v) => save('enableBookings', v)}
          />
          <Toggle
            label="Maintenance mode"
            description="Show a maintenance page to non-admin visitors."
            checked={data.maintenanceMode}
            onChange={(v) => save('maintenanceMode', v)}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <SettingsIcon className="h-4 w-4 text-brand-500" />
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{description}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onSave,
  saving,
  type = 'text',
}: {
  label: string;
  value: string;
  onSave: (v: string) => void | Promise<void>;
  saving: boolean;
  type?: string;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const dirty = v !== value;
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex-1 min-w-[200px]">
        <label className="label">{label}</label>
        <input
          className="input mt-1"
          type={type}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      </div>
      <button
        disabled={!dirty || saving}
        onClick={() => onSave(v)}
        className="btn-primary !py-2 !text-xs disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save</>}
      </button>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void | Promise<void>;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
