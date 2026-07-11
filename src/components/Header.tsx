import { fetchHeader, fetchPageBySlug } from "@/lib/wordpress";
import { parseServiceMenuItems } from "@/lib/services-page";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [headerData, servicesPage] = await Promise.all([
    fetchHeader(),
    fetchPageBySlug("services"),
  ]);

  const serviceMenuItems = parseServiceMenuItems(
    (servicesPage as { acf?: Record<string, unknown> } | null)?.acf
  );

  return <HeaderClient headerData={headerData} serviceMenuItems={serviceMenuItems} />;
}
