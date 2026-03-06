import { NextRequest, NextResponse } from "next/server";
import { supabaseAdminClient } from "../../../lib/supabaseClient";

async function getUserId(request: NextRequest): Promise<string | null> {
  if (!supabaseAdminClient) return null;
  const accessToken = request.cookies.get("sb-access-token")?.value;
  if (!accessToken) return null;
  const { data, error } = await supabaseAdminClient.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}

// GET /api/cart — return all cart items for the current user
export async function GET(request: NextRequest) {
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

  const { data, error } = await supabaseAdminClient
    .from("Cart")
    .select("product_id, quantity, Product(product_name, price, image)")
    .eq("uuid", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
}

// POST /api/cart — add item (creates with qty 1, or increments by 1 if already in cart)
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { product_id } = body as { product_id?: number };
  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  const { data: existing } = await supabaseAdminClient
    .from("Cart")
    .select("quantity")
    .eq("uuid", userId)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdminClient
      .from("Cart")
      .update({ quantity: existing.quantity + 1 })
      .eq("uuid", userId)
      .eq("product_id", product_id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabaseAdminClient
      .from("Cart")
      .insert({ uuid: userId, product_id, quantity: 1 });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// PATCH /api/cart — set exact quantity; removes item if quantity <= 0
export async function PATCH(request: NextRequest) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { product_id, quantity } = body as {
    product_id?: number;
    quantity?: number;
  };
  if (!product_id || quantity === undefined) {
    return NextResponse.json(
      { error: "Missing product_id or quantity" },
      { status: 400 },
    );
  }

  if (quantity <= 0) {
    const { error } = await supabaseAdminClient
      .from("Cart")
      .delete()
      .eq("uuid", userId)
      .eq("product_id", product_id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabaseAdminClient
      .from("Cart")
      .update({ quantity })
      .eq("uuid", userId)
      .eq("product_id", product_id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// DELETE /api/cart — remove an item completely
export async function DELETE(request: NextRequest) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { product_id } = body as { product_id?: number };
  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  const { error } = await supabaseAdminClient
    .from("Cart")
    .delete()
    .eq("uuid", userId)
    .eq("product_id", product_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true }, { status: 200 });
}
