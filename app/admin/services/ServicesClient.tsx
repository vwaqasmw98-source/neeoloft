'use client';

import { useState, useMemo } from 'react';
import { Server, Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SERVICES } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';

export function ServicesClient() {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () =>
      SERVICES.filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.short.toLowerCase().includes(q.toLowerCase()) ||
          s.category.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div>
      <PageHeader
        title="Services"
        description="The service catalog that Aria (the AI agent) recommends, the pricing page sells, and the lead scorer matches against."
      />

      <div className="card mb-4 flex flex-wrap items-center gap-2 !py-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input pl-9"
            placeholder="Search services…"
          />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} of {SERVICES.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <div key={s.id} className="card flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center text-lg">
              {s.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold truncate">{s.name}</h3>
                <span className="chip text-[10px] capitalize">{s.category}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.short}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{s.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Starting at</span>
                <span className="text-sm font-semibold">{formatCurrency(s.startingPrice)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <Server className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
        <p>
          Services are defined in{' '}
          <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">lib/services.ts</code>
          {' '}— edit the file and redeploy. Aria, the pricing page, the lead scorer, and the public services page all read from this single source.
        </p>
      </div>
    </div>
  );
}
