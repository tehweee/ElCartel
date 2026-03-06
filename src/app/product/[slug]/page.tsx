"use client";
import { use } from "react";
import { useState } from "react";
import data from "../../../data/productList";
import Price from "../../../app/component/UI/Price";
import Button from "../../../app/component/UI/Button";
import Link from "next/link";
import cart from "../../../data/cartList";
export default function GetSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  console.log(cart);
  return (
    <>
      <div className="flex flex-row justify-center items-start my-20">
        <div className="flex-2 flex flex-row justify-center items-center">
          <img
            src={`/${data[slug][1]}`}
            alt={data[slug][0]}
            className="size-130"
          />
        </div>
        <div className="flex-1">
          <h1 className="font-hero text-[#1E1210] text-4xl">{data[slug][0]}</h1>
          <Price price={data[slug][2]} />
          <button
            onClick={() => {
              if (cart[slug] == 0 || cart[slug] == null) {
                cart[slug] = 1;
                localStorage.setItem("carts", JSON.stringify(cart));
              } else {
                cart[slug] += 1;
                localStorage.setItem("carts", JSON.stringify(cart));
              }
              console.log(cart);
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </>
  );
}
