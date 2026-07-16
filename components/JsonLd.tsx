/**
 * JSON-LD structured data components.
 * Each component renders a <script type="application/ld+json"> tag.
 * Helps Google show rich results (ratings, FAQ dropdowns, sitelinks, etc.)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';
const SITE_NAME = 'Neeoloft';
const SITE_DESC =
  'AI-first web & automation agency. Custom websites, AI chatbots, voice agents, and n8n automation that turn visitors into customers 24/7.';

type JsonLdProps = { data: Record<string, unknown> };

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------- Organization / WebSite ---------- */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        description: SITE_DESC,
        sameAs: [
          // Add real social URLs when available
          'https://twitter.com/neeoloft',
          'https://linkedin.com/company/neeoloft',
          'https://github.com/neeoloft',
        ].filter(Boolean),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'hello@neeoloft.com',
          availableLanguage: ['English', 'Urdu', 'Hindi', 'Arabic'],
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ['en', 'ur', 'hi', 'ar'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/* ---------- Services ---------- */
type ServiceInput = {
  name: string;
  description: string;
  startingPrice: number;
};

export function ServiceJsonLd({ service }: { service: ServiceInput }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        areaServed: 'Worldwide',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: service.startingPrice,
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'USD',
            minPrice: service.startingPrice,
          },
          availability: 'https://schema.org/InStock',
        },
      }}
    />
  );
}

/* ---------- FAQ ---------- */
type FAQItem = { q: string; a: string };

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      }}
    />
  );
}

/* ---------- Article / BlogPosting ---------- */
type ArticleInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  image?: string;
};

export function ArticleJsonLd({ article }: { article: ArticleInput }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        url: `${SITE_URL}/blog/${article.slug}`,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
          '@type': 'Organization',
          name: article.author || SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
        },
        image: article.image || `${SITE_URL}/og-default.png`,
        mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
      }}
    />
  );
}

/* ---------- Breadcrumb ---------- */
type Crumb = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: it.url,
        })),
      }}
    />
  );
}
