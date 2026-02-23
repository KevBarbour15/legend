import { ReactNode } from "react";
import { Source_Sans_3 } from "next/font/google";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`dashboard-root ${sourceSans.className}`}>
      {children}
    </main>
  );
}
