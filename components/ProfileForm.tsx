'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  role?: string;
};

export function ProfileForm() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/account/profile')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load profile');
        return r.json();
      })
      .then((d) => setData(d.user))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const r = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success('Profile updated');
      setData(d.user);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="card text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-lg font-semibold">
          {(data.name || data.email || '?').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">{data.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{data.email}</p>
          {data.role && (
            <span className="chip text-[10px] mt-1 capitalize">{data.role}</span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Full name</label>
            <input
              className="input mt-1"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input mt-1"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Phone (optional)</label>
          <input
            className="input mt-1"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+1 555 0123"
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input mt-1"
            value={data.address || ''}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            placeholder="Street, city, country"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary !py-2 !text-xs">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save changes</>}
        </button>
      </div>
    </div>
  );
}
