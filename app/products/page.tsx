import ProductCard from "@/components/product-card";
import ProductFilter from "@/components/product-filter";
import ProductSort from "@/components/product-sort";

import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { Product } from "@/lib/interface";

async function getProducts({ filter, order }: any) {
  const query = `*[_type == "product" ${filter} ] ${order} {
    "id": _id,
    "slug": slug.current,
    name,
    author, 
    price, 
    image,
    category[]-> {name, "slug": slug.current},
    publisher[]-> {name, "slug": slug.current},
    bestseller, 
    recent
  }`;

  const data = await client.fetch(query);

  return data;
}

interface Props {
  searchParams: {
    date?: string;
    price?: string;
    category?: string;
    publisher?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  // Receive Params
  const { date = "desc", price, category, publisher, search } = searchParams;

  // Sorting
  const priceOrder = price ? ` | order(price ${price})` : "";
  const dateOrder = date ? ` | order(_createdAt ${date})` : "";
  const order = `${priceOrder}`;

  // Filtering
  const categoryFilter = category
    ? ` && references(*[_type=="category" && slug.current == "${category}"]._id)`
    : "";
  const publisherFilter = publisher
    ? ` && references(*[_type=="publisher" && slug.current == "${publisher}"]._id)`
    : "";

  // Searching
  const searchFilter = search ? `&& name match "${search}"` : "";

  const filter = `${categoryFilter}${publisherFilter}${searchFilter}`;
  const products: Product[] = await getProducts({ filter, order });

  return (
    <div className="min-h-[65vh]">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-slate-100 opacity-30 rounded-lg"></div>
        <div className="rounded-lg flex flex-col items-center justify-center h-60 relative">
          <p className="mx-12 text-lg lg:text-xl text-slate-950 font-light text-center italic">
            Step into a world of literary wonders, where imagination knows no
            bounds and every story has the power to transport you to new and
            captivating realms.
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center justify-between border-b border-gray-200 pb-4 pt-6">
        {/* Number of Results */}
        <div className="w-full flex flex-row justify-between">
          <h2 className="text-center text-2xl font-semibold text-slate-500">
            {!products ? (
              "searching for results..."
            ) : (
              <p className="text-slate-950">
                {!products || products?.length === 0
                  ? "I didn't find any results"
                  : `${products?.length} result${
                      products?.length === 1 ? "" : "s"
                    }`}
              </p>
            )}
          </h2>
          {/* Sorting Products */}
          <ProductSort />
        </div>
        <section className="pb-24 pt-6">
          <div
            className={cn(
              "grid grid-cols-1 gap-x-8 gap-y-10",
              products?.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-[1fr_3fr]"
            )}
          >
            <div className="hidden lg:block">
              {/* Filters */}
              <ProductFilter />
            </div>
            <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-3 lg:col-span-3 lg:gap-x-4">
              {/* Product Grid */}
              {products?.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
