'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from '@/components/MotionWrapper';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
            N
          </span>
          <span>Neeoloft</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition',
                pathname === l.href
                  ? 'text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/quote" className="hidden sm:inline-flex btn-primary !py-2 !text-xs">
            Get A Quote
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950"
        >
          <div className="container-x py-3 flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  pathname === l.href
                    ? 'text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                    : 'text-slate-600 dark:text-slate-300'
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Book a call
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
