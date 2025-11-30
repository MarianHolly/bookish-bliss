/**
 * Privacy Policy page
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-secondary">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Table of Contents
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="#introduction" className="text-accent hover:underline">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#information" className="text-accent hover:underline">
                2. Information We Collect
              </a>
            </li>
            <li>
              <a href="#usage" className="text-accent hover:underline">
                3. How We Use Information
              </a>
            </li>
            <li>
              <a href="#sharing" className="text-accent hover:underline">
                4. Information Sharing
              </a>
            </li>
            <li>
              <a href="#security" className="text-accent hover:underline">
                5. Data Security
              </a>
            </li>
            <li>
              <a href="#rights" className="text-accent hover:underline">
                6. Your Rights
              </a>
            </li>
            <li>
              <a href="#contact" className="text-accent hover:underline">
                7. Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section id="introduction">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Introduction
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Bookish Bliss (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website and app. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section id="information">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Information We Collect
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We collect several different types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>
                <strong>Account Information:</strong> Name, email, password, and address
              </li>
              <li>
                <strong>Order Information:</strong> Books purchased, order history, and preferences
              </li>
              <li>
                <strong>Payment Information:</strong> Processed securely through Stripe (we don&apos;t store credit card details)
              </li>
              <li>
                <strong>Usage Information:</strong> Pages visited, browsing patterns, device information
              </li>
              <li>
                <strong>Communication:</strong> Messages sent through contact forms
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="usage">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. How We Use Information
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We use collected information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Improve our website and user experience</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="sharing">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Information Sharing
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may share your information with service providers who assist in operating our website and conducting our business, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary mt-3">
              <li>
                <strong>Stripe:</strong> Payment processing (see Stripe&apos;s privacy policy)
              </li>
              <li>
                <strong>Sanity:</strong> Content management (see Sanity&apos;s privacy policy)
              </li>
              <li>
                <strong>Shipping Partners:</strong> Delivery service providers
              </li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-3">
              We do not sell or rent your personal information to third parties.
            </p>
          </section>

          {/* Section 5 */}
          <section id="security">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Data Security
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section id="rights">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Your Rights
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-3">
              To exercise these rights, please contact us using the information below.
            </p>
          </section>

          {/* Section 7 */}
          <section id="contact">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:{" "}
              <a href="mailto:privacy@bookishbliss.com" className="text-accent hover:underline">
                privacy@bookishbliss.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
