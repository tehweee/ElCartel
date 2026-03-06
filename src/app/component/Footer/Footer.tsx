import Link from "next/link";
function Footer() {
  return (
    <>
      <footer className="flex flex-row justify-around items-center bg-[#1E1210] mt-10">
        <div className="flex flex-row items-center">
          <Link href="/">
            <img
              src="/images/elcartel-logo.png"
              alt="El Cartel Logo"
              className="size-80"
            />
          </Link>

          <h1 className="font-hero text-[#FDCB84] text-2xl w-100">
            Finest Reweapon skin modaller inspire by sushi train lol
          </h1>
        </div>
        <div className="flex flex-col gap-10">
          <Link href="product" className="font-hero text-[#FDCB84]">
            Product
          </Link>
          <Link href="order" className="font-hero text-[#FDCB84]">
            Order
          </Link>
          <Link href="checkout" className="font-hero text-[#FDCB84]">
            Checkout
          </Link>
          <Link href="profile" className="font-hero text-[#FDCB84]">
            Profile
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
