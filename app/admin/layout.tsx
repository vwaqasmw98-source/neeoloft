import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminNavClient } from './AdminNavClient';

export const metadata = { title: 'Admin · Neeoloft', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/admin');
  if (session.user?.role !== 'admin') redirect('/dashboard');
  return <AdminNavClient>{children}</AdminNavClient>;
}
