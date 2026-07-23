import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPageBySlug, fetchPublishedPages } from "@/lib/wordpress";
import { getLegacyPageRedirectPath } from "@/lib/page-route";
import {
  getLegacyServiceSectionRedirect,
  resolveServiceSubpageHref,
} from "@/lib/legacy-service-redirects";
import {
  filterSubServiceLandingPages,
  isSubServiceLandingPage,
} from "@/lib/sub-service-page";
import SubServiceLandingPageView from "@/components/SubServiceLandingPageView";
import { stripHtml } from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type WpPage = {
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
};

async function fetchSubServiceLandingBySlug(slug: string): Promise<WpPage | null> {
  const page = (await fetchPageBySlug(slug)) as WpPage | null;
  if (!page?.acf || !isSubServiceLandingPage(page.acf)) return null;
  return page;
}

function landingSlugFromHref(href: string): string {
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export async function generateStaticParams() {
  const publishedPages = await fetchPublishedPages();
  return filterSubServiceLandingPages(publishedPages).map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const legacyService = getLegacyServiceSectionRedirect(slug);
  const lookupSlug = legacyService ? landingSlugFromHref(legacyService) : slug;

  const landing = await fetchSubServiceLandingBySlug(lookupSlug);
  if (landing?.title?.rendered) {
    return { title: stripHtml(landing.title.rendered) };
  }

  return {};
}

export default async function ServiceSubPage({ params }: PageProps) {
  const { slug } = await params;

  const legacyPage = getLegacyPageRedirectPath(slug);
  if (legacyPage) {
    redirect(legacyPage);
  }

  const legacyService = getLegacyServiceSectionRedirect(slug);
  if (legacyService) {
    redirect(legacyService);
  }

  const landingPage = await fetchSubServiceLandingBySlug(slug);
  if (landingPage) {
    return <SubServiceLandingPageView page={landingPage} />;
  }

  const canonical = resolveServiceSubpageHref(slug);
  if (canonical !== `/services/${slug}`) {
    redirect(canonical);
  }

  notFound();
}
