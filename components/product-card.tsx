import Link from "next/link";
import { Product } from "@/lib/interface";

import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface ProductProps {
  product: Product;
}

export default async function ProductCard({ product }: ProductProps) {
  return (
    <Link className="group text-sm" href={`/product/${product.slug}`}>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-sm">
        <Image
          src={urlForImage(product.image)}
          alt={product.name}
          width={285}
          height={320}
          className="w-full h-full sm:h-80 md:h-96 lg:h-80 xl:h-96 object-cover object-center duration-300 hover:scale-105 ease-in-out"
        />
        <div className="pl-1">
          <h3 className="pt-3 text-[18px] font-semibold">{product.name}</h3>
          <p className="mt-1 font-base text-slate-600">{product.author}</p>
        </div>
      </div>
    </Link>
  );
}
