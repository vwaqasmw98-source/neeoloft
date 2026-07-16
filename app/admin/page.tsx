import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  return (
    <section className="section pt-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <a href="/api/leads-export" target="_blank" rel="noopener" className="btn-ghost !py-2 !text-xs">
            Export leads
          </a>
        </div>
        <AdminDashboard />
      </div>
    </section>
  );
}
