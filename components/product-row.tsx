import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { Product } from "@/lib/interface";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { toBase64, shimmer } from "@/lib/image";

interface ProductRowProps {
  title: string;
  type: string;
}

async function getProducts({ type }: any) {
  const query = `*[_type == "product" && ${type} ] {
    "id": _id,
    "slug": slug.current,
    name,
    author, 
    image,
    bestseller, 
    recent
  }`;
  const data = await client.fetch(query);
  return data;
}

function Message({ message }: any) {
  return (
    <div className="w-full h-64 flex justify-center items-center">
      <h1 className="text-center text-3xl font-semibold">{message}</h1>
    </div>
  );
}

const ProductRow: React.FC<ProductRowProps> = async ({ title, type }) => {
  const products: Product[] = await getProducts({ type });

  return (
    <section>
      <h1 className="py-6 text-2xl font-semibold ml-3">{title}</h1>

      <div className="pl-3 relative flex flex-row gap-x-2 overflow-x-auto whitespace-nowrap py-3">
        <Suspense fallback={<Message message={`Loading`} />}>
          {products.length === 0 ? (
            <Message message={`Something went wrong...`} />
          ) : (
            products.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="mb-3"
              >
                <div className="flex-none w-44 h-64 rounded-sm py-4 px-2 inline-block hover:scale-105 ease-in-out duration-300 scroll-smooth cursor-pointer relative overflow-hidden">
                  <Image
                    src={urlForImage(product.image)}
                    alt={`Cover of ${product.name}`}
                    fill
                    className="object-cover rounded-sm"
                    sizes="(max-width: 640px) 100vw, 176px"
                    placeholder="blur"
                    blurDataURL={`data:image/webp;base64,${toBase64(
                      shimmer(176, 240)
                    )}`}
                    priority={index < 4}
                  />
                </div>

                <div className="w-44 px-1">
                  <h1 className="text-center text-md font-medium text-slate-700 overflow-hidden">
                    {product.name}
                  </h1>
                </div>
              </Link>
            ))
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default ProductRow;
