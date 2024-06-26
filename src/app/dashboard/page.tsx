import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2> <Link href="/">Home</Link>
      <LogoutLink postLogoutRedirectURL="/">Log out</LogoutLink>
    </div>
  );
}
