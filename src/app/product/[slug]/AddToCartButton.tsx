"use client";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  async function handleAddToCart() {
    if (status === "loading") return;
    setStatus("loading");

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Failed to add to cart");
      setStatus("idle");
      return;
    }

    setStatus("added");
    setTimeout(() => setStatus("idle"), 2000);
  }

  const label =
    status === "added"
      ? "Added!"
      : status === "loading"
        ? "Adding..."
        : "Add To Cart";

  return (
    <button
      onClick={handleAddToCart}
      disabled={status === "loading"}
      className={`brutal-cta-btn${status === "added" ? " brutal-added-btn" : ""}`}
    >
      {label}
    </button>
  );
}
