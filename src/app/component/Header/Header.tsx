import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("sb-access-token")?.value;

  return (
    <header className="sticky top-0 z-50 bg-black border-b-2 border-[#FDCB84] overflow-hidden">
      {/* Brutalist grid texture */}
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />

      {/* Corner bracket accents */}
      <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-[#FDCB84] pointer-events-none" />
      <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-[#FDCB84] pointer-events-none" />

      <div className="relative z-10 flex justify-between items-center px-10 py-2">
        {/* Logo */}
        <Link href="/">
          <div className="logo-animate">
            <img
              src="/images/elcartel-logo.png"
              alt="el_cartel_logo"
              className="h-16 w-auto drop-shadow-[0_0_12px_rgba(253,203,132,0.5)]"
            />
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex gap-8 items-center">
          <Link href="/product" className="nav-brutal-link">
            Product
          </Link>
          <Link href="/cart" className="nav-brutal-link">
            Cart
          </Link>
          <Link href="/order" className="nav-brutal-link">
            Order
          </Link>
          {isLoggedIn && (
            <Link href="/profile" className="nav-brutal-link">
              Profile
            </Link>
          )}
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login" className="nav-brutal-link">
                Login
              </Link>
              <Link href="/signup" className="nav-brutal-link nav-brutal-cta">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;
