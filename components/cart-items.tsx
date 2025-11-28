"use client";

import Link from "next/link";
import { useCart } from "@/context";

import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { toBase64, shimmer } from "@/lib/image";

export default function CartItems() {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity } =
    useCart();

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200 relative">
      <div className="absolute inset-0 bg-slate-100 opacity-70 rounded-lg"></div>

      {cart?.map((item) => (
        <div key={item.id} className="flex py-6 sm:py-10 relative m-1 ">
          <div className="shrink-0 pl-6">
            <Image
              src={urlForImage(item.image)}
              alt={item.name}
              width={200}
              height={250}
              className="h-36 w-full rounded-md border-2 border-slate-200 object-cover object-center"
              placeholder="blur"
              blurDataURL={`data:image/webp;base64,${toBase64(
                shimmer(200, 250)
              )}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div className="ml-4 sm:ml-6 flex flex-col justify-between pr-9 w-full">
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm ">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium text-lg md:text-xl"
                  >
                    {item.name}
                  </Link>
                </h3>
              </div>
              <p className="mt-1 text-sm md:text-md lg:text-lg font-medium">
                {item.price.toFixed(2)} €
              </p>
              <p className="mt-1 text-sm lg:text-md font-medium">
                Format: <strong>Paperback</strong>
              </p>
            </div>
            <div className="ml-auto">
              <div className="flex flex-row gap-2 items-center">
                <Button
                  variant="outline"
                  className="text-xl font-semibold"
                  onClick={() => incrementQuantity(item.id)}
                >
                  +
                </Button>
                <span className="mx-1 text-3lx">{item.quantity}</span>
                <Button
                  variant="outline"
                  className="text-xl font-semibold"
                  onClick={() => decrementQuantity(item.id)}
                >
                  -
                </Button>

                <Button
                  variant="destructive"
                  type="button"
                  className=""
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="text-white" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
