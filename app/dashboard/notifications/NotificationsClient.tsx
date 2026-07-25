'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

type N = {
  _id: string;
  type: 'order' | 'billing' | 'system' | 'security' | 'message';
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

const TYPE_META: Record<N['type'], { label: string; color: string }> = {
  order: { label: 'Order', color: 'text-emerald-600' },
  billing: { label: 'Billing', color: 'text-amber-600' },
  system: { label: 'System', color: 'text-slate-500' },
  security: { label: 'Security', color: 'text-rose-600' },
  message: { label: 'Message', color: 'text-brand-600' },
};

export function NotificationsClient() {
  const [items, setItems] = useState<N[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/account/notifications');
    const d = await r.json();
    setItems(d.notifications || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function markAll() {
    try {
      const r = await fetch('/api/account/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!r.ok) throw new Error('Failed');
      toast.success('All marked as read');
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function markOne(id: string) {
    try {
      await fetch('/api/account/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      load();
    } catch {
      // silent
    }
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Updates about your account, orders, and security."
        actions={
          unread > 0 ? (
            <button onClick={markAll} className="btn-ghost !py-2 !text-xs">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-5 w-5" />}
          title="No notifications yet"
          description="When something happens with your account, we'll let you know here."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.system;
            const inner = (
              <div className={`card !p-4 ${!n.read ? 'border-brand-500/40' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`chip text-[10px] ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-slate-500">{timeAgo(n.createdAt)}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-1 text-sm font-semibold">{n.title}</p>
                    {n.body && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>}
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markOne(n._id)}
                      className="text-xs text-slate-400 hover:text-brand-500 shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
            return (
              <li key={n._id}>
                {n.link ? (
                  <Link href={n.link} onClick={() => markOne(n._id)}>
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
