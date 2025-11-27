import { Product } from "@/lib/interface";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { assertEnv } from "@/lib/env";
import { logError } from "@/lib/logger";
import { checkoutRatelimit } from "@/lib/ratelimit";
import { validateCors, getCorsHeaders } from "@/lib/cors";

const stripe = new Stripe(assertEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-04-10",
});

// Zod validation schemas
const ProductSchema = z.object({
  _id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required").max(200),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  image: z.string().optional(),
  author: z.string().optional(),
  slug: z.any().optional(),
  category: z.any().optional(),
  publisher: z.any().optional(),
  bestseller: z.boolean().optional(),
  recent: z.boolean().optional(),
});

const CheckoutSchema = z.object({
  products: z.array(ProductSchema).min(1, "At least one product is required"),
});

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const availableProducts = checkProducts.data.filter(
    (product: any) => product.active === true
  );
  return availableProducts;
};

export const POST = async (request: NextRequest) => {
  // CORS validation
  if (!validateCors(request)) {
    return new NextResponse("CORS policy violation", { status: 403 });
  }

  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await checkoutRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please try again later." },
        { status: 429, headers: getCorsHeaders(request) }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = CheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    const { products } = validation.data;
    const origin = request.headers.get("origin");

    if (!origin) {
      return NextResponse.json(
        { error: "Request origin is required" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    let activeProducts = await getActiveProducts();

    // Create missing products in Stripe
    try {
      for (const product of products) {
        const stripeProduct = activeProducts?.find(
          (stripeProduct: any) =>
            stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
        );

        if (!stripeProduct) {
          await stripe.products.create({
            name: product.name,
            default_price_data: {
              unit_amount: Math.round(product.price * 100),
              currency: "eur",
            },
          });
        }
      }
    } catch (error) {
      logError("checkout-create-product", error);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500, headers: getCorsHeaders(request) }
      );
    }

    // Fetch updated products list
    activeProducts = await getActiveProducts();
    const stripeItems: any = [];

    for (const product of products) {
      const stripeProduct = activeProducts?.find(
        (prod: any) =>
          prod?.name?.toLowerCase() === product?.name?.toLowerCase()
      );

      if (stripeProduct) {
        stripeItems.push({
          price: stripeProduct?.default_price,
          quantity: product?.quantity,
        });
      }
    }

    if (stripeItems.length === 0) {
      return NextResponse.json(
        { error: "No valid products found for checkout" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: stripeItems,
      mode: "payment",
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Fixed Amount",
            type: "fixed_amount",
            fixed_amount: {
              amount: 450,
              currency: "eur",
            },
          },
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json(
      { url: session.url },
      { headers: getCorsHeaders(request) }
    );
  } catch (error) {
    logError("checkout", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
};

export const OPTIONS = async (request: NextRequest) => {
  return new NextResponse(null, {
    headers: getCorsHeaders(request),
  });
};
