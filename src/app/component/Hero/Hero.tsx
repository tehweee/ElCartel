import Link from "next/link";

function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Background image — dark muted */}
      <img
        src="images/ak_hero_banner.jpg"
        alt="el_cartel_banner"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
      />

      {/* Brutalist gold grid texture overlay */}
      <div className="absolute inset-0 brutal-grid-overlay" />

      {/* Top & bottom bar accents */}
      <div className="absolute top-0 left-0 w-full h-1.25 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.25 bg-[#FDCB84]" />

      {/* Corner bracket accents */}
      <div className="absolute top-5 left-5 w-14 h-14 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-5 right-5 w-14 h-14 border-r-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute bottom-5 left-5 w-14 h-14 border-l-4 border-b-4 border-[#FDCB84]" />
      <div className="absolute bottom-5 right-5 w-14 h-14 border-r-4 border-b-4 border-[#FDCB84]" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 px-6 py-24 text-center">
        {/* Animated Logo */}
        <div className="logo-animate">
          <img
            src="images/elcartel-logo.png"
            alt="el_cartel_logo"
            className="w-32 md:w-44 drop-shadow-[0_0_18px_rgba(253,203,132,0.6)]"
          />
        </div>

        {/* Brutalist Title Box — shakes + glitches on hover */}
        <div className="brutal-title-box px-8 py-4 bg-black/80">
          <h1
            className="font-hero leading-none text-[#FDCB84] tracking-widest select-none"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            EL CARTEL
          </h1>
        </div>

        {/* Sub-title box — inverts on hover */}
        <div className="brutal-sub-box px-6 py-3 bg-black/80">
          <p className="font-hero text-2xl md:text-3xl text-white tracking-[0.4em] uppercase select-none">
            Certified Skin Remodeler
          </p>
        </div>

        {/* Punchy caption */}
        <p className="font-body text-[#FDCB84] text-base md:text-lg font-bold tracking-[0.2em] uppercase mt-1">
          Your&nbsp;AK.&nbsp;&nbsp;Your&nbsp;Cartel.&nbsp;&nbsp;Your&nbsp;Rules.
        </p>

        {/* CTA — stomps on hover */}
        <Link href="/product" className="mt-2">
          <button className="brutal-cta-btn">Shop the Arsenal</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
