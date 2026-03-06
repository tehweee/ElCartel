"use client";

import Button from "../component/UI/Button";
import ProductName from "../component/UI/ProductName";
import Price from "../component/UI/Price";
import Form from "next/form";
import { useState } from "react";
import type { Product } from "../../lib/products";

interface Props {
  products: Product[];
}

export default function ProductListClient({ products }: Props) {
  const [nameFilter, setNameFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(100000);

  function reset() {
    setNameFilter("");
    setPriceFilter(100000);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-20">
        <h1 className="font-hero text-4xl font-bold text-[#1E1210]">Product</h1>
        <div className="flex flex-row gap-50">
          <div className="bg-[#1E1210] p-10 rounded-lg flex flex-col justify-start items-center h-100 w-130 sticky top-10">
            <h1 className="text-[#FDCB84] font-hero text-3xl">Filter</h1>
            <Form action="" className="flex flex-col">
              <label
                htmlFor="productName"
                className="text-[#FDCB84] font-hero text-xl font-bold"
              >
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="border-solid border-1 rounded-4xl p-2 border-[#FDCB84] text-[#FDCB84] font-body font-bold"
              />
              <label
                htmlFor="productPrice"
                className="text-[#FDCB84] font-hero text-xl"
              >
                Price
              </label>
              <input
                type="number"
                name="productPrice"
                placeholder="Search by price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="border-solid border-1 rounded-4xl p-2 border-[#FDCB84] text-[#FDCB84] font-body font-bold"
              />
              <input
                type="reset"
                onClick={reset}
                className="border-solid border-1 rounded-4xl p-2 border-[#FDCB84] text-[#FDCB84] font-body font-bold hover:bg-[#FCDB84] hover:text-[#1E1210] cursor-pointer mt-10"
              />
            </Form>
          </div>
          <div className="grid grid-cols-2 gap-20">
            {products
              .filter(
                (p) =>
                  p.product_name
                    .toLowerCase()
                    .includes(nameFilter.toLowerCase()) &&
                  p.price <= priceFilter,
              )
              .map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col justify-center items-center"
                >
                  <img src={p.image} alt={p.product_name} className="size-80" />
                  <div className="flex flex-row justify-between items-center gap-20 mt-20">
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
    </>
  );
}
