'use client';

import { motion } from '@/components/MotionWrapper';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        'max-w-3xl',
        className
      )}
    >
      {eyebrow && (
        <span className="chip mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="section-title mt-2">{title}</h2>
      {subtitle && <p className="mt-3 section-sub">{subtitle}</p>}
    </motion.div>
  );
}
