import Link from "next/link";
import Stripe from "stripe";
import CheckoutSession from "@/components/checkout-session";
import { assertEnv } from "@/lib/env";
import { logError } from "@/lib/logger";

const stripe = new Stripe(assertEnv("STRIPE_SECRET_KEY"));

interface Props {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: Props) {
  try {
    const sessionId = searchParams?.session_id;

    // Validate session ID
    if (!sessionId || typeof sessionId !== "string") {
      return (
        <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Invalid session
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Unable to retrieve your order details. Please contact support.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    const customerDetails = checkoutSession?.customer_details;

    return (
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <CheckoutSession customerDetails={customerDetails} />
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
            <a href="#" className="text-sm font-semibold">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    logError("success-page", error);
    return (
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Error retrieving order
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            We encountered an error retrieving your order details. Please contact support.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
