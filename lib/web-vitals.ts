import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export type Metric = {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  id: string;
};

// Core Web Vitals thresholds (milliseconds)
export const THRESHOLDS = {
  LCP: 2500,      // Largest Contentful Paint - good: < 2.5s
  FCP: 1800,      // First Contentful Paint - good: < 1.8s
  CLS: 0.1,       // Cumulative Layout Shift - good: < 0.1
  FID: 100,       // First Input Delay - good: < 100ms
  TTFB: 600,      // Time to First Byte - good: < 600ms
};

// Performance budget thresholds
export const PERFORMANCE_BUDGETS = {
  LCP: 2000,      // Target: < 2.0s
  FCP: 1200,      // Target: < 1.2s
  CLS: 0.1,       // Target: < 0.1
  TTFB: 500,      // Target: < 500ms
  bundleSize: 510, // KB
};

export interface PerformanceMetrics {
  lcp?: Metric;
  fcp?: Metric;
  cls?: Metric;
  fid?: Metric;
  ttfb?: Metric;
}

/**
 * Send metrics to analytics or logging service
 * Customize this function to integrate with your analytics provider
 */
function sendMetricToAnalytics(metric: Metric) {
  // Example: Send to analytics service
  // You can replace this with your analytics provider
  // e.g., Google Analytics, Mixpanel, Amplitude, etc.

  if (typeof window !== 'undefined') {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value}ms`, {
        id: metric.id,
        rating: metric.rating,
      });
    }

    // Send to your analytics endpoint (if configured)
    // const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    // if (analyticsEndpoint) {
    //   fetch(analyticsEndpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(metric),
    //   }).catch(err => console.error('Analytics error:', err));
    // }
  }
}

/**
 * Check if metric exceeds performance budget
 */
export function checkPerformanceBudget(metric: Metric): boolean {
  const budgetKey = metric.name.toUpperCase() as keyof typeof PERFORMANCE_BUDGETS;
  const budget = PERFORMANCE_BUDGETS[budgetKey];

  if (budget === undefined) return true;

  return metric.value <= budget;
}

/**
 * Initialize Web Vitals monitoring
 * Call this function in your app layout to start collecting metrics
 */
export function initWebVitals() {
  // Only in browser environment
  if (typeof window === 'undefined') return;

  // Collect all Core Web Vitals
  onCLS(sendMetricToAnalytics);
  onFCP(sendMetricToAnalytics);
  onINP(sendMetricToAnalytics);
  onLCP(sendMetricToAnalytics);
  onTTFB(sendMetricToAnalytics);
}

/**
 * Get performance rating color
 */
export function getRatingColor(rating?: string): string {
  switch (rating) {
    case 'good':
      return 'text-green-600';
    case 'needs-improvement':
      return 'text-yellow-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metric: Metric): string {
  // For CLS, show the actual value
  if (metric.name === 'CLS') {
    return metric.value.toFixed(3);
  }
  // For time metrics, show in milliseconds
  return Math.round(metric.value).toString();
}
