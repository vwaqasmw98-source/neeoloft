'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const r = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error('Request failed');
      setSubmitted(true);
      toast.success('Check your inbox');
    } catch (err) {
      toast.error('Something went wrong — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 container-x flex items-center justify-center">
      <div className="card w-full max-w-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="font-display text-xl font-bold">Forgot your password?</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the email associated with your account and we&apos;ll send a reset link.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20 p-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  If an account exists, we&apos;ve sent a reset link.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Check your inbox (and spam folder) for an email with a link to choose a new password.
                  The link expires in 1 hour.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border bg-transparent pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
                style={{ borderColor: 'var(--border)' }}
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-2.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
