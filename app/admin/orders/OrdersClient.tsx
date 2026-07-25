'use client';

import { useEffect, useState } from 'react';
import { Loader2, Receipt } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

type Sub = {
  _id: string;
  plan: 'starter' | 'growth' | 'agency';
  cycle: 'monthly' | 'yearly';
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
};

const PLAN_AMOUNT: Record<string, { monthly: number; yearly: number }> = {
  starter: { monthly: 49, yearly: 490 },
  growth: { monthly: 149, yearly: 1490 },
  agency: { monthly: 499, yearly: 4990 },
};

export function OrdersClient() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load orders');
        return r.json();
      })
      .then((d) => setSubs(d.orders || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every subscription and checkout on the platform — active, trialing, canceled, and past due."
      />

      {loading ? (
        <div className="card text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
        </div>
      ) : subs.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="No orders yet"
          description="When customers pay for a package, the order shows up here."
        />
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200/70 dark:border-slate-800 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Renews</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => {
                const amt = PLAN_AMOUNT[s.plan];
                const value = amt ? (s.cycle === 'yearly' ? amt.yearly : amt.monthly) : 0;
                return (
                  <tr key={s._id} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-4 py-3 font-medium capitalize">{s.plan}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{s.cycle}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(value)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`chip text-[10px] ${
                          s.status === 'active'
                            ? 'text-emerald-600'
                            : s.status === 'trialing'
                              ? 'text-blue-600'
                              : s.status === 'canceled'
                                ? 'text-rose-600'
                                : 'text-amber-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.currentPeriodEnd ? formatDate(s.currentPeriodEnd) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(s.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
