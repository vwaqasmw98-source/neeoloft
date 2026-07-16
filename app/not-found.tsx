import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-x min-h-[70vh] flex flex-col items-center justify-center text-center pt-32 pb-20">
      <p className="font-display text-7xl sm:text-9xl font-bold gradient-text">404</p>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The page you're looking for has moved, been deleted, or never existed.
      </p>
      <div className="mt-6 flex gap-2">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link href="/services" className="btn-ghost">
          <Search className="h-4 w-4" /> Browse services
        </Link>
      </div>
    </div>
  );
}
