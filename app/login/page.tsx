'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const r = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (r?.error) throw new Error('Invalid email or password');
      toast.success('Welcome back!');
      router.push(callbackUrl);
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 container-x flex items-center justify-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="font-display text-xl font-bold">Sign in to Neeoloft</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back. Continue to your dashboard.
        </p>

        <div className="mt-6 space-y-3">
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
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border bg-transparent pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-5 !py-2.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </button>

        <p className="text-xs text-center text-slate-500 mt-4">
          New here?{' '}
          <Link href="/signup" className="text-brand-500 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}