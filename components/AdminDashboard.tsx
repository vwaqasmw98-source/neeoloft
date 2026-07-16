'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/components/MotionWrapper';
import {
  Users,
  Calendar,
  BookOpen,
  Settings,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { formatDate, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

type Lead = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  requirement?: string;
  message?: string;
  source?: string;
  score?: 'hot' | 'warm' | 'cold';
  createdAt: string;
};

type Booking = {
  _id: string;
  name: string;
  email: string;
  scheduledAt: string;
  status: string;
  service?: string;
  topic?: string;
  source?: string;
};

type KBItem = {
  _id: string;
  title: string;
  source: string;
  tags: string[];
  active: boolean;
  content: string;
  updatedAt: string;
};

type Tab = 'leads' | 'bookings' | 'kb' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'leads', label: 'Leads', icon: <Users className="h-4 w-4" /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4" /> },
  { id: 'kb', label: 'Knowledge base', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('leads');
  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-slate-200/70 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? 'border-brand-500 text-brand-600 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'leads' && <LeadsTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'kb' && <KBTab />}
          {tab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [score, setScore] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads
    .filter(
      (l) =>
        (filter === '' ||
          l.name.toLowerCase().includes(filter.toLowerCase()) ||
          (l.email || '').toLowerCase().includes(filter.toLowerCase()) ||
          (l.service || '').toLowerCase().includes(filter.toLowerCase())) &&
        (score === 'all' || l.score === score)
    )
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input pl-9"
            placeholder="Search leads…"
          />
        </div>
        <select
          value={score}
          onChange={(e) => setScore(e.target.value as 'all' | 'hot' | 'warm' | 'cold')}
          className="input w-auto"
        >
          <option value="all">All scores</option>
          <option value="hot">🔥 Hot</option>
          <option value="warm">🌡 Warm</option>
          <option value="cold">❄️ Cold</option>
        </select>
        <a
          href="/api/leads-export"
          className="btn-ghost !py-2.5 !text-xs"
          target="_blank"
          rel="noopener"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-10 text-sm text-slate-500">No leads yet.</div>
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200/70 dark:border-slate-800 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._id} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {l.email && <div>{l.email}</div>}
                    {l.phone && <div>{l.phone}</div>}
                  </td>
                  <td className="px-4 py-3">{l.service || '—'}</td>
                  <td className="px-4 py-3">
                    {l.score === 'hot' ? (
                      <span className="chip text-rose-600">🔥 Hot</span>
                    ) : l.score === 'warm' ? (
                      <span className="chip text-amber-600">🌡 Warm</span>
                    ) : (
                      <span className="chip">❄️ Cold</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{timeAgo(l.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-500">{l.source || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-10 text-sm text-slate-500">No bookings yet.</div>
      ) : (
        <div className="grid gap-3">
          {bookings.map((b) => (
            <div key={b._id} className="card flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{b.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.email}</p>
                {b.topic && <p className="text-xs mt-1">{b.topic}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatDate(b.scheduledAt)}</p>
                <span className="chip text-[10px] mt-1">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KBTab() {
  const [items, setItems] = useState<KBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', tags: '', source: 'text', url: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/kb');
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const r = await fetch('/api/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          source: form.source,
          url: form.url || undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!r.ok) throw new Error();
      toast.success('Saved!');
      setForm({ title: '', content: '', tags: '', source: 'text', url: '' });
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this source?')) return;
    await fetch(`/api/kb?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !py-2 !text-xs">
          <Plus className="h-4 w-4" /> Add source
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            placeholder="Title (e.g. Pricing FAQ)"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="input"
            >
              <option value="text">Plain text / Markdown</option>
              <option value="url">URL — fetch and extract</option>
              <option value="faq">FAQ (Q/A format)</option>
            </select>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="Tags (comma-separated)"
            />
          </div>
          {form.source === 'url' ? (
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input"
              placeholder="https://…"
            />
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className="input resize-none"
              placeholder="Paste your content here…"
            />
          )}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary !py-2 !text-xs">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost !py-2 !text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-10 text-sm text-slate-500">
          No KB sources yet. Add your first one above.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((i) => (
            <div key={i._id} className="card flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{i.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {i.source} • {i.tags.join(', ') || 'no tags'} • updated {timeAgo(i.updatedAt)}
                </p>
                <p className="text-xs mt-2 line-clamp-2 text-slate-500 dark:text-slate-400">
                  {i.content.slice(0, 200)}…
                </p>
              </div>
              <button
                onClick={() => del(i._id)}
                className="text-slate-400 hover:text-rose-500 p-2"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="card space-y-4">
      <div>
        <h3 className="font-semibold">Integrations status</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configured via env vars in <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">.env.local</code>
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <Integration label="Groq LLM" env="GROQ_API_KEY" />
        <Integration label="MongoDB" env="MONGODB_URI" />
        <Integration label="NextAuth" env="NEXTAUTH_SECRET" />
        <Integration label="Stripe" env="STRIPE_SECRET_KEY" />
        <Integration label="SMTP Email" env="SMTP_HOST" />
        <Integration label="Twilio WhatsApp" env="TWILIO_ACCOUNT_SID" />
        <Integration label="Slack webhook" env="SLACK_WEBHOOK_URL" />
        <Integration label="Discord webhook" env="DISCORD_WEBHOOK_URL" />
        <Integration label="Cal.com" env="NEXT_PUBLIC_CALCOM_EMBED_LINK" />
        <Integration label="Vapi" env="VAPI_API_KEY" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/70 dark:border-slate-800">
        Tip: features gracefully degrade when env vars are missing — the app never crashes.
      </p>
    </div>
  );
}

function Integration({ label, env }: { label: string; env: string }) {
  const enabled = Boolean(process.env[env]);
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 px-3 py-2">
      <span className="text-sm">{label}</span>
      <span
        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          enabled
            ? 'bg-emerald-500/10 text-emerald-600'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
        }`}
      >
        {enabled ? 'Active' : 'Not set'}
      </span>
    </div>
  );
}
