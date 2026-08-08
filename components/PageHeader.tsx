'use client';

import { motion } from './MotionWrapper';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex flex-wrap items-end justify-between gap-3 mb-6', className)}
    >
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  trend?: { dir: 'up' | 'down' | 'flat'; text: string };
}) {
  return (
    <div className="card !p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="label">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
          {hint && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                trend.dir === 'up' && 'text-emerald-600',
                trend.dir === 'down' && 'text-rose-600',
                trend.dir === 'flat' && 'text-slate-500',
              )}
            >
              {trend.text}
            </p>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="card text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-semibold">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
