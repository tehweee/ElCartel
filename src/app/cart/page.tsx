"use client";
import { useEffect, useState } from "react";
import data from "../../../src/data/productList";
function Cart() {
  const [localCart, setLocalCart] = useState(
    JSON.parse(localStorage.getItem("carts") || "{}"),
  );
  const [total, setTotal] = useState(0);

  function setTotalUpdate() {
    let tempTotal = 0;
    Object.entries(localCart).map(([key, value]) => {
      tempTotal += Number(value) * Number(data[Number(key)][2]);
    });
    setTotal(tempTotal);
    console.log("This is the temp total: " + tempTotal);
    console.log(total);
  }
  useEffect(() => {
    setTotalUpdate();
  }, []);
  function incre(key: number) {
    localCart[key] += 1;
    setLocalCart({ ...localCart });
    setTotalUpdate();
    console.log(localCart);
    localStorage.setItem("carts", JSON.stringify(localCart));
    console.log("+1");
  }
  function decre(key: number) {
    if (localCart[key] <= 1) {
      delete localCart[key];
      setLocalCart({ ...localCart });
      setTotalUpdate();
      localStorage.setItem("carts", JSON.stringify(localCart));
      console.log("take in affect");
    } else {
      localCart[key] -= 1;
      setLocalCart({ ...localCart });
      setTotalUpdate();
      localStorage.setItem("carts", JSON.stringify(localCart));

      console.log("-1");
    }
  }
  return (
    <>
      <div className="my-10 mb-40 mx-30">
        <div className="font-hero text-[#1E1210] text-3xl">Cart</div>
        <div className="flex flex-row justify-between items-start">
          <div className="grid grid-cols-3 gap-20">
            {Object.entries(localCart).map(([key, value]) => (
              <div key={key} className="size-80">
                <img
                  src={data[key][1]}
                  alt={data[key][0]}
                  className="size-full"
                />
                <div className="flex flex-row justify-between items-start">
                  <div>
                    <div className="font-hero text-[#1E1210] text-2xl">
                      {data[key][0]}
                    </div>
                    <div className="font-body text-[#398813] text-xl">
                      ${data[key][2]}
                    </div>
                  </div>
                  <div>
                    <div className="font-hero text-[#1E1210] text-xl">
                      Quantity:{value}
                    </div>
                    <div className="flex flex-row justify-around">
                      <span
                        className="font-hero text-[#1E1210] text-3xl"
                        onClick={() => incre(Number(key))}
                      >
                        +
                      </span>
                      <span
                        className="font-hero text-[#1E1210] text-3xl"
                        onClick={() => decre(Number(key))}
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
              {Object.entries(localCart).map(([key, value]) => (
                <div key={key}>
                  <span className="font-hero text-[#1E1210] text-xl">
                    {data[key][0]}
                  </span>{" "}
                  (
                  <span className="font-body text-[#398813] font-bold">
                    ${data[key][2]}
                  </span>
                  ) -{" "}
                  <span className="font-body text-[#D5A15D] font-bold">
                    Quantity {value}
                  </span>{" "}
                  -{" "}
                  <span className="font-body text-[#FB7C25] font-bold">
                    Total
                  </span>{" "}
                  (
                  <span className="font-body text-[#398813] font-bold">
                    ${value * data[key][2]}
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
