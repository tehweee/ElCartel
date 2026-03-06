import Link from "next/link";
function Header() {
  return (
    <header className="bg-[#1E1210] flex justify-between items-center">
      <div>
        <Link href="../">
          {" "}
          <img
            src="/images/elcartel-logo.png"
            alt="el_cartel_logo"
            className=" size-30 mx-50 mt-4"
          />
        </Link>
      </div>
      <div className="flex gap-8 mr-60 mt-4 ">
        <div>
          <Link href="../product" className="text-white font-hero">
            Product
          </Link>
        </div>
        <div>
          <Link href="../cart" className="text-white font-hero">
            Cart
          </Link>
        </div>
        <div>
          <Link href="../checkout" className="text-white font-hero">
            Checkout
          </Link>
        </div>
        <div>
          <Link href="../profile" className="text-white font-hero">
            Profile
          </Link>
        </div>
        <div>
          <Link href="../login" className="text-white font-hero">
            Login
          </Link>
        </div>
        <div>
          <Link href="../signup" className="text-white font-hero">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Header;
