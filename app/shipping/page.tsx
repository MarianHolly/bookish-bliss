import Link from 'next/link';

/**
 * Shipping & Returns page
 */
export default function ShippingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Shipping &amp; Returns
          </h1>
          <p className="text-text-secondary">
            Learn about our shipping options and return policy
          </p>
        </div>

        {/* Shipping Section */}
        <div className="space-y-8 mb-12">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Shipping Information
            </h2>

            <div className="space-y-4">
              {/* Shipping Methods */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Shipping Methods
                </h3>
                <div className="space-y-3 text-text-secondary">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground">
                        Standard Shipping
                      </span>
                      <span className="text-accent">€4.50</span>
                    </div>
                    <p className="text-sm">
                      Delivery in 5-7 business days. Perfect for most orders.
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground">
                        Express Shipping
                      </span>
                      <span className="text-accent">€9.99</span>
                    </div>
                    <p className="text-sm">
                      Delivery in 2-3 business days. Rush orders available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Areas */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Delivery Areas
                </h3>
                <p className="text-text-secondary mb-3">
                  We currently ship to all domestic addresses. Orders are shipped from our warehouse within 1 business day of purchase.
                </p>
                <p className="text-sm text-text-tertiary">
                  <strong>Note:</strong> Orders placed on weekends or holidays will be processed the next business day.
                </p>
              </div>

              {/* Tracking */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Order Tracking
                </h3>
                <p className="text-text-secondary">
                  Once your order ships, you&apos;ll receive a shipping confirmation email with a tracking number. Use this number to monitor your package in real-time on the carrier&apos;s website.
                </p>
              </div>
            </div>
          </section>

          {/* Border Divider */}
          <div className="border-t border-border" />

          {/* Returns Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Return Policy
            </h2>

            <div className="space-y-4">
              {/* Return Eligibility */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Return Eligibility
                </h3>
                <p className="text-text-secondary mb-3">
                  You can return items within <strong>30 days</strong> of purchase if they:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Are in original, unread condition</li>
                  <li>Have all original packaging and materials</li>
                  <li>Include the receipt or proof of purchase</li>
                  <li>Haven&apos;t been damaged by customer misuse</li>
                </ul>
              </div>

              {/* Return Process */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  How to Return an Item
                </h3>
                <ol className="space-y-3 text-text-secondary">
                  <li>
                    <span className="font-medium text-foreground">1. Contact Us</span>
                    <p className="text-sm mt-1">
                      Email or visit our{' '}
                      <Link href="/contact" className="text-accent hover:underline">
                        contact page
                      </Link>{' '}
                      with your order number
                    </p>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      2. Get Return Authorization
                    </span>
                    <p className="text-sm mt-1">
                      We&apos;ll provide you with a return shipping label
                    </p>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      3. Ship the Item
                    </span>
                    <p className="text-sm mt-1">
                      Pack the item securely and use the provided shipping label
                    </p>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      4. Receive Refund
                    </span>
                    <p className="text-sm mt-1">
                      Once we receive and inspect the return, we&apos;ll process your refund
                    </p>
                  </li>
                </ol>
              </div>

              {/* Refund Timeline */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Refund Timeline
                </h3>
                <p className="text-text-secondary mb-3">
                  Here&apos;s what to expect:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>
                    <span className="font-medium text-foreground">
                      Inspection:
                    </span>{' '}
                    2-3 business days after we receive your return
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Approval:
                    </span>{' '}
                    You&apos;ll be notified via email if approved
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Processing:
                    </span>{' '}
                    3-5 business days to process the refund
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Receipt:
                    </span>{' '}
                    5-10 business days for the refund to appear in your account
                  </li>
                </ul>
              </div>

              {/* Non-Returnable Items */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Non-Returnable Items
                </h3>
                <p className="text-text-secondary">
                  The following items cannot be returned:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary mt-3">
                  <li>Digital or downloadable content</li>
                  <li>Damaged items due to customer misuse</li>
                  <li>Items without proof of purchase</li>
                  <li>Items returned after 30 days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Border Divider */}
          <div className="border-t border-border" />

          {/* Support Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-text-secondary mb-6">
              Have questions about shipping or returns? Our customer support team is happy to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-medium text-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="px-6 py-2.5 border border-border rounded-md font-medium text-center text-foreground hover:bg-muted transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
