import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { assertEnv } from "@/lib/env";
import { logError } from "@/lib/logger";
import { sessionRatelimit } from "@/lib/ratelimit";
import { validateCors, getCorsHeaders } from "@/lib/cors";

const stripe = new Stripe(assertEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-04-10",
});

export const POST = async (request: NextRequest) => {
  // CORS validation
  if (!validateCors(request)) {
    return new NextResponse("CORS policy violation", { status: 403 });
  }

  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await sessionRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: getCorsHeaders(request) }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    // Retrieve checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items.data.price.product"],
    });

    return NextResponse.json(
      {
        id: checkoutSession.id,
        status: checkoutSession.payment_status,
        customer_email: checkoutSession.customer_email,
        customer_details: checkoutSession.customer_details,
      },
      { headers: getCorsHeaders(request) }
    );
  } catch (error) {
    logError("session", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
};

export const OPTIONS = async (request: NextRequest) => {
  return new NextResponse(null, {
    headers: getCorsHeaders(request),
  });
};
