'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
  planId: string;
  cycle: 'monthly' | 'yearly';
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
};

export default function CheckoutButton({ planId, cycle, variant = 'primary', children }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function go() {
    if (!session) {
      router.push(`/signup?redirect=/pricing&plan=${planId}&cycle=${cycle}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, cycle }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Checkout failed');
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={variant === 'primary' ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
