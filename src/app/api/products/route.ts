import { NextResponse } from "next/server";
import { fetchProducts } from "../../../lib/products";

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
