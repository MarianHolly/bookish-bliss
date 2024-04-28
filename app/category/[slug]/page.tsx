import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import { Category, Product } from "@/lib/interface";

interface Props {
  params: {
    slug: string;
  };
}

interface ProductProps {
  product: Product;
}

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    h5: ({ children }: any) => (
      <h5 className="text-center font-medium mb-3 text-sm md:text-md">
        {children}
      </h5>
    ),
    normal: ({ children }: any) => <p className="mb-1">{children}</p>,
  },
};

async function getCategory({ params }: Props) {
  const query = `*[_type == "category" && slug.current == "${params.slug}"][0]{
    "id": _id,
    "slug": slug.current,
    name,
    subtitle, 
    image, 
    body
    }`;
  const data = await client.fetch(query);
  return data;
}

async function getProducts({ params }: Props) {
  const query = `*[_type == "product"  && references(*[_type=="category" && slug.current == "${params.slug}"]._id)][0..6] {
    "id": _id,
    "slug": slug.current,
    name, 
    author, 
    image, 
    body
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function CategoryPage({ params }: Props) {
  const category: Category = await getCategory({ params });
  const products: Product[] = await getProducts({ params });

  return (
    <div>
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
            {category.subtitle}
          </h1>
          <h2 className="text-center font-light text-md md:text-xl text-white">
            {category.description}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-1 [&>*:nth-child(even)]:mr-24 [&>*:nth-child(odd)]:ml-24">
        {/* Example Products in Category */}
        {products?.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function CategoryProductCard({ product }: ProductProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <article className="p-3 m-2 shadow-xl rounded-md bg-slate-50 max-w-3/4">
        <div className="flex flex-row gap-4 h-full items-center">
          <div className="flex-none">
            <img
              src={urlForImage(product.image)}
              alt="Image of Book"
              className="w-full h-52 md:h-64 object-cover object-center hover:scale-105 duration-300 rounded-sm"
            />
          </div>
          <div className="flex-auto">
            <h1 className="text-slate-900 font-bold text-lg lg:text-xl">
              {product.name}
            </h1>
            <h2 className="text-slate-700 font-semibold text-md lg:text-md mb-3">
              {product.author}
            </h2>
            <div className="h-48 overflow-hidden relative text-xs lg:text-sm">
              <PortableText
                value={product.body}
                components={myPortableTextComponents}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
