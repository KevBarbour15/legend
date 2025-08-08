import { ReactNode } from "react";
import { connectToMongoDB } from "@/lib/db";
import SideMenu from "@/components/side-menu/SideMenu";
export default async function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connectToMongoDB();
  return (
    <main>
      <SideMenu color="text-customNavy" />
      {children}
    </main>
  );
}
