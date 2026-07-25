'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Edit2, Trash2, X, Save, ShieldCheck } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

type Row = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  phone?: string;
  address?: string;
  lastLoginAt?: string;
  createdAt: string;
};

export function UsersClient() {
  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/users');
    const d = await r.json();
    setUsers(d.users || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()),
  );

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editing._id,
          name: editing.name,
          email: editing.email,
          role: editing.role,
          phone: editing.phone || null,
          address: editing.address || null,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success('User updated');
      setEditing(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(u: Row) {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    try {
      const r = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u._id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success('User deleted');
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform accounts, roles, and profile data."
      />

      <div className="card mb-4 flex flex-wrap items-center gap-2 !py-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input pl-9"
            placeholder="Search by name or email…"
          />
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-5 w-5" />}
          title="No users found"
          description="When someone signs up, they will appear here."
        />
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200/70 dark:border-slate-800 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`chip text-[10px] ${
                        u.role === 'admin' ? 'text-brand-600' : 'text-slate-500'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setEditing(u)}
                        className="p-2 text-slate-400 hover:text-brand-500"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => del(u)}
                        className="p-2 text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold">Edit user</h3>
              <button onClick={() => setEditing(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Name</label>
                <input
                  className="input mt-1"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input mt-1"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Role</label>
                  <select
                    className="input mt-1"
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value as Row['role'] })}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input mt-1"
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  className="input mt-1"
                  value={editing.address || ''}
                  onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-ghost !py-2 !text-xs">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="btn-primary !py-2 !text-xs">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
