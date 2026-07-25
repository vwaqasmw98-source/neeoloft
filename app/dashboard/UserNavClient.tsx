'use client';

import { DashboardLayout, USER_NAV } from '@/components/DashboardLayout';

export function UserNavClient({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout nav={USER_NAV} title="My account" subtitle="Manage your plan and settings">
      {children}
    </DashboardLayout>
  );
}
