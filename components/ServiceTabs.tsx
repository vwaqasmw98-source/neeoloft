'use client';

import { useRef, useState } from 'react';

type Service = {
  id: string;
  name: string;
  category: string;
};

type ServiceTabsProps = {
  services: Service[];
  categories: { id: string; label: string }[];
};

export default function ServiceTabs({
  services,
  categories,
}: ServiceTabsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === 'right' ? 300 : -300,
      behavior: 'smooth',
    });
  };

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter(
          (service) => service.category === activeCategory
        );

  return (
    <div className="w-full">
      {/* =========================
          CATEGORY CAROUSEL
      ========================== */}
      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          aria-label="Previous categories"
          className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-[#3a5cff] hover:text-[#3a5cff] dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 md:flex"
        >
          ←
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scrollTabs('right')}
          aria-label="Next categories"
          className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:border-[#3a5cff] hover:text-[#3a5cff] dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 md:flex"
        >
          →
        </button>

        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 rounded-l-3xl bg-gradient-to-r from-white to-transparent dark:from-slate-950" />

        {/* Tabs Scroll Area */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex w-full min-w-0 gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-2 pl-14 pr-14 scroll-smooth dark:border-white/10 dark:bg-white/[0.03]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex w-max min-w-max gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`shrink-0 whitespace-nowrap rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#3a5cff] text-white shadow-lg shadow-[#3a5cff]/25'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 rounded-r-3xl bg-gradient-to-l from-white to-transparent dark:from-slate-950" />
      </div>

      {/* =========================
          SERVICES
      ========================== */}
      <div className="mt-10">
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3a5cff]/30 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
              >
                {/* Image */}
                <div className="mb-5 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80"
                    alt={service.name}
                    className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Service Icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">
                    {getServiceEmoji(service.category)}
                  </div>

                  <span className="rounded-full bg-[#3a5cff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3a5cff]">
                    {service.category}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold">
                  {service.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Professional {service.name.toLowerCase()} designed around
                  your business goals and growth.
                </p>

                <a
                  href={`/book?service=${service.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3a5cff] transition hover:gap-3"
                >
                  Get started
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-white/10">
            <p className="text-slate-500">
              No services found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getServiceEmoji(category: string) {
  const value = category.toLowerCase();

  if (value.includes('web')) return '🌐';
  if (value.includes('commerce')) return '🛍️';
  if (value.includes('design')) return '🎨';
  if (value.includes('ai')) return '🤖';
  if (value.includes('automation')) return '⚡';
  if (value.includes('mobile')) return '📱';
  if (value.includes('marketing')) return '📈';
  if (value.includes('branding')) return '✨';
  if (value.includes('data')) return '🛡️';
  if (value.includes('hosting')) return '☁️';

  return '🚀';
}
