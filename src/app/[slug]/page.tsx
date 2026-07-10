import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPageBySlug } from "@/lib/wordpress";
import AboutHero from "@/components/AboutHero";
import AboutStorySection, { type AboutStoryPoint } from "@/components/AboutStorySection";
import GalleryGrid from "@/components/GalleryGrid";
import AboutStatsSection from "@/components/AboutStatsSection";
import AboutCoreValuesSection from "@/components/AboutCoreValuesSection";
import AboutTeamSection from "@/components/AboutTeamSection";
import { parseAboutStats } from "@/lib/about-stats";
import { parseAboutTeamMembers } from "@/lib/about-team";
import { parseAboutValueCards } from "@/lib/about-values";
import { parseGalleryItems } from "@/lib/gallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type WpPage = {
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
};

function acfStr(data: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = data?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function acfImageField(
  data: Record<string, unknown> | undefined,
  key: string
): { url?: string } | undefined {
  const value = data?.[key];
  if (value === false || value === null || value === undefined) return undefined;
  return value as { url?: string };
}

type HeroAcf = {
  title?: string;
  description?: string;
  breadcrumbsText?: string;
  breadcrumbsIcon?: { url?: string } | undefined;
  fallbackTitle?: boolean;
};

function getHeroAcf(slug: string, acf?: Record<string, unknown>): HeroAcf | null {
  if (slug === "about") {
    return {
      title: acfStr(acf, "about_page_1st_section_title"),
      description: acfStr(acf, "about_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "about_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon: acfImageField(acf, "about_page_1st_section_bread_crumbs_icon"),
    };
  }

  if (slug === "gallery") {
    return {
      title:
        acfStr(acf, "gallery_page_1st_section_title") ??
        acfStr(acf, "about_page_1st_section_title"),
      description:
        acfStr(acf, "gallery_page_1st_section_text_area") ??
        acfStr(acf, "about_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "gallery_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon:
        acfImageField(acf, "gallery_page_1st_section_bread_crumbs_icon") ??
        acfImageField(acf, "about_page_1st_section_bread_crumbs_icon"),
      fallbackTitle: true,
    };
  }

  if (slug === "blog") {
    return {
      title:
        acfStr(acf, "blog_page_1st_section_title") ??
        acfStr(acf, "blogt_page_1st_section_title"),
      description: acfStr(acf, "blog_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "blog_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon: acfImageField(acf, "blog_page_1st_section_bread_crumbs_icon"),
      fallbackTitle: true,
    };
  }

  if (slug === "faq") {
    return {
      title: acfStr(acf, "faq_page_1st_section_title"),
      description: acfStr(acf, "faq_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "faq_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon: acfImageField(acf, "faq_page_1st_section_bread_crumbs_icon"),
    };
  }

  if (slug === "testimonials") {
    return {
      title: acfStr(acf, "testimonials_page_1st_section_title"),
      description: acfStr(acf, "testimonials_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "testimonials_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon: acfImageField(acf, "testimonials_page_1st_section_bread_crumbs_icon"),
    };
  }

  if (slug === "contact") {
    return {
      title: acfStr(acf, "contact_page_1st_section_title"),
      description: acfStr(acf, "contact_page_1st_section_text_area"),
      breadcrumbsText: acfStr(acf, "contact_page_1st_section_bread_crumbs_text"),
      breadcrumbsIcon: acfImageField(acf, "contact_page_1st_section_bread_crumbs_icon"),
      fallbackTitle: true,
    };
  }

  return null;
}

function parseAboutStoryPoints(acf?: Record<string, unknown>): AboutStoryPoint[] {
  const items = acf?.about_2nd_sec_add_a_points;
  if (!Array.isArray(items)) return [];

  return items
    .map((item): AboutStoryPoint => {
      const row = item as Record<string, unknown>;
      const icon = row.about_2nd_section_points as { url?: string } | undefined;
      const text =
        typeof row.about_2nd_sec_add_a_text === "string" ? row.about_2nd_sec_add_a_text : undefined;
      return { text, iconUrl: icon?.url };
    })
    .filter((point) => Boolean(point.text));
}

function PageWithHero({
  page,
  hero,
  slug,
  acf,
}: {
  page: WpPage;
  hero: HeroAcf;
  slug?: string;
  acf?: Record<string, unknown>;
}) {
  const pageTitle = page.title?.rendered;
  const heroTitle = hero.title ?? (hero.fallbackTitle ? pageTitle : undefined);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {heroTitle && (
        <AboutHero
          title={heroTitle}
          description={hero.description}
          breadcrumbsText={hero.breadcrumbsText}
          breadcrumbsIcon={hero.breadcrumbsIcon}
          pageTitle={pageTitle}
        />
      )}

      {slug === "about" && (
        <AboutStorySection
          subHeading={acfStr(acf, "about_2nd_sec_sub_heading")}
          heading={acfStr(acf, "about_2nd_sec_heading")}
          textArea={acfStr(acf, "about_2nd_sec_text_area")}
          points={parseAboutStoryPoints(acf)}
          imageUrl={acfImageField(acf, "about_2nd_sec_image")?.url}
          establishedYear={acfStr(acf, "about_2nd_sec_established_year_")}
          establishedText={acfStr(acf, "about_2nd_sec_established_text_")}
        />
      )}

      {slug === "about" && <AboutStatsSection stats={parseAboutStats(acf)} />}

      {slug === "about" && (
        <AboutCoreValuesSection
          subHeading={acfStr(acf, "about_4th_sec_sub_heading")}
          heading={acfStr(acf, "about_4th_sec_heading")}
          cards={parseAboutValueCards(acf)}
        />
      )}

      {slug === "about" && (
        <AboutTeamSection
          subHeading={acfStr(acf, "about_5th_sec_heading")}
          heading={acfStr(acf, "about_5th_sec_sub_heading")}
          members={parseAboutTeamMembers(acf)}
        />
      )}

      {slug === "gallery" && <GalleryGrid items={parseGalleryItems(acf)} />}

      {page.content?.rendered ? (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 lg:py-16">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        </div>
      ) : null}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") return {};

  const page = (await fetchPageBySlug(slug)) as WpPage | null;
  if (!page?.title?.rendered) return {};

  return { title: page.title.rendered };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "home") {
    redirect("/");
  }

  const page = (await fetchPageBySlug(slug)) as WpPage | null;

  if (!page) {
    notFound();
  }

  const acf = page.acf;
  const pageTitle = page.title?.rendered;
  const heroAcf = getHeroAcf(slug, acf);

  if (heroAcf) {
    return <PageWithHero page={page} hero={heroAcf} slug={slug} acf={acf} />;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-8 font-heading">
        {pageTitle}
      </h1>
      {page.content?.rendered ? (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      ) : (
        <p className="text-slate-500">Content coming soon.</p>
      )}
    </div>
  );
}
