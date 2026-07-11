import { acfImageUrl, type AcfLink, titleToSlug, wpUrlToPath } from "@/lib/wp-utils";

export type ServicePagePoint = {
  text: string;
  iconUrl?: string;
};

export type ServicePageItem = {
  id: string;
  sectionAnchor: string;
  title: string;
  description: string;
  paragraphs: string[];
  iconUrl?: string;
  iconName?: string;
  points: ServicePagePoint[];
  buttonLabel: string;
  buttonHref: string;
  imageUrl?: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function getServiceSectionAnchor(link: AcfLink | undefined, title: string): string {
  const path = wpUrlToPath(link?.url);
  const match = path.match(/\/service\/([^/?#]+)/);
  if (match?.[1]) return match[1];

  return titleToSlug(title);
}

function getServicesSectionHref(anchor: string): string {
  return `/services#${anchor}`;
}

function splitParagraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);
}

function parseServicePagePoints(items: unknown): ServicePagePoint[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item): ServicePagePoint | null => {
      const row = item as Record<string, unknown>;
      const text = acfStr(row.add_a_service_page_point);
      if (!text) return null;

      return {
        text,
        iconUrl: acfImageUrl(
          row.add_a_service_page_pointsicon as { url?: string } | false | null | undefined
        ),
      };
    })
    .filter((point): point is ServicePagePoint => point !== null);
}

export function getServiceIconColorClasses(iconUrl?: string, iconName?: string) {
  const url = iconUrl?.toLowerCase() ?? "";
  const name = iconName?.toLowerCase() ?? "";

  if (url.includes("flame") || name.includes("flame")) {
    return "bg-[#FFF5EC] border border-[#FFEADA]";
  }
  if (
    url.includes("water-drops") ||
    url.includes("water") ||
    name.includes("water-drops") ||
    name.includes("water")
  ) {
    return "bg-[#EDF5FF] border border-[#DDECFF]";
  }
  if (url.includes("bolt") || name.includes("bolt") || name.includes("zap")) {
    return "bg-[#FFF0F0] border border-[#FFE1E1]";
  }
  if (url.includes("bathroom") || name.includes("bathroom") || name.includes("bath")) {
    return "bg-[#F7F4FF] border border-[#ECE6FF]";
  }
  if (url.includes("security") || name.includes("security") || name.includes("shield")) {
    return "bg-[#ECFDF5] border border-[#D1FAE5]";
  }

  return "bg-slate-50 border border-slate-100";
}

export function parseServiceMenuItems(acf?: Record<string, unknown> | null): Array<{
  label: string;
  href: string;
}> {
  return parseServicesPageItems(acf).map((item) => ({
    label: item.title,
    href: getServicesSectionHref(item.sectionAnchor),
  }));
}

export function parseServicesPageItems(acf?: Record<string, unknown> | null): ServicePageItem[] {
  const items = acf?.add_service_page;
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): ServicePageItem | null => {
      const row = item as Record<string, unknown>;
      const title = acfStr(row.add_a_srvice_page_title);
      if (!title) return null;

      const description = acfStr(row.add_a_service_page_text_area) ?? "";
      const icon = row.srvice_page_icon as { url?: string; name?: string } | false | null | undefined;
      const link = row.service_page_ as AcfLink | undefined;
      const image = row.service_page_cover_image as { url?: string } | false | null | undefined;
      const sectionAnchor = getServiceSectionAnchor(link, title);

      return {
        id: sectionAnchor,
        sectionAnchor,
        title,
        description,
        paragraphs: splitParagraphs(description),
        iconUrl: acfImageUrl(icon),
        iconName: icon && typeof icon === "object" ? icon.name : undefined,
        points: parseServicePagePoints(row.add_service_page_points),
        buttonLabel: link?.title?.trim() || "Get a Quote",
        buttonHref: wpUrlToPath(link?.url),
        imageUrl: acfImageUrl(image),
      };
    })
    .filter((item): item is ServicePageItem => item !== null);
}
