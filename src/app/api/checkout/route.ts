import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdminClient } from "../../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getUserId(request: NextRequest): Promise<string | null> {
  if (!supabaseAdminClient) return null;
  const accessToken = request.cookies.get("sb-access-token")?.value;
  if (!accessToken) return null;
  const { data, error } = await supabaseAdminClient.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}

export async function POST(request: NextRequest) {
  if (!supabaseAdminClient) {
    return NextResponse.json(
      { error: "Server not configured." },
      { status: 503 },
    );
  }

  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch cart items with product details
  const { data: cartItems, error: cartError } = await supabaseAdminClient
    .from("Cart")
    .select("product_id, quantity, Product(product_name, price, image)")
    .eq("uuid", userId);

  if (cartError || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Clean up any stale "pending" orders for this user before creating a new one
  const { data: stalePending } = await supabaseAdminClient
    .from("Order")
    .select("id")
    .eq("uuid", userId)
    .eq("status", "pending");

  if (stalePending && stalePending.length > 0) {
    const staleIds = stalePending.map((o: { id: number }) => o.id);
    await supabaseAdminClient
      .from("OrderItem")
      .delete()
      .in("order_id", staleIds);
    await supabaseAdminClient
      .from("Order")
      .delete()
      .eq("uuid", userId)
      .eq("status", "pending");
  }

  // Calculate total
  const total = cartItems.reduce(
    (acc: number, item: any) =>
      acc + item.quantity * (item.Product?.price ?? 0),
    0,
  );

  // Create Order with "pending" status
  const { data: order, error: orderError } = await supabaseAdminClient
    .from("Order")
    .insert({ uuid: userId, total, status: "pending" })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }

  // Create OrderItem records
  const orderItemsPayload = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
  }));
  await supabaseAdminClient.from("OrderItem").insert(orderItemsPayload);

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  // Build Stripe line items — images must be absolute HTTPS URLs
  const lineItems = cartItems.map((item: any) => {
    const rawImage: string | undefined = item.Product?.image;
    const imageUrl =
      rawImage && rawImage.startsWith("http")
        ? rawImage
        : rawImage
          ? `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
          : undefined;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.Product?.product_name ?? "Product",
          ...(imageUrl ? { images: [imageUrl] } : {}),
        },
        unit_amount: Math.round((item.Product?.price ?? 0) * 100),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { orderId: String(order.id) },
  });

  return NextResponse.json({ url: session.url });
}
