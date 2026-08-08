import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserNavClient } from './UserNavClient';

export const metadata = { title: 'Dashboard · Neeoloft', robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard');
  if (session.user?.role === 'admin') redirect('/admin');
  return <UserNavClient>{children}</UserNavClient>;
}
