import supabaseServerClient from "./supabaseClient";

export type Product = {
  id: number;
  created_at: string;
  product_name: string;
  price: number;
  image: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabaseServerClient
    .from("Product")
    .select("*");

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabaseServerClient
    .from("Product")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product;
}
