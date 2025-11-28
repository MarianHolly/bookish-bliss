import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { Product } from "@/lib/interface";

interface CategoryProductCardProps {
  product: Product;
}

/**
 * Category product card component
 * Displays product in category page layout
 * Shows product image, title, author, and description
 */
export function CategoryProductCard({ product }: CategoryProductCardProps) {
  let imageUrl: string | undefined;

  if (product.image) {
    // Sanity Image type can be various forms, urlForImage handles them
    const builder = urlForImage(product.image as any) as any;
    imageUrl = builder?.url?.();
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <article className="p-3 m-2 shadow-xl rounded-md bg-slate-50 max-w-3/4 hover:shadow-2xl transition-shadow">
        <div className="flex flex-row gap-4 h-full items-center">
          <div className="flex-none">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`Cover of ${product.name}`}
                className="w-full h-52 md:h-64 object-cover object-center hover:scale-105 duration-300 rounded-sm"
              />
            )}
          </div>
          <div className="flex-auto">
            <h1 className="text-slate-900 font-bold text-lg lg:text-xl">
              {product.name}
            </h1>
            <h2 className="text-slate-700 font-semibold text-md lg:text-md mb-3">
              {product.author}
            </h2>
            <p className="text-slate-600 text-sm">{product.description}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
