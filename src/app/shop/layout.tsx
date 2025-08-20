import { ReactNode } from "react";
import SideMenu from "@/components/side-menu/SideMenu";
import { connectToMongoDB } from "@/lib/db";
import Footer from "@/components/footer/Footer";

export default async function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connectToMongoDB();
  return (
    <main>
      <SideMenu color="text-customNavy" />
      {children}
      <Footer />
    </main>
  );
}
