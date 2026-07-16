'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@/components/MotionWrapper';
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles, Calculator, Mail, User, Phone } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

type Scope = 'small' | 'medium' | 'large';
type Timeline = 'urgent' | '1mo' | '3mo' | 'flexible';

const SCOPE_MULT: Record<Scope, { mult: number; label: string; desc: string }> = {
  small: { mult: 0.7, label: 'Small', desc: '1-3 features / pages' },
  medium: { mult: 1.0, label: 'Medium', desc: 'Standard scope (most projects)' },
  large: { mult: 1.6, label: 'Large', desc: 'Complex / enterprise' },
};

const TIMELINE_MULT: Record<Timeline, { mult: number; label: string; desc: string }> = {
  urgent: { mult: 1.25, label: 'ASAP', desc: '+25% rush fee' },
  '1mo': { mult: 1.0, label: '1 month', desc: 'Standard timeline' },
  '3mo': { mult: 0.92, label: '1-3 months', desc: '8% discount' },
  flexible: { mult: 0.85, label: 'Flexible', desc: '15% best-rate' },
};

const STEPS = ['Services', 'Scope', 'Timeline', 'Estimate', 'Get quote'] as const;

export function QuoteCalculator() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set(['web-dev']));
  const [scope, setScope] = useState<Scope>('medium');
  const [timeline, setTimeline] = useState<Timeline>('1mo');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selectedServices = useMemo(
    () => SERVICES.filter((s) => selected.has(s.id)),
    [selected]
  );

  const estimate = useMemo(() => {
    if (selectedServices.length === 0) {
      return { min: 0, max: 0, base: 0, adjusted: 0, scopeMult: 1, timelineMult: 1 };
    }
    const base = selectedServices.reduce((sum, s) => sum + s.startingPrice, 0);
    const sMult = SCOPE_MULT[scope].mult;
    const tMult = TIMELINE_MULT[timeline].mult;
    const adjusted = base * sMult * tMult;
    return {
      base,
      min: Math.round(adjusted * 0.85),
      max: Math.round(adjusted * 1.15),
      adjusted: Math.round(adjusted),
      scopeMult: sMult,
      timelineMult: tMult,
    };
  }, [selectedServices, scope, timeline]);

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function next() {
    if (step === 0 && selected.size === 0) {
      toast.error('Pick at least one service to continue');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!contact.name || !contact.email) {
      toast.error('Please add your name and email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone || undefined,
          service: selectedServices.map((s) => s.name).join(', '),
          requirement: `Quote request: ${selectedServices.length} service(s), ${scope} scope, ${timeline} timeline. Estimated range: $${estimate.min} – $${estimate.max}.`,
          source: 'quote_calculator',
          budget: estimate.adjusted,
          timeline: TIMELINE_MULT[timeline].label,
          metadata: {
            services: Array.from(selected),
            scope,
            timeline,
            estimateMin: estimate.min,
            estimateMax: estimate.max,
            estimateBase: estimate.adjusted,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success('Quote saved! Check your email or wait for our team to reach out 🚀');
    } catch {
      toast.error('Could not save. Email us at hello@neeoloft.com');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setSelected(new Set(['web-dev']));
    setScope('medium');
    setTimeline('1mo');
    setContact({ name: '', email: '', phone: '' });
    setDone(false);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12"
      >
        <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Thanks, {contact.name.split(' ')[0]}!</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Your quote request is saved. Estimated range:{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
          </span>
          . Our team will reach out within 24 hours with a detailed proposal.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <a href="/book" className="btn-primary !py-2.5 !text-sm">
            Book a call to discuss
          </a>
          <button onClick={reset} className="btn-ghost !py-2.5 !text-sm">
            New estimate
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-brand-gradient"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && <StepServices selected={selected} toggle={toggle} />}
          {step === 1 && <StepScope scope={scope} setScope={setScope} />}
          {step === 2 && <StepTimeline timeline={timeline} setTimeline={setTimeline} />}
          {step === 3 && (
            <StepEstimate
              services={selectedServices}
              scope={scope}
              timeline={timeline}
              estimate={estimate}
            />
          )}
          {step === 4 && (
            <StepContact contact={contact} setContact={setContact} estimate={estimate} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer nav */}
      <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200/70 dark:border-slate-800">
        <button
          onClick={back}
          disabled={step === 0}
          className="btn-ghost !py-2.5 !text-sm disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button onClick={next} className="btn-primary !py-2.5 !text-sm">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading || !contact.name || !contact.email}
            className="btn-primary !py-2.5 !text-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get my quote'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Services ─────────────────────────────────────────────
function StepServices({ selected, toggle }: { selected: Set<string>; toggle: (id: string) => void }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">What do you need?</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Pick one or more services. Multi-select — we'll combine them into a single proposal.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {SERVICES.map((s) => {
          const active = selected.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition ${
                active
                  ? 'bg-brand-500 text-white border-brand-500 shadow-glow'
                  : 'border-slate-200 dark:border-slate-700 hover:border-brand-500/50 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span>{s.emoji}</span>
              <span className="font-medium">{s.name}</span>
              {active && <Check className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        {selected.size} service{selected.size !== 1 ? 's' : ''} selected ·{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          starting total: {formatCurrency(
            SERVICES.filter((s) => selected.has(s.id)).reduce((sum, s) => sum + s.startingPrice, 0)
          )}
        </span>
      </p>
    </div>
  );
}

// ── Step 2: Scope ─────────────────────────────────────────────────
function StepScope({ scope, setScope }: { scope: Scope; setScope: (s: Scope) => void }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">How big is the project?</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Be honest — this affects effort and price. We'll fine-tune in the call.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {(Object.keys(SCOPE_MULT) as Scope[]).map((s) => {
          const cfg = SCOPE_MULT[s];
          const active = scope === s;
          return (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`card text-left transition ${
                active
                  ? 'border-brand-500 ring-2 ring-brand-500/30'
                  : 'hover:border-brand-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold">{cfg.label}</p>
                {active && <Check className="h-4 w-4 text-brand-500" />}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{cfg.desc}</p>
              <p className="mt-3 text-xs font-semibold text-brand-500">
                ×{cfg.mult} multiplier
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Timeline ─────────────────────────────────────────────
function StepTimeline({ timeline, setTimeline }: { timeline: Timeline; setTimeline: (t: Timeline) => void }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">When do you want to start?</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Faster = rush fee. Slower = discount.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(Object.keys(TIMELINE_MULT) as Timeline[]).map((t) => {
          const cfg = TIMELINE_MULT[t];
          const active = timeline === t;
          return (
            <button
              key={t}
              onClick={() => setTimeline(t)}
              className={`card text-left transition ${
                active ? 'border-brand-500 ring-2 ring-brand-500/30' : 'hover:border-brand-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold">{cfg.label}</p>
                {active && <Check className="h-4 w-4 text-brand-500" />}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{cfg.desc}</p>
              <p className="mt-2 text-xs font-semibold text-brand-500">×{cfg.mult} multiplier</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4: Estimate ─────────────────────────────────────────────
function StepEstimate({
  services,
  scope,
  timeline,
  estimate,
}: {
  services: Service[];
  scope: Scope;
  timeline: Timeline;
  estimate: { min: number; max: number; base: number; adjusted: number };
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Here's your estimate</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        This is a ballpark — exact quote after a 20-min call.
      </p>

      <div className="mt-6 card bg-brand-gradient text-white">
        <p className="text-xs uppercase tracking-widest text-white/70">Estimated range</p>
        <p className="mt-2 font-display text-3xl sm:text-4xl font-bold">
          {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
        </p>
        <p className="mt-1 text-sm text-white/85">
          Midpoint: {formatCurrency(estimate.adjusted)}
        </p>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
          Breakdown
        </h3>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1.5">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span>
                {s.emoji} {s.name}
              </span>
              <span className="font-mono text-slate-500">{formatCurrency(s.startingPrice)}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5 flex justify-between text-xs font-semibold">
            <span>Base total</span>
            <span className="font-mono">{formatCurrency(estimate.base)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Scope ({SCOPE_MULT[scope].label})</span>
            <span className="font-mono">×{SCOPE_MULT[scope].mult}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Timeline ({TIMELINE_MULT[timeline].label})</span>
            <span className="font-mono">×{TIMELINE_MULT[timeline].mult}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <span>Adjusted</span>
            <span className="font-mono">{formatCurrency(estimate.adjusted)}</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 italic">
          We add a ±15% range because every project has unknowns we discover together.
        </p>
      </div>
    </div>
  );
}

// ── Step 5: Contact ─────────────────────────────────────────────
function StepContact({
  contact,
  setContact,
  estimate,
}: {
  contact: { name: string; email: string; phone: string };
  setContact: (c: { name: string; email: string; phone: string }) => void;
  estimate: { min: number; max: number };
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Get your detailed quote</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        We'll email a custom proposal with timeline, milestones, and a fixed quote.
      </p>

      <div className="mt-5 space-y-3">
        <div>
          <label className="label flex items-center gap-1">
            <User className="h-3 w-3" /> Name *
          </label>
          <input
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            className="input mt-1.5"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="label flex items-center gap-1">
            <Mail className="h-3 w-3" /> Email *
          </label>
          <input
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            type="email"
            className="input mt-1.5"
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label className="label flex items-center gap-1">
            <Phone className="h-3 w-3" /> Phone / WhatsApp
          </label>
          <input
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="input mt-1.5"
            placeholder="+1 555 000 0000"
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-400 inline-flex items-start gap-2">
        <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          Your estimate: {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}. We'll
          send a precise quote within 24 hours.
        </span>
      </div>
    </div>
  );
}
