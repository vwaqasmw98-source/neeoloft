import './../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { Toaster } from 'react-hot-toast';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neeoloft.com';
const SITE_NAME = 'Neeoloft';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Neeoloft — AI-first web & automation agency',
    template: '%s · Neeoloft',
  },
  description:
    'Custom websites, AI chatbots, voice agents, and n8n automation that turn visitors into customers — even when you sleep. AI-first agency for ambitious businesses.',
  keywords: [
    'AI agency',
    'AI chatbot',
    'voice AI agent',
    'workflow automation',
    'n8n automation',
    'Next.js development',
    'Laravel development',
    'eCommerce development',
    'web agency',
    'AI automation Pakistan',
    'AI agency Dubai',
  ],
  authors: [{ name: 'Neeoloft', url: SITE_URL }],
  creator: 'Neeoloft',
  publisher: 'Neeoloft',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Neeoloft — AI-first web & automation agency',
    description:
      'We build businesses that sell 24/7 with AI — websites, chatbots, voice agents, and automation.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Neeoloft — AI-first web & automation agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neeoloft — AI-first web & automation agency',
    description: 'We build businesses that sell 24/7 with AI.',
    images: ['/og-default.png'],
    creator: '@neeoloft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.svg' },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafc' },
    { media: '(prefers-color-scheme: dark)', color: '#070a16' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ChatbotWidget />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgb(15 23 42)',
                  color: 'white',
                  border: '1px solid rgb(30 41 59)',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
