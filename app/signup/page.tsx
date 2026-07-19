'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 8) return toast.error('Use at least 8 characters');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || 'Failed');
      toast.success('Account created!');
      // Auto-login
      await signIn('credentials', { email, password, redirect: false });
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.message || 'Signup failed');
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
          <h1 className="font-display text-xl font-bold">Create your workspace</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Start your 7-day pilot. The first user becomes admin.
        </p>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border bg-transparent pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
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
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full rounded-xl border bg-transparent pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-5 !py-2.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
        </button>

        <p className="text-xs text-center text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}