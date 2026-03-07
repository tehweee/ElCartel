import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-black border-t-4 border-[#FDCB84] relative overflow-hidden">
      {/* Brutalist grid texture */}
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />

      {/* Corner bracket accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#FDCB84] pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#FDCB84] pointer-events-none" />

      <div className="relative z-10 flex flex-row justify-between items-center px-16 py-12 gap-12">
        {/* Left — logo + tagline + copyright */}
        <div className="flex flex-col items-start gap-5">
          <Link href="/">
            <div className="logo-animate">
              <img
                src="/images/elcartel-logo.png"
                alt="El Cartel Logo"
                className="w-24 drop-shadow-[0_0_14px_rgba(253,203,132,0.55)]"
              />
            </div>
          </Link>

          <div className="footer-tagline-box px-5 py-2">
            <p className="font-hero text-[#FDCB84] text-xl tracking-[0.25em] uppercase select-none">
              Your&nbsp;AK.&nbsp;&nbsp;Your&nbsp;Cartel.&nbsp;&nbsp;Your&nbsp;Rules.
            </p>
          </div>

          <p className="font-hero text-white/40 text-sm tracking-widest uppercase">
            © 2026 El Cartel. All rights reserved.
          </p>
        </div>

        {/* Right — navigation links */}
        <div className="flex flex-col gap-4 items-end">
          <Link href="/product" className="nav-brutal-link">
            Product
          </Link>
          <Link href="/order" className="nav-brutal-link">
            Order
          </Link>
          <Link href="/checkout" className="nav-brutal-link">
            Checkout
          </Link>
          <Link href="/profile" className="nav-brutal-link">
            Profile
          </Link>
        </div>
      </div>

      {/* Bottom gold bar */}
      <div className="h-1 w-full bg-[#FDCB84]" />
    </footer>
  );
}

export default Footer;
