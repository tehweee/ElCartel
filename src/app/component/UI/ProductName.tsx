import React from "react";
interface Props {
  name: string;
}
const ProductName = ({ name }: Props) => {
  return (
    <>
      <div className="font-hero text-[#1E1210] text-[20px]">{name}</div>
    </>
  );
};

export default ProductName;
