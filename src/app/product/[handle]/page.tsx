import { getProductByHandle } from "@/app/actions/shopify";
import { notFound } from "next/navigation";
import ProductContent from "../ProductContent";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);
  if (!product) return notFound();

  return (
    <div className="flex min-h-screen">
      <ProductContent product={product} />
    </div>
  );
}
