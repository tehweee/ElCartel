"use client";
import { useEffect, useState } from "react";

type CartProduct = { product_name: string; price: number; image: string };
type CartItem = {
  product_id: number;
  quantity: number;
  Product: CartProduct | null;
};

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  function calcTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => {
      return acc + item.quantity * (item.Product?.price ?? 0);
    }, 0);
  }

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((cartData: CartItem[]) => {
        setCartItems(cartData);
        setTotal(calcTotal(cartData));
      });
  }, []);

  async function updateQuantity(product_id: number, newQty: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, quantity: newQty }),
    });
    if (!res.ok) return;
    const updated =
      newQty <= 0
        ? cartItems.filter((item) => item.product_id !== product_id)
        : cartItems.map((item) =>
            item.product_id === product_id
              ? { ...item, quantity: newQty }
              : item,
          );
    setCartItems(updated);
    setTotal(calcTotal(updated));
  }

  return (
    <>
      <div className="my-10 mb-40 mx-30">
        <div className="font-hero text-[#1E1210] text-3xl">Cart</div>
        <div className="flex flex-row justify-between items-start">
          <div className="grid grid-cols-3 gap-20">
            {cartItems.map((item) => (
              <div key={item.product_id} className="size-80">
                <img
                  src={item.Product?.image}
                  alt={item.Product?.product_name}
                  className="size-full"
                />
                <div className="flex flex-row justify-between items-start">
                  <div>
                    <div className="font-hero text-[#1E1210] text-2xl">
                      {item.Product?.product_name}
                    </div>
                    <div className="font-body text-[#398813] text-xl">
                      ${item.Product?.price}
                    </div>
                  </div>
                  <div>
                    <div className="font-hero text-[#1E1210] text-xl">
                      Quantity: {item.quantity}
                    </div>
                    <div className="flex flex-row justify-around">
                      <span
                        className="font-hero text-[#1E1210] text-3xl"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                      >
                        +
                      </span>
                      <span
                        className="font-hero text-[#1E1210] text-3xl"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                      >
                        -
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center bg-[#FEF9D1] sticky top-10 border-dotted border-[#1E1210] border-6 p-5 rounded-4xl">
            <div className="font-hero text-[#1E1210] text-3xl">Receipt</div>
            <div className="">
              {cartItems.map((item) => (
                <div key={item.product_id}>
                  <span className="font-hero text-[#1E1210] text-xl">
                    {item.Product?.product_name}
                  </span>{" "}
                  (
                  <span className="font-body text-[#398813] font-bold">
                    ${item.Product?.price}
                  </span>
                  ) -{" "}
                  <span className="font-body text-[#D5A15D] font-bold">
                    Quantity {item.quantity}
                  </span>{" "}
                  -{" "}
                  <span className="font-body text-[#FB7C25] font-bold">
                    Total
                  </span>{" "}
                  (
                  <span className="font-body text-[#398813] font-bold">
                    ${item.quantity * (item.Product?.price ?? 0)}
                  </span>
                  )
                </div>
              ))}
              <hr />
              <div className="align-middle mt-5">
                <span className="text-[#FB7C25] font-hero text-4xl">Grand</span>
                {"   "}
                <span className="text-[#FEBC26] font-hero text-4xl">Total</span>
                : <span className="font-hero text-[#1E1210] text-3xl">$</span>
                <span className="text-[#398813] font-hero text-5xl">
                  {total}
                </span>
              </div>
              <button className="bg-[#1E1210] w-full h-15 rounded-3xl text-[#FEF9D1] font-hero text-2xl mt-10">
                Proceed to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Cart;
