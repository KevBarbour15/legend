import { ReactNode } from "react";
import { connectToMongoDB } from "@/lib/db";
import SideMenu from "@/components/side-menu/SideMenu";

export default async function EventsLayout({
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
