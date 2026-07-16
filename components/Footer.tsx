'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { SERVICES } from '@/lib/services';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 dark:border-slate-800/70 mt-24">
      <div className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">N</span>
              <span>Neeoloft</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              AI-first web & automation agency. We build businesses that sell 24/7.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="https://twitter.com/neeoloft" target="_blank" rel="noopener" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
              <a href="https://linkedin.com/company/neeoloft" target="_blank" rel="noopener" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="https://github.com/neeoloft" target="_blank" rel="noopener" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="GitHub"><Github className="h-4 w-4" /></a>
              <a href="mailto:hello@neeoloft.com" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Email"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="label mb-3">Top services</h4>
            <ul className="space-y-2 text-sm">
              {SERVICES.filter((s) => ['ai-agents', 'voice-agents', 'workflow-automation', 'web-dev', 'ecommerce', 'mobile-app'].includes(s.id)).map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="text-slate-600 dark:text-slate-400 hover:text-brand-500">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label mb-3">More</h4>
            <ul className="space-y-2 text-sm">
              {SERVICES.filter((s) => !['ai-agents', 'voice-agents', 'workflow-automation', 'web-dev', 'ecommerce', 'mobile-app'].includes(s.id)).slice(0, 8).map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="text-slate-600 dark:text-slate-400 hover:text-brand-500">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-brand-500">About</Link></li>
              <li><Link href="/portfolio" className="text-slate-600 dark:text-slate-400 hover:text-brand-500">Portfolio</Link></li>
              <li><Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-brand-500">Pricing</Link></li>
              <li><Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-500">Contact</Link></li>
              <li><Link href="/book" className="text-slate-600 dark:text-slate-400 hover:text-brand-500">Book a call</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Neeoloft. All rights reserved.</p>
          <p>Built with 🤖 AI • Next.js • Groq • MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
