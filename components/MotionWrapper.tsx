'use client';

/**
 * Safe re-exports of framer-motion to ensure RSC compatibility.
 *
 * Why this file exists:
 * When a Server Component imports a Client Component that uses framer-motion,
 * the bundler can sometimes fail to resolve `motion.div` etc. references
 * from the React Client Manifest. Centralizing the motion imports here:
 *   1) Makes every motion-using file implicitly a client component (via this file).
 *   2) Gives us one place to swap implementations if needed.
 *
 * Usage in any file:
 *   import { motion, AnimatePresence } from '@/components/MotionWrapper';
 */
export { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
