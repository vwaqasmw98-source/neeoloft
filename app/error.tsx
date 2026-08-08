'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error.tsx]', error);
  }, [error]);

  return (
    <div className="container-x min-h-[70vh] flex flex-col items-center justify-center text-center pt-32 pb-20">
      <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        A client-side error happened while rendering this page. This is usually fixed by
        refreshing — if it persists, the digest below helps us debug.
      </p>
      {error.digest && (
        <code className="mt-3 text-[11px] text-slate-400">digest: {error.digest}</code>
      )}
      <div className="mt-6 flex gap-2">
        <button onClick={reset} className="btn-primary !py-2.5 !text-sm">
          <RefreshCcw className="h-4 w-4" /> Try again
        </button>
        <Link href="/" className="btn-ghost !py-2.5 !text-sm">
          <Home className="h-4 w-4" /> Home
        </Link>
      </div>
    </div>
  );
}
