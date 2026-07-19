'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from '@/components/MotionWrapper';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/faq';
import { FAQJsonLd } from '@/components/JsonLd';

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="chip mx-auto">
            <HelpCircle className="h-3.5 w-3.5 text-brand-500" /> FAQ
          </div>
          <h2 className="mt-4 section-title">
            Frequently <span className="gradient-text">Asked</span> Questions
          </h2>
          <p className="mt-3 section-sub">
            Quick answers to what we get asked most. Don&apos;t see yours? Ask Aria in the chat.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="card !p-0 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base">{item.q}</span>
                  <span className="flex-shrink-0 h-7 w-7 rounded-full bg-brand-500/10 text-brand-500 grid place-items-center">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <FAQJsonLd items={FAQ_ITEMS} />
    </section>
  );
}
