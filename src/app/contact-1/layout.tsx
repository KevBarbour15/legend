import { ReactNode } from "react";
import { connectToMongoDB } from "@/lib/db";

export default async function ContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connectToMongoDB();
  return <main>{children}</main>;
}
