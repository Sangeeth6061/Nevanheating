import { acfImageUrl, wpUrlToPath } from "@/lib/wp-utils";
import { stripHtml } from "@/lib/html";

/** First sub-service landing page (legacy export for deep links). */
export const ALL_KIND_PLUMBING_REPAIRS_SLUG = "all-kind-of-plumbing-repairs";

export const ALL_KIND_PLUMBING_REPAIRS_HREF = `/${ALL_KIND_PLUMBING_REPAIRS_SLUG}`;

export type SubServiceLandingPageRef = {
  slug: string;
  link?: string;
  menu_order?: number;
  title?: { rendered?: string };
  acf?: Record<string, unknown> | null;
};

/** Duplicate ACF groups often prefix keys with 2, 3, 4… — resolve by canonical name. */
function getAcfValue(
  acf: Record<string, unknown> | null | undefined,
  canonicalName: string
): unknown {
  if (!acf || typeof acf !== "object" || Array.isArray(acf)) return undefined;
  if (Object.prototype.hasOwnProperty.call(acf, canonicalName)) {
    return acf[canonicalName];
  }
  for (const key of Object.keys(acf)) {
    if (key.replace(/^\d+/, "") === canonicalName) {
      return acf[key];
    }
  }
  return undefined;
}

function getRowValue(row: Record<string, unknown>, ...canonicalNames: string[]): unknown {
  for (const canonicalName of canonicalNames) {
    if (Object.prototype.hasOwnProperty.call(row, canonicalName)) {
      return row[canonicalName];
    }
    for (const key of Object.keys(row)) {
      if (key.replace(/^\d+/, "") === canonicalName) {
        return row[key];
      }
    }
  }
  return undefined;
}

/** Same ACF shape as `/all-kind-of-plumbing-repairs` (hero + list + main + why choose us). */
export function isSubServiceLandingPage(acf?: Record<string, unknown> | null): boolean {
  if (!acf || typeof acf !== "object" || Array.isArray(acf)) return false;
  const servicePointsRaw = getAcfValue(acf, "add_a_sub_ser_points");
  if (Array.isArray(servicePointsRaw) && servicePointsRaw.length > 0) return true;
  const mainDescription = getAcfValue(acf, "sub_serv_page_main_description");
  return typeof mainDescription === "string" && mainDescription.trim().length > 0;
}

export function subServiceLandingHref(slug: string): string {
  return `/${slug}`;
}

export function filterSubServiceLandingPages(pages: SubServiceLandingPageRef[]): SubServiceLandingPageRef[] {
  return pages
    .filter((page) => isSubServiceLandingPage(page.acf))
    .sort((a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0) || a.slug.localeCompare(b.slug));
}

export type SubServiceListPoint = {
  text: string;
  iconUrl?: string;
};

export type SubServiceWhyChoosePoint = {
  title?: string;
  description: string;
  iconUrl?: string;
};

export type SubServicePageContent = {
  servicePoints: SubServiceListPoint[];
  mainDescriptionParagraphs: string[];
  mainImageUrl?: string;
  whyChooseHeading?: string;
  whyChoosePoints: SubServiceWhyChoosePoint[];
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function splitParagraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n\r?\n/)
    .flatMap((block) =>
      block
        .split(/\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    );
}

function parseWhyChooseText(text: string): { title?: string; description: string } {
  const colonIndex = text.indexOf(":");
  if (colonIndex === -1) return { description: text };
  return {
    title: text.slice(0, colonIndex).trim(),
    description: text.slice(colonIndex + 1).trim(),
  };
}

export function buildSubServiceMenuItem(
  slug: string,
  acf?: Record<string, unknown> | null,
  pageTitleHtml?: string,
  pageLink?: string
): { label: string; href: string } {
  const label =
    acfStr(getAcfValue(acf, "services_page_1st_section_title")) ??
    (pageTitleHtml ? stripHtml(pageTitleHtml) : undefined) ??
    slug;

  const hrefFromLink = pageLink ? wpUrlToPath(pageLink) : "";
  const href =
    hrefFromLink && hrefFromLink !== "#" ? hrefFromLink : subServiceLandingHref(slug);

  return {
    label,
    href,
  };
}

/** @deprecated Use buildSubServiceMenuItem */
export function buildPlumbingRepairsMenuItem(
  acf?: Record<string, unknown> | null,
  pageTitleHtml?: string
): { label: string; href: string } {
  return buildSubServiceMenuItem(ALL_KIND_PLUMBING_REPAIRS_SLUG, acf, pageTitleHtml);
}

export function getSubServicePageHero(
  acf?: Record<string, unknown> | null,
  pageTitleHtml?: string
) {
  const breadcrumbsIcon = getAcfValue(acf, "sub_service_page_bread_crumb_icon");
  const heroTitle = acfStr(getAcfValue(acf, "services_page_1st_section_title"));
  const pageTitle = pageTitleHtml ? stripHtml(pageTitleHtml) : undefined;
  const breadcrumbLabel = heroTitle ?? pageTitle;
  const breadcrumbsText =
    acfStr(getAcfValue(acf, "sub_services_page_1st_section_bread_crumbs_text")) ??
    (breadcrumbLabel ? `Home > Services > ${breadcrumbLabel}` : "Home > Services");

  return {
    title: heroTitle,
    description: acfStr(getAcfValue(acf, "services_page_1st_section_text_area")),
    breadcrumbsText,
    breadcrumbsIcon:
      breadcrumbsIcon === false || breadcrumbsIcon === null || breadcrumbsIcon === undefined
        ? undefined
        : (breadcrumbsIcon as { url?: string }),
    fallbackTitle: true as const,
  };
}

export function parseSubServicePageContent(
  acf?: Record<string, unknown> | null
): SubServicePageContent {
  const servicePointsRaw = getAcfValue(acf, "add_a_sub_ser_points");
  const servicePoints: SubServiceListPoint[] = Array.isArray(servicePointsRaw)
    ? servicePointsRaw
        .map((item): SubServiceListPoint | null => {
          const row = item as Record<string, unknown>;
          const text = acfStr(
            getRowValue(row, "add_a__sub_service_point_text", "add_a_sub_service_point_text")
          );
          if (!text) return null;
          return {
            text,
            iconUrl: acfImageUrl(
              getRowValue(row, "add_a_sub_services_icon", "add_a_sub_service_point_icon") as
                | { url?: string }
                | false
                | null
                | undefined
            ),
          };
        })
        .filter((point): point is SubServiceListPoint => point !== null)
    : [];

  const whyRaw = getAcfValue(acf, "add_a_why_choose_us_points");
  const whyChoosePoints: SubServiceWhyChoosePoint[] = Array.isArray(whyRaw)
    ? whyRaw
        .map((item): SubServiceWhyChoosePoint | null => {
          const row = item as Record<string, unknown>;
          const fullText = acfStr(
            getRowValue(row, "sub_ser_page_why_choose_us_point_text")
          );
          if (!fullText) return null;
          const parsed = parseWhyChooseText(fullText);
          return {
            ...parsed,
            iconUrl: acfImageUrl(
              getRowValue(row, "sub_ser_page_why_choose_us_point_icon") as
                | { url?: string }
                | false
                | null
                | undefined
            ),
          };
        })
        .filter((point): point is SubServiceWhyChoosePoint => point !== null)
    : [];

  return {
    servicePoints,
    mainDescriptionParagraphs: splitParagraphs(
      acfStr(getAcfValue(acf, "sub_serv_page_main_description"))
    ),
    mainImageUrl: acfImageUrl(
      getAcfValue(acf, "add_a_sub_page_main_image") as
        | { url?: string }
        | false
        | null
        | undefined
    ),
    whyChooseHeading: acfStr(getAcfValue(acf, "why_choose_us")),
    whyChoosePoints,
  };
}
