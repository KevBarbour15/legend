import { getMenu } from "@/app/actions/getMenu.server";
import { updateMenu } from "@/app/actions/updateMenu.server";
import MenuContent from "./MenuContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Menu() {
  //await updateMenu();
  const menu = await getMenu();

  if (!menu) {
    return notFound();
  }

  return <MenuContent menu={menu} />;
}
