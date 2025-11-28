/**
 * Stripe Type Definitions
 *
 * Provides TypeScript types for Stripe API responses and requests.
 * Ensures type safety when working with Stripe objects.
 */

/**
 * Stripe Checkout Session response
 */
export interface CheckoutSession {
  id: string;
  url: string | null;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  customer_details?: {
    email?: string;
    address?: {
      country?: string;
      postal_code?: string;
      state?: string;
      city?: string;
      line1?: string;
      line2?: string;
    };
  };
  customer_email?: string;
  mode: 'payment' | 'setup' | 'subscription';
  status: 'open' | 'complete' | 'expired';
}

/**
 * Stripe Product object
 */
export interface StripeProduct {
  id: string;
  name: string;
  type: 'good' | 'service';
  active: boolean;
  description?: string;
  default_price?: string;
  metadata?: Record<string, string>;
  created: number;
  updated: number;
}

/**
 * Stripe Line Item for checkout session
 */
export interface StripeLineItem {
  price: string;
  quantity: number;
}

/**
 * Stripe Checkout Session creation params
 */
export interface StripeCheckoutSessionParams {
  line_items: StripeLineItem[];
  mode: 'payment' | 'setup' | 'subscription';
  success_url: string;
  cancel_url: string;
  shipping_options?: Array<{
    shipping_rate_data: {
      display_name: string;
      type: 'fixed_amount';
      fixed_amount: {
        amount: number; // Amount in cents
        currency: string;
      };
    };
  }>;
}

/**
 * Stripe Price object
 */
export interface StripePrice {
  id: string;
  product: string;
  type: 'one_time' | 'recurring';
  unit_amount: number; // Amount in cents
  currency: string;
  recurring?: {
    interval: 'day' | 'month' | 'week' | 'year';
    interval_count: number;
  };
  active: boolean;
}

/**
 * Stripe Product creation params
 */
export interface StripeProductCreateParams {
  name: string;
  default_price_data?: {
    currency: string;
    unit_amount: number; // Amount in cents
  };
  description?: string;
  metadata?: Record<string, string>;
}
