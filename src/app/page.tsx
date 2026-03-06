import Image from "next/image";
import Hero from "./component/Hero/Hero";
import ProductCarousel from "./component/ProductCarousel/ProductCarousel";
import data from "../../src/data/productList";
export default function Home() {
  return (
    <>
      <Hero />
      <ProductCarousel data={data} />
    </>
  );
}
