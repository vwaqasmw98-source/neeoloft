'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Download, Briefcase } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatDate, timeAgo } from '@/lib/utils';

type Lead = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  source?: string;
  score?: 'hot' | 'warm' | 'cold';
  budget?: number;
  createdAt: string;
};

export function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
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
        (q === '' ||
          l.name.toLowerCase().includes(q.toLowerCase()) ||
          (l.email || '').toLowerCase().includes(q.toLowerCase()) ||
          (l.service || '').toLowerCase().includes(q.toLowerCase())) &&
        (score === 'all' || l.score === score),
    )
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Everyone who has reached out — chatbot, contact form, voice agent."
        actions={
          <a href="/api/leads-export" target="_blank" rel="noopener" className="btn-ghost !py-2 !text-xs">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        }
      />

      <div className="card mb-4 flex flex-wrap items-center gap-2 !py-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input pl-9"
            placeholder="Search by name, email, service…"
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
      </div>

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No leads yet"
          description="When someone reaches out, they'll show up here."
        />
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200/70 dark:border-slate-800 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">When</th>
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
                  <td className="px-4 py-3 text-slate-500">{l.source || '—'}</td>
                  <td className="px-4 py-3 text-slate-500" title={formatDate(l.createdAt)}>
                    {timeAgo(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
