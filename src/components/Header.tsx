import { fetchHeader, fetchPublishedPages } from "@/lib/wordpress";
import {
  buildSubServiceMenuItem,
  filterSubServiceLandingPages,
} from "@/lib/sub-service-page";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [headerData, publishedPages] = await Promise.all([
    fetchHeader(),
    fetchPublishedPages(),
  ]);

  const landingPages = filterSubServiceLandingPages(publishedPages);

  const subServiceLandingHrefs = landingPages.map(
    (page) =>
      buildSubServiceMenuItem(page.slug, page.acf, page.title?.rendered, page.link).href
  );

  const serviceMenuItems = landingPages.map((page) =>
    buildSubServiceMenuItem(page.slug, page.acf, page.title?.rendered, page.link)
  );

  return (
    <HeaderClient
      headerData={headerData}
      serviceMenuItems={serviceMenuItems}
      subServiceLandingHrefs={subServiceLandingHrefs}
    />
  );
}
