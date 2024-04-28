import { client } from "@/sanity/lib/client";

import Link from "next/link";
import { Category } from "@/lib/interface";

// components
import Slider from "@/components/slider";
import ProductRow from "@/components/product-row";
import { urlForImage } from "@/sanity/lib/image";
import { Suspense } from "react";

// categories
async function getCategories() {
  const query = `*[_type == "category"]{
    "id": _id,
    "slug": slug.current,
    name,
    subtitle, 
    image
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const data: Category[] = await getCategories();

  return (
    <div>
      <Slider />
      <Suspense>
        <ProductRow title="New & Forthcoming Books" type="recent" />
      </Suspense>
      <ProductRow title="Best Selling Books" type="bestseller" />

      {/* CATEGORIES */}
      <section className="mb-8">
        <h1 className="py-6 text-2xl font-semibold text-center">Categories</h1>
        <div className="flex flex-col md:flex-row flex-wrap gap-2">
          {data?.map((category) => (
            <div
              key={category.id}
              className="h-32 grow bg-slate-200 rounded-md p-2 flex flex-col justify-center items-center cursor-pointer opacity-80"
              style={{
                backgroundImage: `url("${urlForImage(category.image)}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "brightness(0.8)",
              }}
            >
              <Link href={`/category/${category.slug}`}>
                <h2 className="text-center text-slate-50 font-extrabold text-2xl hover:scale-110 ease-in-out duration-300 capitalize">
                  {category.name}
                </h2>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="relative">
        <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-md"></div>{" "}
        {/* Background overlay */}
        <div className="rounded-lg flex flex-col items-center justify-center h-96 relative">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-950">
            Sign up for our newsletter
          </h2>
          <p className="mb-8 font-light text-gray-500 mx-auto">
            Stay up to date with new books and special offers.
          </p>
          <div>
            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label className="hidden mb-2 text-sm font-medium text-gray-950">
                  Email address
                </label>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  className="block p-3 pl-10 w-96 text-sm text-gray-950 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  required
                />
              </div>
              <div className="flex flex-row justify-center">
                <button
                  type="submit"
                  className="py-3 px-5 w-44 md:w-full text-sm font-medium text-center text-white bg-slate-900 rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
