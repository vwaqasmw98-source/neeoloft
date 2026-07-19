'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
    >
      <div className="container-x">
        <nav
          className={cn(
            'flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all',
            scrolled ? 'glass shadow-card' : 'bg-transparent',
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 blur-md opacity-70 bg-gradient-to-br from-brand-500 to-accent-400 rounded-lg" />
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Neeoloft
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      active ? 'text-brand-500' : 'hover:text-brand-500',
                    )}
                  >
                    {n.label}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(58,92,255,0.12), rgba(34,211,238,0.12))',
                          border: '1px solid rgba(58,92,255,0.25)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {status === 'authenticated' ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/admin" className="btn-ghost !py-2 !px-3 !text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-ghost !py-2 !px-3 !text-xs"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex btn-ghost !py-2 !px-3 !text-xs">
                  <LogIn className="h-3.5 w-3.5" /> Sign in
                </Link>
                <Link href="/contact" className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-xs">
                  Book a Demo
                </Link>
              </>
            )}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-2 glass rounded-2xl p-3 shadow-card"
            >
              <ul className="flex flex-col gap-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className={cn(
                        'block rounded-xl px-3 py-2 text-sm font-medium',
                        pathname === n.href
                          ? 'bg-brand-500/10 text-brand-500'
                          : 'hover:bg-black/5 dark:hover:bg-white/5',
                      )}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
                {status === 'authenticated' ? (
                  <>
                    <li>
                      <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5">
                        Create account
                      </Link>
                    </li>
                  </>
                )}
                <li className="pt-2">
                  <Link href="/contact" className="btn-primary w-full !py-2.5 !text-sm">
                    Book a Demo
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}