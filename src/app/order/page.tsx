import { cookies } from "next/headers";
import { supabaseAdminClient } from "../../lib/supabaseClient";
import Link from "next/link";

type OrderItemData = {
  product_id: number;
  quantity: number;
  Product: { product_name: string; price: number; image: string } | null;
};

type OrderData = {
  id: number;
  total: number;
  status: string;
  OrderItem: OrderItemData[];
};

const pageShell = (children: React.ReactNode) => (
  <div className="relative min-h-screen bg-black overflow-x-hidden">
    <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
    <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
    <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
    <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
    <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">{children}</div>
  </div>
);

export default async function Order() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken || !supabaseAdminClient) {
    return pageShell(
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
          <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
            Locked Vault
          </h1>
        </div>
        <p className="font-hero text-white/50 text-xl tracking-[0.3em] uppercase">
          Please log in to view your orders.
        </p>
        <Link href="/login" className="brutal-cta-btn">
          Log In
        </Link>
      </div>,
    );
  }

  const { data: authData } =
    await supabaseAdminClient.auth.getUser(accessToken);
  if (!authData?.user) {
    return pageShell(
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="border-4 border-[#FDCB84] px-8 py-4 shadow-[8px_8px_0_#FDCB84] bg-black">
          <h1 className="font-hero text-[#FDCB84] text-5xl tracking-widest uppercase">
            Locked Vault
          </h1>
        </div>
        <p className="font-hero text-white/50 text-xl tracking-[0.3em] uppercase">
          Please log in to view your orders.
        </p>
        <Link href="/login" className="brutal-cta-btn">
          Log In
        </Link>
      </div>,
    );
  }

  const userId = authData.user.id;

  const { data: orders } = await supabaseAdminClient
    .from("Order")
    .select(
      "id, total, status, OrderItem(product_id, quantity, Product(product_name, price, image))",
    )
    .eq("uuid", userId)
    .eq("status", "paid")
    .order("id", { ascending: false });

  const typedOrders = (orders ?? []) as unknown as OrderData[];

  return pageShell(
    <>
      {/* Page header */}
      <div className="flex items-center gap-4 mb-14">
        <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
        <div className="border-4 border-[#FDCB84] px-8 py-3 shadow-[6px_6px_0_#FDCB84] bg-black">
          <h1 className="font-hero text-[#FDCB84] text-4xl tracking-[0.4em] uppercase">
            My Orders
          </h1>
        </div>
        <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
      </div>

      {typedOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 text-center mt-10">
          <p className="font-hero text-white/40 text-2xl tracking-[0.25em] uppercase">
            No confirmed orders yet.
          </p>
          <Link href="/product" className="brutal-cta-btn">
            Shop the Arsenal
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {typedOrders.map((order, orderIdx) => (
            <div
              key={order.id}
              className="relative border-2 border-[#FDCB84]/40 bg-black/60 shadow-[4px_4px_0_#FDCB84] p-6 hover:border-[#FDCB84] hover:shadow-[6px_6px_0_#FDCB84] transition-all duration-150"
            >
              {/* Order number stamp */}
              <div className="absolute -top-3 -left-3 bg-[#FDCB84] px-2 py-0.5">
                <span className="font-hero text-black text-xs tracking-widest">
                  {String(orderIdx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Order header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-[#FDCB84]/20">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-[#FDCB84] opacity-50" />
                  <span className="font-hero text-[#FDCB84] text-2xl tracking-widest">
                    ORDER #{String(order.id).padStart(4, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-hero text-white/40 text-sm tracking-[0.3em] uppercase border border-[#FDCB84]/30 px-3 py-1">
                    {order.status}
                  </span>
                  <span className="font-hero text-[#FDCB84] text-xl">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {order.OrderItem.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex flex-col gap-2 border border-[#FDCB84]/15 p-3 bg-black/40"
                  >
                    <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                      <img
                        src={item.Product?.image}
                        alt={item.Product?.product_name}
                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(253,203,132,0.15)]"
                      />
                    </div>
                    <p className="font-hero text-[#FDCB84] text-base leading-tight">
                      {item.Product?.product_name}
                    </p>
                    <p className="font-hero text-white/40 text-xs tracking-widest">
                      ${item.Product?.price} / ea
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-hero text-white/30 text-xs tracking-widest">
                        ×{item.quantity}
                      </span>
                      <span className="font-hero text-[#FDCB84] text-sm">
                        $
                        {((item.Product?.price ?? 0) * item.quantity).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>,
  );
}
