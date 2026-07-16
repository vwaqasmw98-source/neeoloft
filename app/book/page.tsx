import { SectionHeader } from '@/components/SectionHeader';
import { CTA } from '@/components/Hero';
import { BookingForm } from '@/components/BookingForm';

export const metadata = {
  title: 'Book a free strategy call',
  description:
    'Book a free 20-minute strategy call with Neeoloft. No pitch deck — we listen, ask the right questions, and recommend the highest-ROI next step for your business.',
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Book a free strategy call · Neeoloft',
    description:
      '20 minutes. No pitch. Real conversation about your business goals with an AI-first agency.',
    url: '/book',
    type: 'website',
  },
};

export default function BookPage() {
  return (
    <>
      <section className="section pt-32">
        <div className="container-x">
          <SectionHeader
            eyebrow="Book a call"
            title={
              <>
                20 minutes. <span className="gradient-text">Real conversation.</span>
              </>
            }
            subtitle="No pitch deck. We listen, ask the right questions, and recommend the highest-ROI next step for your business."
          />
          <div className="mt-12">
            <BookingForm />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
