'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, Loader2, X, Save, Quote } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

type T = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
};

const blank: Omit<T, '_id' | 'createdAt'> = {
  name: '',
  role: '',
  company: '',
  avatar: '',
  content: '',
  rating: 5,
  active: true,
  featured: false,
};

export function TestimonialsClient() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState<Omit<T, '_id' | 'createdAt'> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/testimonials');
    const d = await r.json();
    setItems(d.testimonials || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    const data = editing ?? creating;
    if (!data) return;
    setSaving(true);
    try {
      const isCreate = !editing;
      const r = await fetch('/api/admin/testimonials', {
        method: isCreate ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: editing?._id,
          name: data.name,
          role: data.role || undefined,
          company: data.company || undefined,
          avatar: data.avatar || undefined,
          content: data.content,
          rating: data.rating,
          active: data.active,
          featured: data.featured,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success(isCreate ? 'Testimonial added' : 'Testimonial updated');
      setEditing(null);
      setCreating(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function del(t: T) {
    if (!confirm(`Delete testimonial from ${t.name}?`)) return;
    try {
      const r = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t._id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success('Testimonial deleted');
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Customer quotes shown on the marketing site. Toggle active/featured to control visibility."
        actions={
          <button onClick={() => setCreating({ ...blank })} className="btn-primary !py-2 !text-xs">
            <Plus className="h-4 w-4" /> Add testimonial
          </button>
        }
      />

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Quote className="h-5 w-5" />}
          title="No testimonials yet"
          description="Add your first customer quote to start building social proof."
          action={
            <button onClick={() => setCreating({ ...blank })} className="btn-primary !py-2 !text-xs">
              <Plus className="h-4 w-4" /> Add testimonial
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((t) => (
            <div key={t._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold truncate">{t.name}</h3>
                    {!t.active && <span className="chip text-[10px] text-slate-500">Hidden</span>}
                    {t.featured && <span className="chip text-[10px] text-brand-600">Featured</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {[t.role, t.company].filter(Boolean).join(' · ')}
                  </p>
                  <div className="mt-2 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < t.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(t)} className="p-2 text-slate-400 hover:text-brand-500" title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => del(t)} className="p-2 text-slate-400 hover:text-rose-500" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-4">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-2 text-[11px] text-slate-400">{formatDate(t.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold">
                {editing ? 'Edit testimonial' : 'New testimonial'}
              </h3>
              <button onClick={() => { setEditing(null); setCreating(null); }} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <TestimonialForm
              data={editing ?? creating!}
              onChange={(d) => (editing ? setEditing(d as T) : setCreating(d as Omit<T, '_id' | 'createdAt'>))}
            />
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setCreating(null); }} className="btn-ghost !py-2 !text-xs">
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

function TestimonialForm({
  data,
  onChange,
}: {
  data: T | Omit<T, '_id' | 'createdAt'>;
  onChange: (d: T | Omit<T, '_id' | 'createdAt'>) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Name</label>
        <input
          className="input mt-1"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Jane Doe"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Role</label>
          <input
            className="input mt-1"
            value={data.role || ''}
            onChange={(e) => onChange({ ...data, role: e.target.value })}
            placeholder="CEO"
          />
        </div>
        <div>
          <label className="label">Company</label>
          <input
            className="input mt-1"
            value={data.company || ''}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>
      </div>
      <div>
        <label className="label">Avatar URL (optional)</label>
        <input
          className="input mt-1"
          value={data.avatar || ''}
          onChange={(e) => onChange({ ...data, avatar: e.target.value })}
          placeholder="https://…"
        />
      </div>
      <div>
        <label className="label">Quote</label>
        <textarea
          className="input mt-1 min-h-[100px] resize-none"
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="What did the customer say about working with you?"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Rating</label>
          <select
            className="input mt-1"
            value={data.rating}
            onChange={(e) => onChange({ ...data, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="label">Active</label>
          <label className="mt-2 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.active}
              onChange={(e) => onChange({ ...data, active: e.target.checked })}
              className="h-4 w-4"
            />
            Show on site
          </label>
        </div>
        <div className="flex flex-col">
          <label className="label">Featured</label>
          <label className="mt-2 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => onChange({ ...data, featured: e.target.checked })}
              className="h-4 w-4"
            />
            Pin to top
          </label>
        </div>
      </div>
    </div>
  );
}
