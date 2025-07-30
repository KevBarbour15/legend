import { getAllProductsWithVariants } from "@/app/actions/shopify";
import ShopContent from "./ShopContent";

export default async function Shop() {
  const data: any = await getAllProductsWithVariants();
  return <ShopContent products={data.products.nodes} />;
}
