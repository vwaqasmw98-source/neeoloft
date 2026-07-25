'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Activity,
  Receipt,
  UserPlus,
  ArrowUpRight,
  Loader2,
  Quote,
} from 'lucide-react';
import { PageHeader, StatCard, EmptyState } from '@/components/PageHeader';
import { formatCurrency, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

type Stats = {
  totals: {
    users: number;
    leads: number;
    newLeads: number;
    bookings: number;
    subscriptions: number;
    activeSubscriptions: number;
    testimonials: number;
    revenue: number;
  };
  recentLeads: Array<{ _id: string; name: string; email?: string; service?: string; score?: string; source?: string; createdAt: string | Date }>;
  recentOrders: Array<{ _id: string; plan: string; cycle: string; status: string; amount: number; createdAt: string | Date }>;
  recentUsers: Array<{ _id: string; name: string; email: string; role: string; createdAt: string | Date; lastLoginAt?: string | Date }>;
  recentActivities: Array<{ _id: string; actor?: string; action: string; description?: string; createdAt: string | Date }>;
};

export function OverviewDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load stats');
        return r.json();
      })
      .then(setStats)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card text-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
      </div>
    );
  }

  const t = stats?.totals;
  return (
    <div>
      <PageHeader
        title="Overview"
        description="A quick snapshot of your business — leads, customers, revenue, and recent activity."
        actions={
          <a href="/api/leads-export" target="_blank" rel="noopener" className="btn-ghost !py-2 !text-xs">
            Export leads
          </a>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total users"
          value={t?.users ?? 0}
          icon={<Users className="h-5 w-5" />}
          hint="All registered accounts"
        />
        <StatCard
          label="Total leads"
          value={t?.leads ?? 0}
          icon={<Briefcase className="h-5 w-5" />}
          hint={`${t?.newLeads ?? 0} new in last 7 days`}
          trend={{ dir: 'up', text: `${t?.newLeads ?? 0} this week` }}
        />
        <StatCard
          label="Subscriptions"
          value={t?.subscriptions ?? 0}
          icon={<ShoppingCart className="h-5 w-5" />}
          hint={`${t?.activeSubscriptions ?? 0} active`}
        />
        <StatCard
          label="Revenue (active)"
          value={formatCurrency(t?.revenue ?? 0)}
          icon={<DollarSign className="h-5 w-5" />}
          hint="MRR + annualized yearly"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/70 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold">Recent leads</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest people who reached out</p>
            </div>
            <a href="/admin/leads" className="text-xs text-brand-500 hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {stats && stats.recentLeads.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {stats.recentLeads.map((l) => (
                <li key={l._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{l.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {l.email || l.source || '—'} {l.service ? `· ${l.service}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {l.score === 'hot' ? (
                      <span className="chip text-rose-600">🔥 Hot</span>
                    ) : l.score === 'warm' ? (
                      <span className="chip text-amber-600">🌡 Warm</span>
                    ) : (
                      <span className="chip">❄️ Cold</span>
                    )}
                    <span className="text-xs text-slate-500 hidden sm:inline">{timeAgo(l.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Briefcase className="h-5 w-5" />}
              title="No leads yet"
              description="Captured leads from the chatbot, contact form, and voice agent will show up here."
            />
          )}
        </div>

        <div className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/70 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold">Recent orders</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest subscriptions and checkouts</p>
            </div>
            <a href="/admin/orders" className="text-xs text-brand-500 hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {stats && stats.recentOrders.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {stats.recentOrders.map((o) => (
                <li key={o._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium capitalize">{o.plan} · {o.cycle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold">{formatCurrency(o.amount)}</span>
                    <span
                      className={`chip text-[10px] ${
                        o.status === 'active'
                          ? 'text-emerald-600'
                          : o.status === 'trialing'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Receipt className="h-5 w-5" />}
              title="No orders yet"
              description="Paid subscriptions and Stripe checkouts will appear here."
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/70 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold">Recent users</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Newest accounts on the platform</p>
            </div>
            <a href="/admin/users" className="text-xs text-brand-500 hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {stats && stats.recentUsers.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {stats.recentUsers.map((u) => (
                <li key={u._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span
                    className={`chip text-[10px] ${
                      u.role === 'admin' ? 'text-brand-600' : 'text-slate-500'
                    }`}
                  >
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<UserPlus className="h-5 w-5" />}
              title="No users yet"
              description="When someone signs up, they show up here."
            />
          )}
        </div>

        <div className="card !p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/70 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-semibold">Recent activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest admin and system events</p>
            </div>
          </div>
          {stats && stats.recentActivities.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {stats.recentActivities.map((a) => (
                <li key={a._id} className="px-4 py-3 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {a.description || a.actor || 'system'} · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Activity className="h-5 w-5" />}
              title="No activity yet"
              description="As admins make changes, you'll see them logged here."
            />
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Bookings" value={t?.bookings ?? 0} icon={<MessageSquare className="h-5 w-5" />} />
        <StatCard label="Testimonials" value={t?.testimonials ?? 0} icon={<Quote className="h-5 w-5" />} />
      </div>
    </div>
  );
}
