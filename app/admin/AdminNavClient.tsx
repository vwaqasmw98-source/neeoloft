'use client';

import { DashboardLayout, ADMIN_NAV } from '@/components/DashboardLayout';

export function AdminNavClient({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout nav={ADMIN_NAV} title="Admin" subtitle="Neeoloft control center">
      {children}
    </DashboardLayout>
  );
}
