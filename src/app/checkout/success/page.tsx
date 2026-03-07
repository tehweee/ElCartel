import Stripe from "stripe";
import { supabaseAdminClient } from "../../../lib/supabaseClient";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId || !supabaseAdminClient) {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />
        <div className="relative z-10 text-center flex flex-col items-center gap-6 px-6">
          <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
              Invalid Request
            </h1>
          </div>
          <Link href="/cart" className="brutal-cta-btn">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />
        <div className="relative z-10 text-center flex flex-col items-center gap-6 px-6">
          <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
              Session Not Found
            </h1>
          </div>
          <Link href="/cart" className="brutal-cta-btn">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (session.payment_status === "paid") {
    const orderId = session.metadata?.orderId;
    if (orderId) {
      // Update order status to "paid" only if it is still "pending" (idempotent)
      const { data: updatedOrder } = await supabaseAdminClient
        .from("Order")
        .update({ status: "paid" })
        .eq("id", orderId)
        .eq("status", "pending")
        .select("uuid")
        .maybeSingle();

      if (updatedOrder?.uuid) {
        // Clear the user's cart after successful payment
        await supabaseAdminClient
          .from("Cart")
          .delete()
          .eq("uuid", updatedOrder.uuid);
      } else {
        // Order was already marked paid (page refresh) — still clear cart just in case
        const { data: existingOrder } = await supabaseAdminClient
          .from("Order")
          .select("uuid")
          .eq("id", orderId)
          .maybeSingle();
        if (existingOrder?.uuid) {
          await supabaseAdminClient
            .from("Cart")
            .delete()
            .eq("uuid", existingOrder.uuid);
        }
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />

      {/* Giant ghost text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-hero text-white/3 leading-none"
          style={{ fontSize: "clamp(8rem, 25vw, 22rem)" }}
        >
          PAID
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Checkmark badge */}
        <div className="border-4 border-[#FDCB84] w-20 h-20 flex items-center justify-center shadow-[6px_6px_0_#FDCB84] bg-black">
          <span className="font-hero text-[#FDCB84] text-4xl leading-none">
            ✓
          </span>
        </div>

        {/* Title */}
        <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[10px_10px_0_#FDCB84] bg-black">
          <h1
            className="font-hero text-[#FDCB84] leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            PAYMENT CONFIRMED
          </h1>
        </div>

        {/* Sub-message */}
        <p className="font-hero text-white/50 text-xl tracking-[0.3em] uppercase max-w-md">
          Your arsenal has been locked in. The cartel will deliver.
        </p>

        {/* CTA */}
        <Link href="/order" className="brutal-cta-btn">
          View My Orders
        </Link>

        <Link
          href="/product"
          className="font-hero text-white/30 hover:text-[#FDCB84] text-sm tracking-[0.3em] uppercase transition-colors"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
