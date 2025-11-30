/**
 * Terms & Conditions page
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-text-secondary">
            Effective date: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Use License
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on Bookish Bliss&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or &quot;mirroring&quot; the materials on any other server</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Disclaimer
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The materials on Bookish Bliss&apos;s website are provided on an &apos;as is&apos; basis. Bookish Bliss makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Limitations
            </h2>
            <p className="text-text-secondary leading-relaxed">
              In no event shall Bookish Bliss or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bookish Bliss&apos;s website.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The materials appearing on Bookish Bliss&apos;s website could include technical, typographical, or photographic errors. Bookish Bliss does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Links
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Bookish Bliss has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Bookish Bliss of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Modifications
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Bookish Bliss may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Governing Law
            </h2>
            <p className="text-text-secondary leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Contact Information
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms &amp; Conditions, please contact us at:{" "}
              <a href="mailto:legal@bookishbliss.com" className="text-accent hover:underline">
                legal@bookishbliss.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
