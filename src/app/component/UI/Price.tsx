import React from "react";
interface Props {
  price: number;
}
const Price = ({ price }: Props) => {
  return (
    <>
      <div className="font-body text-[#398813] font-bold">{price} USD</div>{" "}
    </>
  );
};

export default Price;
