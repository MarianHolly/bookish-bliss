import Link from "next/link";
import { BookOpen } from "lucide-react";

/**
 * 404 Not Found page
 * Displays when a page or resource is not found
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-6 px-4 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="text-6xl text-text-tertiary">404</div>
        </div>

        {/* Heading & Description */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">
            Page Not Found
          </h1>
          <p className="text-base text-text-secondary">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Link
            href="/"
            className="px-6 py-2.5 bg-accent text-accent-foreground rounded-md font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-2.5 border border-border rounded-md font-medium text-foreground hover:bg-muted transition-colors"
          >
            Browse Books
          </Link>
        </div>

        {/* Suggested Categories */}
        <div className="pt-8 border-t border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            Popular Categories
          </h3>
          <div className="space-y-2">
            <Link
              href="/products?category=fiction"
              className="block text-accent hover:underline text-sm"
            >
              Fiction Books
            </Link>
            <Link
              href="/products?category=poetry"
              className="block text-accent hover:underline text-sm"
            >
              Poetry
            </Link>
            <Link
              href="/products?category=essays"
              className="block text-accent hover:underline text-sm"
            >
              Essays
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
