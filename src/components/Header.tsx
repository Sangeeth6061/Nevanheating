import { fetchHeader } from "@/lib/wordpress";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const headerData = await fetchHeader();
  return <HeaderClient headerData={headerData} />;
}
