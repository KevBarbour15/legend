import { getAllProductsWithVariants } from "@/app/actions/shopify";
import ShopContent from "./ShopContent";

export const dynamic = "force-dynamic";

export default async function Shop() {
  const data: any = await getAllProductsWithVariants();
  return <ShopContent products={data.products.nodes} />;
}
