import ProductCard from "./product-card";
import type { Product } from "@/lib/interface";

interface ProductListProps {
  products: Product[];
}

/**
 * Product list component
 * Renders a grid of products using ProductCard component
 * Shows empty state when no products found
 */
export function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-4"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
