'use client';

import { useState } from 'react';
import { Calendar, Loader2, CheckCircle2, Clock, Mail, Phone, User, MessageSquare, Globe, Video, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from '@/components/MotionWrapper';

const TIMEZONES = [
  { id: 'PKT', label: 'Pakistan / Karachi (PKT, UTC+5)' },
  { id: 'GST', label: 'UAE / Dubai (GST, UTC+4)' },
  { id: 'IST', label: 'India / Mumbai (IST, UTC+5:30)' },
  { id: 'GMT', label: 'UK / London (GMT/BST)' },
  { id: 'EST', label: 'US / Eastern (EST)' },
  { id: 'PST', label: 'US / Pacific (PST)' },
];

const DURATIONS = [
  { value: 20, label: '20 min — quick intro' },
  { value: 45, label: '45 min — strategy deep dive' },
  { value: 60, label: '60 min — full audit + plan' },
];

export function BookingForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    scheduledAt: '',
    timezone: 'PKT',
    durationMinutes: 20,
    topic: '',
    service: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Default to next business day 10:00
  function setQuickSlot() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    const iso = d.toISOString().slice(0, 16);
    update('scheduledAt', iso);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.scheduledAt) {
      toast.error('Please add name, email, and preferred time');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website_form' }),
      });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      toast.success('Booking request received! 📅');
    } catch {
      toast.error('Could not save. Email us at hello@neeoloft.com instead.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12"
      >
        <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold">Request received!</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We&apos;ll confirm your slot via email within a few hours. If anything urgent, write
          to <a className="text-brand-500 underline" href="mailto:hello@neeoloft.com">hello@neeoloft.com</a>.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 chip">
          <ShieldCheck className="h-3.5 w-3.5" /> No payment required to book
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <div className="card lg:col-span-3">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Book your free strategy call</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              20 minutes. No pitch. Real conversation.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full name *
              </label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="input"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email *
              </label>
              <input
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                type="email"
                className="input"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone / WhatsApp
              </label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input"
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Timezone
              </label>
              <select
                value={form.timezone}
                onChange={(e) => update('timezone', e.target.value)}
                className="input"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Preferred date & time *
              </label>
              <input
                value={form.scheduledAt}
                onChange={(e) => update('scheduledAt', e.target.value)}
                type="datetime-local"
                className="input"
                required
              />
              <button
                type="button"
                onClick={setQuickSlot}
                className="mt-1.5 text-[11px] text-brand-500 hover:underline"
              >
                Use tomorrow 10:00 AM
              </button>
            </div>
            <div>
              <label className="label mb-1.5 inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Duration
              </label>
              <select
                value={form.durationMinutes}
                onChange={(e) => update('durationMinutes', Number(e.target.value))}
                className="input"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label mb-1.5 inline-flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> What do you want to discuss?
            </label>
            <textarea
              value={form.topic}
              onChange={(e) => update('topic', e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="e.g. I run a skincare brand, want an AI chatbot for WhatsApp, and a Shopify theme refresh…"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center !py-3.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending request…
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" /> Request this slot
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
            We&apos;ll confirm by email within a few hours. No spam, no commitment.
          </p>
        </form>
      </div>

      {/* Side info */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card">
          <h4 className="font-display text-base font-bold">What to expect</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>We listen first — no scripted pitch.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>You leave with one clear next step, even if we don&apos;t work together.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Calls are 20 min by default. Pick longer if you want a deeper audit.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Free. No card. No obligation.</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-lg bg-accent-500/10 text-accent-500">
              <Video className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-display text-base font-bold">Video call</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Meet link sent on confirmation
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-brand-gradient text-white border-0">
          <p className="font-display text-base font-bold">Prefer to talk now?</p>
          <p className="mt-1 text-sm text-white/85">
            Our AI assistant Aria is online 24/7. Click the chat bubble — try voice mode too.
          </p>
        </div>
      </div>
    </div>
  );
}
