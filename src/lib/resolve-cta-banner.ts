import { fetchHomePage, fetchPageBySlug } from "@/lib/wordpress";
import { extractCtaBannerAcf, type CtaBannerAcf } from "@/lib/cta-banner";

export function pageSlugFromPathname(pathname: string): string {
  if (!pathname || pathname === "/") return "home";
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "home";
}

export async function resolveCtaBannerForPageSlug(pageSlug: string): Promise<CtaBannerAcf | null> {
  if (pageSlug !== "home") {
    const page = (await fetchPageBySlug(pageSlug)) as { acf?: Record<string, unknown> } | null;
    const fromPage = extractCtaBannerAcf(page?.acf);
    if (fromPage) return fromPage;
  }

  const homePages = await fetchHomePage();
  const homePage = homePages?.[0] as { acf?: Record<string, unknown> } | undefined;
  return extractCtaBannerAcf(homePage?.acf);
}
