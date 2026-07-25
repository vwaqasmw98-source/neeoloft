'use client';

import { useState } from 'react';
import { LifeBuoy, Mail, MessageSquare, Loader2, Send } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import toast from 'react-hot-toast';

export function SupportClient() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Add a subject and a message');
      return;
    }
    setLoading(true);
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Dashboard user',
          subject,
          message,
          source: 'dashboard_support',
        }),
      });
      if (!r.ok) throw new Error('Failed to send');
      toast.success('Message sent — we will get back to you soon');
      setSubject('');
      setMessage('');
      setDone(true);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Support"
        description="Need help with your account or a feature? Send us a message."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="font-display text-lg font-semibold mb-1">Send a message</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            We typically reply within a few hours during business days.
          </p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="label">Subject</label>
              <input
                className="input mt-1"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What can we help with?"
                required
                disabled={done}
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input mt-1 min-h-[140px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the issue or question in detail…"
                required
                disabled={done}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              {done ? (
                <p className="text-xs text-emerald-600">
                  Thanks — we received your message and will reply soon.
                </p>
              ) : (
                <span />
              )}
              <button type="submit" disabled={loading || done} className="btn-primary !py-2 !text-xs">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send message</>}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-display text-base font-semibold flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-brand-500" /> Other ways to reach us
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@neeoloft.com" className="text-xs text-brand-500 hover:underline">
                    hello@neeoloft.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Live chat</p>
                  <p className="text-xs text-slate-500">Use the chat widget at the bottom of any page.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="card text-xs text-slate-500 dark:text-slate-400">
            <p>
              For security issues, please email{' '}
              <a href="mailto:security@neeoloft.com" className="text-brand-500 hover:underline">
                security@neeoloft.com
              </a>{' '}
              directly. We respond to security reports within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
