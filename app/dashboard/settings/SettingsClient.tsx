'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Loader2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export function SettingsClient() {
  const { data: session, update } = useSession();
  const [marketing, setMarketing] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      toast.success('Preferences saved');
      update();
    }, 400);
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Notification preferences and account controls."
      />

      <div className="card mb-4">
        <h3 className="font-display text-base font-semibold mb-1">Notifications</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose what you want to hear about.
        </p>
        <div className="space-y-3">
          <Toggle
            label="Marketing emails"
            description="Product news, tips, and special offers."
            checked={marketing}
            onChange={setMarketing}
          />
          <Toggle
            label="Product updates"
            description="When we ship a new feature or fix."
            checked={productUpdates}
            onChange={setProductUpdates}
          />
          <Toggle
            label="Security alerts"
            description="Sign-ins, password changes, and suspicious activity."
            checked={securityAlerts}
            onChange={setSecurityAlerts}
            disabled
            lockedNote="Required for account safety"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !text-xs">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? 'Saved' : 'Save preferences'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-display text-base font-semibold mb-1">Session</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          You&apos;re signed in as {session?.user?.email}.
        </p>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost !py-2 !text-xs">
          Sign out of this device
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  lockedNote,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  lockedNote?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
          {lockedNote && <span className="ml-1 text-slate-400">· {lockedNote}</span>}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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
