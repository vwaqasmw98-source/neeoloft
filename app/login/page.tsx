'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error('Wrong email or password');
      } else {
        toast.success('Welcome back!');
        router.push(search.get('callbackUrl') || '/admin');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x min-h-[80vh] flex items-center justify-center pt-20 pb-20">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-center">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center">
          Log in to your Neeoloft dashboard
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="input"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="input"
            placeholder="Password"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
