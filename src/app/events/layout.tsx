import { ReactNode } from "react";
import { connectToMongoDB } from "@/lib/db";

export default async function EventsLayout({ children }: { children: ReactNode }) {
  await connectToMongoDB();
  return <main>{children}</main>;
}
