'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How long does shipping take?',
    answer:
      'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping times are calculated from the order date and exclude weekends and holidays.',
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for all items in original condition. Simply contact us with your order number and reason for return to initiate the process.',
  },
  {
    id: '3',
    question: 'Do you ship internationally?',
    answer:
      'Currently, we ship within the domestic market only. We&apos;re working on expanding our international shipping options soon!',
  },
  {
    id: '4',
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you&apos;ll receive an email with a tracking number. You can use this number to track your package on the carrier&apos;s website.',
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards through our secure Stripe payment gateway. All transactions are encrypted and secure.',
  },
  {
    id: '6',
    question: 'Can I cancel my order?',
    answer:
      'Orders can be cancelled within 24 hours of placement if they haven&apos;t shipped yet. Contact us immediately if you need to cancel.',
  },
  {
    id: '7',
    question: 'Is my personal information safe?',
    answer:
      'Yes, we take data security seriously. All personal and payment information is encrypted and protected. See our Privacy Policy for more details.',
  },
  {
    id: '8',
    question: 'Do you offer gift cards?',
    answer:
      'Gift cards are coming soon! In the meantime, you can always purchase books as gifts for someone special.',
  },
];

/**
 * FAQ Page with accordion-style collapsible questions
 */
export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary">
            Can&apos;t find the answer you&apos;re looking for? Feel free to{' '}
            <a href="/contact" className="text-accent hover:underline">
              contact us
            </a>
            .
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <h3 className="text-left font-medium text-foreground">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-text-secondary flex-shrink-0 transition-transform ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {openId === item.id && (
                <div className="px-6 py-4 border-t border-border bg-muted">
                  <p className="text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 p-8 bg-card border border-border rounded-lg text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Still need help?
          </h2>
          <p className="text-text-secondary mb-6">
            If you didn&apos;t find the answer you&apos;re looking for, our customer support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
