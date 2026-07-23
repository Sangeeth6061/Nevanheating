import { fetchHomePage } from "@/lib/wordpress";
import { stripHtml } from "@/lib/html";
import { parseContactLocationMap } from "@/lib/contact";
import ContactLocationMap from "@/components/ContactLocationMap";

type ContactLocationMapSectionProps = {
  acf?: Record<string, unknown>;
};

export default async function ContactLocationMapSection({ acf }: ContactLocationMapSectionProps) {
  const homePages = await fetchHomePage();
  const homePage = homePages?.[0] as { title?: { rendered?: string } } | undefined;
  const homeTitle = stripHtml(homePage?.title?.rendered);
  const businessName =
    homeTitle && homeTitle.toLowerCase() !== "home" ? homeTitle : "Nevan Plumbing & Heating";
  const locationMap = parseContactLocationMap(acf, businessName);

  if (!locationMap) return null;

  return <ContactLocationMap locationMap={locationMap} />;
}
