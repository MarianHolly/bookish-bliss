"use client";

import { useEffect } from "react";
import Stripe from "stripe";
import { useCart } from "@/context";

interface Props {
  customerDetails: Stripe.Checkout.Session.CustomerDetails | null;
}

export default function CheckoutSession({ customerDetails }: Props) {
  const { resetCart } = useCart();

  useEffect(() => {
    if (customerDetails) {
      resetCart();
    }
  }, [customerDetails]);

  if (!customerDetails) {
    return (
      <>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-red-600 sm:text-5xl">
          No checkout session found
        </h1>
      </>
    );
  }

  return (
    <div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-lime-500 dark:text-lime-400 sm:text-5xl">
        Order Successful!
      </h1>
      <h3 className="mt-8 text-2xl leading-7">
        Thank you,{" "}
        <span className="font-extrabold">{customerDetails.name}</span>!
      </h3>
      <p className="mt-8">
        Check your purchase email{" "}
        <span className="mx-1 font-extrabold text-indigo-500">
          {customerDetails.email}
        </span>{" "}
        for your invoice.
      </p>
    </div>
  );
}
