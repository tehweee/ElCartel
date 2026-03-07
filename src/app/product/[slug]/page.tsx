import { fetchProductById } from "../../../lib/products";
import AddToCartButton from "./AddToCartButton";

export default async function GetSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductById(Number(slug));

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="border-4 border-[#FDCB84] px-10 py-8 shadow-[8px_8px_0_#FDCB84]">
          <p className="font-hero text-[#FDCB84] text-3xl tracking-widest uppercase">
            Item Not Found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />

      {/* Top & bottom gold accent bars */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />

      {/* Page-level corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />

      {/* Ghost product ID watermark */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden pl-6">
        <span
          className="font-hero text-white/[0.035] leading-none"
          style={{ fontSize: "clamp(10rem, 28vw, 26rem)" }}
        >
          {String(product.id).padStart(2, "0")}
        </span>
      </div>

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-14 lg:gap-0 px-10 py-28">
        {/* LEFT: Floating product image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="product-detail-frame">
            {/* Inner corner brackets on image */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-l-4 border-t-4 border-[#FDCB84] z-10" />
            <div className="absolute -top-3 -right-3 w-8 h-8 border-r-4 border-t-4 border-[#FDCB84] z-10" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-4 border-b-4 border-[#FDCB84] z-10" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-4 border-b-4 border-[#FDCB84] z-10" />

            {/* Rotated "CERTIFIED" badge */}
            <div className="absolute -top-5 -right-10 rotate-12 z-20 border-2 border-[#FDCB84] px-3 py-1 bg-black">
              <span className="font-hero text-[#FDCB84] text-xs tracking-[0.3em] uppercase">
                Certified
              </span>
            </div>

            <img
              src={product.image}
              alt={product.product_name}
              className="w-72 h-72 md:w-96 md:h-96 object-contain relative z-0"
            />
          </div>
        </div>

        {/* Vertical gold divider */}
        <div className="hidden lg:block self-stretch w-px bg-linear-to-b from-transparent via-[#FDCB84] to-transparent opacity-50 mx-6" />

        {/* RIGHT: Product info panel */}
        <div className="flex-1 flex flex-col gap-7 max-w-xl px-4 lg:pl-14">
          {/* Arsenal label row */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#FDCB84]" />
            <span className="font-hero text-[#FDCB84] text-xs tracking-[0.5em] uppercase">
              El Cartel Arsenal
            </span>
            <div className="h-px w-8 bg-[#FDCB84]" />
          </div>

          {/* SKU tag */}
          <p className="font-hero text-white/30 text-xs tracking-[0.4em] uppercase -mt-4">
            SKU &mdash; {String(product.id).padStart(4, "0")}
          </p>

          {/* Product name — glitches on hover */}
          <h1
            className="font-hero text-[#FDCB84] leading-[0.9] brutal-product-title"
            style={{ fontSize: "clamp(2.6rem, 4.5vw, 4.8rem)" }}
          >
            {product.product_name}
          </h1>

          {/* Gold horizontal rule */}
          <div className="h-px w-full bg-[#FDCB84] opacity-35" />

          {/* Price — brutalist hard-shadow box */}
          <div className="border-4 border-[#FDCB84] bg-black px-6 py-3 shadow-[6px_6px_0_#FDCB84] w-fit">
            <span className="font-hero text-[#FDCB84] text-2xl tracking-widest">
              ${product.price} USD
            </span>
          </div>

          {/* Brand tagline */}
          <p className="font-hero text-white/40 text-sm tracking-[0.35em] uppercase">
            Your&nbsp;Weapon.&nbsp;&nbsp;Your&nbsp;Cartel.&nbsp;&nbsp;Your&nbsp;Rules.
          </p>

          {/* Add to Cart */}
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
