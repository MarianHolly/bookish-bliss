import Link from "next/link";
import { fetchProductsByCategory, fetchCategoryBySlug } from "@/lib/sanity-fetchers";
import { ProductList } from "@/components/product-list";
import { urlForImage } from "@/sanity/lib/image";

// ISR: Revalidate category pages every 60 seconds
// This caches the page and reduces API calls by ~80%
export const revalidate = 60;

interface Props {
  params: {
    slug: string;
  };
}

/**
 * Category page
 * Displays category header with breadcrumb navigation and product grid
 */
export default async function CategoryPage({ params }: Props) {
  const [category, products] = await Promise.all([
    fetchCategoryBySlug(params.slug),
    fetchProductsByCategory(params.slug),
  ]);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Category not found
        </h1>
        <p className="text-text-secondary mb-6">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products" className="text-accent hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-text-secondary">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Bookish Bliss
            </Link>
          </li>
          <li className="text-text-tertiary">/</li>
          <li>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
          </li>
          <li className="text-text-tertiary">/</li>
          <li className="text-foreground font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Hero Section */}
      <div
        className="relative w-full h-80 md:h-96 bg-cover bg-center rounded-lg mb-12 overflow-hidden"
        style={{
          backgroundImage: `url("${urlForImage(category.image)}")`,
        }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative flex flex-col items-center justify-center w-full h-full gap-3 px-6 md:px-12">
          <h1 className="text-center font-semibold text-3xl md:text-4xl capitalize text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-center text-base md:text-lg text-white/90 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <section className="pb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Books in {category.name}
        </h2>
        {products && products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              No products found in this category
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
