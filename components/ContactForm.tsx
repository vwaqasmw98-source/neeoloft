'use client';

import { useState } from 'react';
import { motion } from '@/components/MotionWrapper';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import toast from 'react-hot-toast';

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    budget: '',
    timeline: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) {
      toast.error('Please add your name and a way to reach you');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'contact_form',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      toast.success('Got it! We will reach out within 24h 🚀');
    } catch {
      toast.error('Something went wrong. Try again or email hello@neeoloft.com');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-10"
      >
        <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-3 font-display text-xl font-bold">Thanks, {form.name.split(' ')[0]}!</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Your message is in. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setForm({ name: '', email: '', phone: '', service: '', message: '', budget: '', timeline: '' });
          }}
          className="mt-5 btn-ghost !py-2 !text-xs"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="card space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            className="input mt-1.5"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            type="email"
            className="input mt-1.5"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Phone / WhatsApp</label>
          <input
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="input mt-1.5"
            placeholder="+1 555 000 0000"
          />
        </div>
        <div>
          <label className="label">Service</label>
          <select
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            className="input mt-1.5"
          >
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.name}>
                {s.emoji} {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Budget (USD)</label>
          <select
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
            className="input mt-1.5"
          >
            <option value="">Not sure yet</option>
            <option value="500">&lt; $500</option>
            <option value="1500">$500 – $2,000</option>
            <option value="5000">$2,000 – $10,000</option>
            <option value="10000">$10,000+</option>
          </select>
        </div>
        <div>
          <label className="label">Timeline</label>
          <select
            value={form.timeline}
            onChange={(e) => update('timeline', e.target.value)}
            className="input mt-1.5"
          >
            <option value="">When do you want to start?</option>
            <option value="asap">ASAP</option>
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
            <option value="exploring">Just exploring</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Tell us about your project</label>
        <textarea
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          rows={4}
          className="input mt-1.5 resize-none"
          placeholder="What are you trying to build or fix? Any links, examples, or context that helps us understand."
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
    </motion.form>
  );
}
