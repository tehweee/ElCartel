import Button from "../UI/Button";
import ProductName from "../UI/ProductName";
import Price from "../UI/Price";
import "./ProductCarousel.css";
type data = Record<number, [name: string, image: string, price: number]>;
interface Props {
  data: data;
}
function ProductCarousel({ data }: Props) {
  return (
    <div className="mt-10 text-center">
      <div className="font-hero text-3xl ">
        Skins - <span className="text-[#D5A15D] mb-10">sushi train style</span>
      </div>
      <div className={`w-[100%] flex overflow-x-auto no-scrollbar`}>
        <div className="flex align-middle justify-center gap-1em animate-carousel">
          {Object.entries(data).map(([productID, [name, image, price]]) => (
            <div key={productID} className="p-2 w-100 flex-[0 0 5em] mx-10">
              <div>
                <img
                  src={image}
                  alt={productID}
                  className="object-cover w-100 h-100"
                />
              </div>
              <div className="flex flex-row align-center justify-between mt-2">
                <div>
                  <ProductName name={name} />
                  <Price price={price} />
                </div>
                <Button
                  innerBTNText="View more"
                  productID={Number(productID)}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex align-middle justify-center gap-1em animate-carousel"
          aria-hidden
        >
          {Object.entries(data).map(([productID, [name, image, price]]) => (
            <div key={productID} className="p-2 w-100 flex-[0 0 5em] mx-10">
              <div>
                <img
                  src={image as string}
                  alt={productID}
                  className="object-cover w-100 h-100"
                />
              </div>
              <div className="flex flex-row align-center justify-between mt-2">
                <div>
                  <ProductName name={name} />
                  <Price price={price} />
                </div>
                <Button
                  innerBTNText="View more"
                  productID={Number(productID)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ProductCarousel;
