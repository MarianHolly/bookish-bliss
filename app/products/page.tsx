import { Suspense } from "react";
import { fetchProducts, fetchCategories } from "@/lib/sanity-fetchers";
import { ProductSearchFilter } from "@/components/product-search-filter";
import { ProductSort } from "@/components/product-sort";
import { ProductList } from "@/components/product-list";
import { cn } from "@/lib/utils";

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
      <section className="relative mb-6">
        <div className="absolute inset-0 bg-slate-100 opacity-30 rounded-lg"></div>
        <div className="rounded-lg flex flex-col items-center justify-center h-60 relative">
          <p className="mx-12 text-lg lg:text-xl text-slate-950 font-light text-center italic">
            Step into a world of literary wonders, where imagination knows no
            bounds and every story has the power to transport you to new and
            captivating realms.
          </p>
        </div>
      </section>

      {/* Results Header */}
      <div className="flex flex-col items-center justify-between border-b border-gray-200 pb-4 pt-6 mb-6">
        <div className="w-full flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-950">
            {products?.length === 0
              ? "No products found"
              : `${products?.length} result${products?.length === 1 ? "" : "s"}`}
          </h2>
          <ProductSort />
        </div>
      </div>

      {/* Filters + Products Grid */}
      <section className="pb-24 pt-6">
        <div
          className={cn(
            "grid grid-cols-1 gap-x-8 gap-y-10",
            products?.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-[1fr_3fr]"
          )}
        >
          <aside className="hidden lg:block">
            <Suspense>
              <ProductSearchFilter categories={categories} />
            </Suspense>
          </aside>
          <main className="lg:col-span-3">
            <ProductList products={products} />
          </main>
        </div>
      </section>
    </div>
  );
}
