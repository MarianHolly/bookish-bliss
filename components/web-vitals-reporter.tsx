'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals Reporter Component
 * Initializes Core Web Vitals monitoring for performance tracking
 *
 * Collects:
 * - LCP (Largest Contentful Paint): Time until largest visible element is painted
 * - FCP (First Contentful Paint): Time until first content appears
 * - CLS (Cumulative Layout Shift): Visual stability metric
 * - FID (First Input Delay): Responsiveness to user input
 * - TTFB (Time to First Byte): Server response time
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
