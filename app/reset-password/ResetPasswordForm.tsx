'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetPasswordFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const missingToken = useMemo(() => token.length < 32, [token]);

  useEffect(() => {
    if (missingToken) setError('Invalid or missing token');
  }, [missingToken]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (missingToken) {
      setError('Invalid or missing token');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      setSuccess(true);
      toast.success('Password reset — please sign in');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (missingToken) {
    return (
      <div className="min-h-screen pt-32 pb-16 container-x flex items-center justify-center">
        <div className="card w-full max-w-md">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="font-display text-xl font-bold">Invalid reset link</h1>
          </div>
          <div className="mt-4 rounded-xl border border-rose-200/70 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-900/20 p-4 text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <p className="text-slate-700 dark:text-slate-200">
              This password reset link is invalid or has expired. Request a new one to continue.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="btn-primary w-full mt-5 !py-2.5"
          >
            Request a new link
          </Link>
          <Link
            href="/login"
            className="mt-3 inline-flex w-full justify-center text-xs text-slate-500 hover:text-brand-500 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 container-x flex items-center justify-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="font-display text-xl font-bold">Set a new password</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose a strong password you don&apos;t reuse anywhere else.
        </p>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min. 8 characters)"
              className="w-full rounded-xl border bg-transparent pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              style={{ borderColor: 'var(--border)' }}
              autoComplete="new-password"
              disabled={success}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border bg-transparent pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              style={{ borderColor: 'var(--border)' }}
              autoComplete="new-password"
              disabled={success}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200/70 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-900/20 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Password reset — redirecting to sign in…</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="btn-primary w-full mt-5 !py-2.5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset password'}
        </button>

        <p className="text-xs text-center text-slate-500 mt-4">
          <Link href="/login" className="text-brand-500 hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function ResetPasswordForm() {
  // useSearchParams requires a Suspense boundary in app router.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-16 container-x flex items-center justify-center">
          <div className="card w-full max-w-md text-center text-sm text-slate-500">
            Loading…
          </div>
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
