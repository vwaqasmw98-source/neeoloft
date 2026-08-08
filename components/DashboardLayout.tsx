'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Server,
  Quote,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  User as UserIcon,
  Receipt,
  CreditCard,
  Bell,
  LifeBuoy,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** exact-match this entry; default false (uses startsWith) */
  exact?: boolean;
  /** Hide from sidebar but keep page reachable */
  hidden?: boolean;
};

type Props = {
  nav: NavItem[];
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function DashboardLayout({ nav, title, subtitle, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const visible = nav.filter((n) => !n.hidden);
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const onLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="card !p-3 sticky top-24">
              <div className="px-2 py-3 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold leading-tight">{title}</p>
                    {subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
              <nav className="flex flex-col gap-0.5">
                {visible.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-4 w-4 items-center justify-center',
                          active ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200',
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                      {active && (
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-xs font-semibold">
                      {(session?.user?.name || session?.user?.email || '?').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">
                        {session?.user?.name || 'Account'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-slate-400 transition-transform',
                        menuOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card overflow-hidden"
                      >
                        <Link
                          href="/"
                          className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Home className="h-3.5 w-3.5" /> Back to site
                        </Link>
                        <button
                          type="button"
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile bar */}
          <div className="lg:hidden">
            <div className="card !p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold leading-tight">{title}</p>
                  {subtitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
            <AnimatePresence>
              {open && (
                <motion.nav
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card !p-3 mb-4 overflow-hidden"
                >
                  <div className="flex flex-col gap-0.5">
                    {visible.map((item) => {
                      const active = isActive(item.href, item.exact);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium',
                            active
                              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60',
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      );
                    })}
                    <button
                      type="button"
                      onClick={onLogout}
                      className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Main */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

/** Standard nav definitions for each role. */
export const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
  { href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  { href: '/admin/leads', label: 'Leads', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/admin/orders', label: 'Orders', icon: <Receipt className="h-4 w-4" /> },
  { href: '/admin/packages', label: 'Packages', icon: <Package className="h-4 w-4" /> },
  { href: '/admin/services', label: 'Services', icon: <Server className="h-4 w-4" /> },
  { href: '/admin/testimonials', label: 'Testimonials', icon: <Quote className="h-4 w-4" /> },
  { href: '/admin/settings', label: 'Site settings', icon: <Settings className="h-4 w-4" /> },
  { href: '/admin/profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> },
  { href: '/admin/security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
];

export const USER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
  { href: '/dashboard/orders', label: 'Orders', icon: <Receipt className="h-4 w-4" /> },
  { href: '/dashboard/billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> },
  { href: '/dashboard/security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
  { href: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { href: '/dashboard/support', label: 'Support', icon: <LifeBuoy className="h-4 w-4" /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];
