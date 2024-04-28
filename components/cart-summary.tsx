"use client";

import { useCart } from "@/context";
import { Button } from "./ui/button";

export default function CartSummary() {
  const { cart } = useCart();

  const subTotalAmount = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const totalAmount = subTotalAmount + 4.5;

  async function checkout() {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cart }),
      });

      if (!response.ok) {
        throw new Error("Failed to checkout");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-6 shadow-md sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">
            {subTotalAmount.toFixed(2)} Eur
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <dt className="flex items-center text-sm">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-sm font-medium">4.50 Eur </dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">{totalAmount.toFixed(2)} €</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button className="w-full" onClick={checkout}>
          Checkout
        </Button>
      </div>
    </section>
  );
}
