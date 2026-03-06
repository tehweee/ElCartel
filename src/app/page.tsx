import Hero from "./component/Hero/Hero";
import ProductCarousel from "./component/ProductCarousel/ProductCarousel";
import { fetchProducts } from "../lib/products";

export default async function Home() {
  const products = await fetchProducts();
  return (
    <>
      <Hero />
      <ProductCarousel products={products} />
    </>
  );
}
