"use client";

import Link from "next/link";
import { Product } from "@/lib/interface";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { toBase64, shimmer } from "@/lib/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context";
import { useState } from "react";

interface ProductProps {
  product: Product;
}

/**
 * ProductCard component
 * Displays book with:
 * - Image (3:4 aspect ratio for books)
 * - Title & Author
 * - Price with € symbol
 * - Bestseller badge
 * - Add to cart button
 * - Hover effects
 */
export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group h-full flex flex-col">
      {/* Card Container */}
      <div className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col bg-card hover:scale-102 transition-transform duration-300">
        {/* Image Container - 3:4 aspect ratio for books */}
        <Link
          href={`/product/${product.slug}`}
          className="relative overflow-hidden bg-muted flex-shrink-0"
          style={{ aspectRatio: "3/4" }}
        >
          <Image
            src={urlForImage(product.image)}
            alt={product.name}
            fill
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
            placeholder="blur"
            blurDataURL={`data:image/webp;base64,${toBase64(
              shimmer(285, 380)
            )}`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Bestseller Badge */}
          {product.bestseller && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
              Bestseller
            </div>
          )}
        </Link>

        {/* Info Section */}
        <div className="flex flex-col flex-grow p-4">
          {/* Title & Author */}
          <Link
            href={`/product/${product.slug}`}
            className="flex-grow hover:opacity-70 transition-opacity"
          >
            <h3 className="text-sm font-semibold text-foreground line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              {product.author}
            </p>
          </Link>

          {/* Price & Button */}
          <div className="mt-4 flex items-end justify-between gap-2">
            <div className="text-lg font-bold text-accent">
              €{(product.price / 100).toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-accent text-accent-foreground hover:bg-blue-600 dark:hover:bg-blue-500"
              }`}
              title="Add to cart"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {addedToCart ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
