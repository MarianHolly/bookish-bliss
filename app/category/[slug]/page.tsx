import { fetchProductsByCategory, fetchCategoryBySlug } from "@/lib/sanity-fetchers";
import { CategoryProductCard } from "@/components/category-product-card";
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
 * Displays category header and product listings for that category
 */
export default async function CategoryPage({ params }: Props) {
  const [category, products] = await Promise.all([
    fetchCategoryBySlug(params.slug),
    fetchProductsByCategory(params.slug),
  ]);

  if (!category) {
    return <div className="p-8 text-center">Category not found</div>;
  }

  return (
    <div>
      {/* Category Hero Section */}
      <div
        className="h-80 w-full bg-cover rounded-md"
        style={{
          backgroundImage: `url("${urlForImage(category.image)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.8)",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-full gap-2 px-6 md:px-12">
          <h1 className="text-center font-semibold text-xl md:text-3xl capitalize text-white">
            {category.name}
          </h1>
          {category.description && (
            <h2 className="text-center font-light text-md md:text-xl text-white">
              {category.description}
            </h2>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="flex flex-col gap-1 [&>*:nth-child(even)]:mr-24 [&>*:nth-child(odd)]:ml-24 py-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">
            No products found in this category
          </p>
        )}
      </div>
    </div>
  );
}
