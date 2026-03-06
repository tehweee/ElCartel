import Link from "next/link";
interface Props {
  innerBTNText: string;
  productID: number;
}
function Button({ innerBTNText, productID }: Props) {
  return (
    <>
      <Link
        href={`product/${productID}`}
        className="bg-[#1E1210] text-[#FDCB84] font-hero p-5 rounded-4xl hover:bg-[#FDCB84] hover:text-[#1E1210]"
      >
        {innerBTNText}
      </Link>
    </>
  );
}
export default Button;
