import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-04-10",
});

export const POST = async (request: NextRequest) => {
  const { sessionId } = await request.json();
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "line_items.data.price.product"],
  });

  return NextResponse.json(checkoutSession);
};
