"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type CartProduct = { product_name: string; price: number; image: string };
type CartItem = {
  product_id: number;
  quantity: number;
  Product: CartProduct | null;
};

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  function calcTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => {
      return acc + item.quantity * (item.Product?.price ?? 0);
    }, 0);
  }

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => {
        if (r.status === 401) {
          setAuthed(false);
          return null;
        }
        setAuthed(true);
        return r.json();
      })
      .then((cartData: CartItem[] | null) => {
        if (!cartData) return;
        setCartItems(cartData);
        setTotal(calcTotal(cartData));
      });
  }, []);

  async function handleCheckout() {
    if (cartItems.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
        setCheckingOut(false);
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
      setCheckingOut(false);
    }
  }

  async function updateQuantity(product_id: number, newQty: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, quantity: newQty }),
    });
    if (!res.ok) return;
    const updated =
      newQty <= 0
        ? cartItems.filter((item) => item.product_id !== product_id)
        : cartItems.map((item) =>
            item.product_id === product_id
              ? { ...item, quantity: newQty }
              : item,
          );
    setCartItems(updated);
    setTotal(calcTotal(updated));
  }

  if (authed === null) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="relative z-10 border-4 border-[#FDCB84] px-12 py-8 shadow-[8px_8px_0_#FDCB84]">
          <p className="font-hero text-[#FDCB84] text-3xl tracking-[0.3em] uppercase">
            Loading Arsenal...
          </p>
        </div>
      </div>
    );
  }

  if (authed === false) {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
          <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
              LOCKED VAULT
            </h1>
          </div>
          <p className="font-hero text-white/50 text-xl tracking-[0.3em] uppercase">
            You need to be logged in to access your arsenal.
          </p>
          <Link href="/login" className="brutal-cta-btn">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
          <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
              Empty Arsenal
            </h1>
          </div>
          <p className="font-hero text-white/50 text-xl tracking-[0.3em] uppercase">
            Your cartel has no weapons yet.
          </p>
          <Link href="/product" className="brutal-cta-btn">
            Shop the Arsenal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Texture + accents */}
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
          <div className="border-4 border-[#FDCB84] px-8 py-3 shadow-[6px_6px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-4xl tracking-[0.4em] uppercase">
              Your Arsenal
            </h1>
          </div>
          <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
        </div>

        <div className="flex flex-col xl:flex-row gap-10 items-start">
          {/* ── Order Summary (LEFT, sticky) ── */}
          <div className="xl:w-90 w-full sticky top-8 border-4 border-[#FDCB84] bg-black shadow-[8px_8px_0_#FDCB84] p-7 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
              <span className="font-hero text-[#FDCB84] text-xl tracking-[0.4em] uppercase">
                Receipt
              </span>
              <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-start gap-2 border-b border-[#FDCB84]/15 pb-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-hero text-white/80 text-base leading-tight truncate">
                      {item.Product?.product_name}
                    </p>
                    <p className="font-hero text-white/30 text-xs tracking-widest mt-0.5">
                      ×{item.quantity}
                    </p>
                  </div>
                  <span className="font-hero text-[#FDCB84] text-base shrink-0">
                    ${(item.quantity * (item.Product?.price ?? 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Grand total */}
            <div className="border-t-2 border-[#FDCB84] pt-5 flex justify-between items-end">
              <span className="font-hero text-white/60 text-lg tracking-widest uppercase">
                Grand Total
              </span>
              <span className="font-hero text-[#FDCB84] text-3xl">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              disabled={checkingOut || cartItems.length === 0}
              className="brutal-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:animation-none mt-2"
            >
              {checkingOut ? "Redirecting..." : "Proceed to Checkout"}
            </button>

            {/* Continue shopping */}
            <Link
              href="/product"
              className="font-hero text-white/30 hover:text-[#FDCB84] text-sm tracking-[0.3em] uppercase text-center transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Cart Items (RIGHT, scrollable) ── */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
            {cartItems.map((item, idx) => (
              <div
                key={item.product_id}
                className="relative flex flex-row items-center gap-6 border-2 border-[#FDCB84]/40 bg-black/60 px-6 py-5 shadow-[4px_4px_0_#FDCB84] hover:border-[#FDCB84] hover:shadow-[6px_6px_0_#FDCB84] transition-all duration-150"
              >
                {/* Item number tag */}
                <div className="absolute -top-3 -left-3 bg-[#FDCB84] px-2 py-0.5">
                  <span className="font-hero text-black text-xs tracking-widest">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Product image */}
                <div className="shrink-0 w-24 h-24 flex items-center justify-center">
                  <img
                    src={item.Product?.image}
                    alt={item.Product?.product_name}
                    className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(253,203,132,0.2)]"
                  />
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="font-hero text-[#FDCB84] text-2xl leading-tight truncate">
                    {item.Product?.product_name}
                  </p>
                  <p className="font-hero text-white/50 text-base tracking-widest mt-1">
                    ${item.Product?.price}{" "}
                    <span className="text-xs">USD / ea</span>
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <span className="font-hero text-white/40 text-xs tracking-[0.3em] uppercase">
                    Qty
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      className="cart-qty-btn"
                    >
                      −
                    </button>
                    <span className="font-hero text-[#FDCB84] text-xl w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="cart-qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="shrink-0 text-right min-w-24">
                  <p className="font-hero text-white/30 text-xs tracking-widest uppercase mb-1">
                    Subtotal
                  </p>
                  <p className="font-hero text-[#FDCB84] text-xl">
                    ${(item.quantity * (item.Product?.price ?? 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;
