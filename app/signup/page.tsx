'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Signup failed');
      }
      const loginRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (loginRes?.error) throw new Error('Auto-login failed');
      toast.success('Welcome to Neeoloft! 🎉');
      router.push(search.get('redirect') || '/admin');
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x min-h-[80vh] flex items-center justify-center pt-20 pb-20">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-center">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center">
          First user becomes the admin
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="input"
            placeholder="Full name"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            required
            className="input"
            placeholder="Email"
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            required
            className="input"
            placeholder="Password (min 8 chars)"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
