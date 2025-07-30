import { ReactNode } from "react";
import SideMenu from "@/components/side-menu/SideMenu";
import { connectToMongoDB } from "@/lib/db";

export default async function MenuLayout({
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
