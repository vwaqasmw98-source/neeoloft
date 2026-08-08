
import { CTA } from '@/components/Hero';
import {
  ServiceJsonLd,
  BreadcrumbJsonLd,
} from '@/components/JsonLd';
import { SERVICES, SERVICE_CATEGORIES } from '@/lib/services';
import ServicesClient from './ServicesClient';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';

export const metadata = {
  title: 'Services · Neeoloft',
  description: `${SERVICES.length} services across web, eCommerce, AI, and automation. Pick one, mix many, or let us design a custom package.`,
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Services · Neeoloft',
    description: `${SERVICES.length} services across web, eCommerce, AI, and automation.`,
    url: '/services',
    type: 'website' as const,
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Service SEO Schema */}
      {SERVICES.map((service) => (
        <ServiceJsonLd
          key={`schema-${service.id}`}
          service={{
            name: service.name,
            description: service.description,
            startingPrice: service.startingPrice,
          }}
        />
      ))}

      {/* Breadcrumb SEO Schema */}
      <BreadcrumbJsonLd
        items={[
          {
            name: 'Home',
            url: SITE_URL,
          },
          {
            name: 'Services',
            url: `${SITE_URL}/services`,
          },
        ]}
      />

      <ServicesClient />

      <CTA />
    </>
  );
}

