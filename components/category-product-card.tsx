import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { toBase64, shimmer } from "@/lib/image";
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
  return (
    <Link href={`/product/${product.slug}`}>
      <article className="p-3 m-2 shadow-xl rounded-md bg-slate-50 max-w-3/4 hover:shadow-2xl transition-shadow">
        <div className="flex flex-row gap-4 h-full items-center">
          <div className="flex-none relative w-40 h-52 md:w-48 md:h-64">
            <Image
              src={urlForImage(product.image)}
              alt={`Cover of ${product.name}`}
              fill
              className="object-cover object-center hover:scale-105 duration-300 rounded-sm"
              placeholder="blur"
              blurDataURL={`data:image/webp;base64,${toBase64(
                shimmer(160, 208)
              )}`}
              sizes="(max-width: 768px) 160px, 192px"
            />
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
