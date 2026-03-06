import { fetchProducts } from "../../lib/products";
import ProductListClient from "./ProductListClient";

export default async function Product() {
  const products = await fetchProducts();
  return <ProductListClient products={products} />;
}
