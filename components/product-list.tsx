import ProductCard from "./product-card";
import type { Product } from "@/lib/interface";

interface ProductListProps {
  products: Product[];
}

/**
 * Product list component
 * Renders a responsive grid of products using ProductCard component
 * Grid: 4 cols (xl), 3 cols (lg), 2 cols (md), 1 col (sm)
 * Shows empty state when no products found
 */
export function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
