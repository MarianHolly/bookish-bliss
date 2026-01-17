import { Suspense } from "react";
import { fetchProducts, fetchCategories } from "@/lib/sanity-fetchers";
import { ProductSearchFilter } from "@/components/product-search-filter";
import { ProductSort } from "@/components/product-sort";
import { ProductList } from "@/components/product-list";
import { cn } from "@/lib/utils";

// ISR: Revalidate products page every 60 seconds
// This caches the page and reduces API calls by ~80%
export const revalidate = 60;

interface Props {
  searchParams: {
    date?: string;
    price?: string;
    category?: string;
    publisher?: string;
    search?: string;
  };
}

/**
 * Products page
 * Displays filtered and sorted product catalog
 * Supports filtering by category and publisher, searching by name
 */
export default async function ProductsPage({ searchParams }: Props) {
  const { category, publisher, search } = searchParams;

  // Fetch all data in parallel
  const [products, categories] = await Promise.all([
    fetchProducts(category, publisher, search),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-[65vh]">
      {/* Hero Section */}
      <section className="mb-12 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Explore Our Collection
          </h1>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
            Discover thousands of carefully curated books across all genres and categories
          </p>
        </div>
      </section>

      {/* Results & Sort Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {products?.length === 0
              ? "No products found"
              : `${products?.length} result${products?.length === 1 ? "" : "s"}`}
          </h2>
        </div>
        <ProductSort />
      </div>

      {/* Filters + Products Grid */}
      <section className="pb-24">
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            products?.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-[1fr_3fr]"
          )}
        >
          <aside className="hidden lg:block">
            <Suspense>
              <ProductSearchFilter categories={categories} />
            </Suspense>
          </aside>
          <main className={products?.length > 0 ? "lg:col-span-3" : ""}>
            <ProductList products={products} />
          </main>
        </div>
      </section>
    </div>
  );
}
