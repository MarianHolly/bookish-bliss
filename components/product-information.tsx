"use client";

import Link from "next/link";
import { useCart } from "@/context";
import { Button } from "./ui/button";

import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import { Product } from "@/lib/interface";

interface ProductInformationProps {
  product: Product;
}

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    h5: ({ children }: any) => (
      <h5 className="text-center font-medium my-4 text-[18px]">{children}</h5>
    ),
    normal: ({ children }: any) => (
      <p className="text-base mb-1 text-[15px]">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <p className="text-right my-2 font-light">{children}</p>
    ),
  },
};

const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  const { cart, addToCart, incrementQuantity } = useCart();

  const isProductInCart = cart.some((item) => item.id === product.id);

  const getProductQuantityInCart = (
    cart: Product[],
    product: Product
  ): number => {
    const matchingItems = cart.filter((item) => item.id === product.id);
    const totalQuantity = matchingItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    return totalQuantity;
  };

  const quantity = getProductQuantityInCart(cart, product);

  return (
    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
        {product.name}
      </h1>

      <h1 className="mt-3 text-lg lg:text-xl tracking-tight text-slate-600 font-light">
        by{" "}
        <Link href="#">
          <span className="text-xl lg:text-2xl font-semibold hover:text-slate-800 hover:cursor-pointer">
            {product.author}
          </span>
        </Link>
      </h1>

      {/* SHOPPING */}
      <div className="mt-6 flex flex-col">
        <div className="ml-auto">
          <h2 className="mt-2 ml-2 text-3xl font-bold">
            {product?.price.toFixed(2)} €
          </h2>
        </div>

        <div className="mt-4">
          <div className="flex justify-center items-center gap-y-2 flex-col">
            {isProductInCart ? (
              <Button
                type="button"
                onClick={() => incrementQuantity(product.id)}
                className="w-2/3 bg-lime-500 py-6 text-base font-medium text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                Book is Already in Cart ({quantity})
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => addToCart(product)}
                className="w-2/3 bg-lime-600 py-6 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-8">
        <h3 className="my-2 font-bold text-xl text-slate-600 dark:text-slate-200 ml-auto">
          Description
        </h3>
        <PortableText
          value={product.body}
          components={myPortableTextComponents}
        />
      </div>
    </div>
  );
};

export default ProductInformation;
