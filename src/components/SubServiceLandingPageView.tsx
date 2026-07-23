import AboutHero from "@/components/AboutHero";
import SubServicePageSection from "@/components/SubServicePageSection";
import {
  getSubServicePageHero,
  parseSubServicePageContent,
} from "@/lib/sub-service-page";

type SubServiceLandingPageViewProps = {
  page: {
    title?: { rendered?: string };
    content?: { rendered?: string };
    acf?: Record<string, unknown>;
  };
};

export default function SubServiceLandingPageView({ page }: SubServiceLandingPageViewProps) {
  const acf = page.acf;
  const hero = getSubServicePageHero(acf, page.title?.rendered);
  const content = parseSubServicePageContent(acf);
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
      <SubServicePageSection content={content} />
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
