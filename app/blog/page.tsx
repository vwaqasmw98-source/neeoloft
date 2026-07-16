import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import { BLOG_POSTS } from '@/lib/blog';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Blog · AI, automation & growth playbooks',
  description:
    'Practical guides, case studies, and playbooks on AI chatbots, voice agents, workflow automation, and modern web development — from the Neeoloft team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Neeoloft Blog — AI, automation & growth playbooks',
    description: 'Practical guides from the Neeoloft team on AI, automation, and modern web dev.',
    url: '/blog',
    type: 'website',
  },
};

const FEATURED = BLOG_POSTS.filter((p) => p.featured).slice(0, 3);
const REST = BLOG_POSTS.filter((p) => !p.featured);

export default function BlogIndex() {
  return (
    <>
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Resources"
            title={
              <>
                AI, automation <span className="gradient-text">& growth playbooks.</span>
              </>
            }
            subtitle="Practical guides, case studies, and frameworks — written by the team that ships AI products every week."
          />

          {/* Featured */}
          {FEATURED.length > 0 && (
            <div className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                Featured
              </h2>
              <div className="grid gap-5 lg:grid-cols-3">
                {FEATURED.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="card group hover:border-brand-500/50 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="chip !text-[10px] !py-0.5 bg-brand-500/10 text-brand-500 border-brand-500/20">
                        {p.category}
                      </span>
                      <span className="text-slate-500 inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {p.readingMinutes} min
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-brand-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-500">
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All posts */}
          <div className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 inline-flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" /> All articles
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[...FEATURED, ...REST].map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card group hover:border-brand-500/50 transition-all"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="chip !text-[10px] !py-0.5">{p.category}</span>
                    <span className="text-slate-500 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.readingMinutes} min
                    </span>
                    <span className="text-slate-500">· {new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug group-hover:text-brand-500 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
