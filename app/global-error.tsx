'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/global-error.tsx]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
            Critical error
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The application failed to load. Please refresh the page.
          </p>
          {error.digest && (
            <code className="mt-3 text-[11px] text-slate-400 block">digest: {error.digest}</code>
          )}
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all"
            style={{ background: 'linear-gradient(135deg, #3a5cff 0%, #22d3ee 100%)' }}
          >
            <RefreshCcw className="h-4 w-4" /> Reload
          </button>
        </div>
      </body>
    </html>
  );
}
