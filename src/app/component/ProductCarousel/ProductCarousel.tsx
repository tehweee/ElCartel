import Button from "../UI/Button";
import ProductName from "../UI/ProductName";
import Price from "../UI/Price";
import "./ProductCarousel.css";
import type { Product } from "../../../lib/products";

interface Props {
  products: Product[];
}

function ProductCarousel({ products }: Props) {
  return (
    <div className="mt-10 text-center">
      <div className="font-hero text-3xl ">
        Skins - <span className="text-[#D5A15D] mb-10">sushi train style</span>
      </div>
      <div className={`w-[100%] flex overflow-x-auto no-scrollbar`}>
        <div className="flex align-middle justify-center gap-1em animate-carousel">
          {products.map((p) => (
            <div key={p.id} className="p-2 w-100 flex-[0 0 5em] mx-10">
              <div>
                <img
                  src={p.image}
                  alt={p.product_name}
                  className="object-cover w-100 h-100"
                />
              </div>
              <div className="flex flex-row align-center justify-between mt-2">
                <div>
                  <ProductName name={p.product_name} />
                  <Price price={p.price} />
                </div>
                <Button innerBTNText="View more" productID={p.id} />
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex align-middle justify-center gap-1em animate-carousel"
          aria-hidden
        >
          {products.map((p) => (
            <div key={p.id} className="p-2 w-100 flex-[0 0 5em] mx-10">
              <div>
                <img
                  src={p.image}
                  alt={p.product_name}
                  className="object-cover w-100 h-100"
                />
              </div>
              <div className="flex flex-row align-center justify-between mt-2">
                <div>
                  <ProductName name={p.product_name} />
                  <Price price={p.price} />
                </div>
                <Button innerBTNText="View more" productID={p.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ProductCarousel;
