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
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-full min-h-screen w-screen backdrop-blur-md"></div>
      {children}
    </main>
  );
}
