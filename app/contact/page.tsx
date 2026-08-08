import { SectionHeader } from '@/components/SectionHeader';
import { ContactForm } from '@/components/ContactForm';
import { CTA } from '@/components/Hero';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with Neeoloft — AI-first web & automation agency. Email, WhatsApp, or book a free strategy call.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact · Neeoloft',
    description: 'Email, WhatsApp, or book a free strategy call with the Neeoloft team.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Contact', url: `${SITE_URL}/contact` },
        ]}
      />
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Contact"
            title={
              <>
                Let's talk about <span className="gradient-text">your project</span>
              </>
            }
            subtitle="Pick the channel that suits you. We reply to all serious inquiries within 24 hours."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                detail="hello@neeoloft.com"
                href="mailto:hello@neeoloft.com"
              />
              <ContactCard
                icon={<MessageCircle className="h-5 w-5" />}
                title="WhatsApp"
                detail="Chat with our team"
                href="https://wa.me/911234567890"
              />
              <ContactCard
                icon={<MapPin className="h-5 w-5" />}
                title="Headquarters"
                detail="Remote-first · serving clients in 15+ countries"
              />
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  href?: string;
}) {
  const content = (
    <div className="card flex items-start gap-3 hover:border-brand-500/50 transition">
      <div className="h-10 w-10 grid place-items-center rounded-lg bg-brand-500/10 text-brand-500">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <p className="mt-1 text-sm font-medium">{detail}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener">
        {content}
      </a>
    );
  }
  return content;
}
