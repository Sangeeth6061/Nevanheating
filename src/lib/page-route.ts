import { stripHtml } from "@/lib/blog";
import { titleToSlug, wpUrlToPath } from "@/lib/wp-utils";
import { fetchPageBySlug, fetchPublishedPages } from "@/lib/wordpress";

type WpPage = {
  slug?: string;
  link?: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
};

/** Retired WordPress slugs → canonical Next.js pathname. */
const LEGACY_PAGE_PATHS: Record<string, string> = {
  "500-2": "/services/certified-gas-services-safety-inspections",
};

function normalizePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment).trim();
  } catch {
    return segment.trim();
  }
}

export function normalizePathname(path: string): string {
  const base = path.split("?")[0].split("#")[0];
  if (base.length > 1 && base.endsWith("/")) return base.slice(0, -1);
  return base || "/";
}

export function getLegacyPageRedirectPath(slug: string): string | null {
  const key = normalizePathSegment(slug);
  return LEGACY_PAGE_PATHS[key] ?? null;
}

/** Prefer WordPress `link` so child pages under `/services/…` use the correct URL. */
export function getCanonicalPagePath(page: { slug?: string; link?: string }): string {
  if (page.link) {
    const fromLink = normalizePathname(wpUrlToPath(page.link));
    if (fromLink && fromLink !== "#") return fromLink;
  }
  return page.slug ? `/${page.slug}` : "/";
}

export function redirectPathIfNotCanonical(
  requestSlug: string,
  page: WpPage
): string | null {
  const legacy = getLegacyPageRedirectPath(requestSlug);
  if (legacy) return legacy;

  const canonical = getCanonicalPagePath(page);
  const requestPath = normalizePathname(`/${normalizePathSegment(requestSlug)}`);
  if (canonical !== requestPath) return canonical;
  return null;
}

/** Resolve a `[slug]` param to a WordPress page (handles titles vs real slugs). */
export async function fetchPageForRequestSlug(requestSlug: string): Promise<{
  page: WpPage | null;
  canonicalSlug: string;
}> {
  const segment = normalizePathSegment(requestSlug);

  const legacy = getLegacyPageRedirectPath(segment);
  if (legacy) {
    const legacySlug = legacy.split("/").filter(Boolean).pop() ?? segment;
    const page = (await fetchPageBySlug(legacySlug)) as WpPage | null;
    if (page?.slug) {
      return { page, canonicalSlug: page.slug };
    }
  }

  const direct = (await fetchPageBySlug(segment)) as WpPage | null;
  if (direct?.slug) {
    return { page: direct, canonicalSlug: direct.slug };
  }

  const slugFromTitle = titleToSlug(segment);
  if (slugFromTitle && slugFromTitle !== segment) {
    const byGeneratedSlug = (await fetchPageBySlug(slugFromTitle)) as WpPage | null;
    if (byGeneratedSlug?.slug) {
      return { page: byGeneratedSlug, canonicalSlug: byGeneratedSlug.slug };
    }
  }

  const needle = segment.toLowerCase();
  const pages = await fetchPublishedPages();
  const match = pages.find((p) => {
    const title = stripHtml(p.title?.rendered ?? "").toLowerCase();
    return title === needle || p.slug === slugFromTitle;
  });

  if (match?.slug) {
    const page = (await fetchPageBySlug(match.slug)) as WpPage | null;
    if (page) {
      return { page, canonicalSlug: match.slug };
    }
  }

  return { page: null, canonicalSlug: segment };
}
