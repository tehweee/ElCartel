import { fetchProductById } from "../../../lib/products";
import Price from "../../component/UI/Price";
import AddToCartButton from "./AddToCartButton";

export default async function GetSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductById(Number(slug));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-center items-start my-20">
        <div className="flex-2 flex flex-row justify-center items-center">
          <img
            src={product.image}
            alt={product.product_name}
            className="size-130"
          />
        </div>
        <div className="flex-1">
          <h1 className="font-hero text-[#1E1210] text-4xl">
            {product.product_name}
          </h1>
          <Price price={product.price} />
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </>
  );
}
