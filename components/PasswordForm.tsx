'use client';

import { useState } from 'react';
import { Loader2, Save, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!current || !next || !confirm) {
      toast.error('Fill in all fields');
      return;
    }
    if (next.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (next !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success('Password updated');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="h-4 w-4 text-brand-500" />
        <h3 className="font-display text-base font-semibold">Change password</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        Use a strong password you don&apos;t reuse anywhere else. You&apos;ll stay signed in on this device.
      </p>
      <div className="space-y-3">
        <PasswordField
          label="Current password"
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          autoComplete="current-password"
        />
        <PasswordField
          label="New password"
          value={next}
          onChange={setNext}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
          autoComplete="new-password"
        />
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary !py-2 !text-xs">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Update password</>}
        </button>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative mt-1">
        <input
          className="input pr-10"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
