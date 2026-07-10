import Link from "next/link";
import { headers } from "next/headers";
import { fetchHeader, fetchHomePage, fetchPageBySlug } from "@/lib/wordpress";
import { acfStr, extractCtaBannerAcf } from "@/lib/cta-banner";
import { CONTACT_NUMBER, telHref, wpUrlToPath } from "@/lib/wp-utils";

async function resolveCtaAcf() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  const pageSlug = pathname === "/" ? "home" : pathname.replace(/^\//, "").split("/")[0];

  if (pageSlug !== "home") {
    const page = (await fetchPageBySlug(pageSlug)) as { acf?: Record<string, unknown> } | null;
    const fromPage = extractCtaBannerAcf(page?.acf);
    if (fromPage) return fromPage;
  }

  const homePages = await fetchHomePage();
  const homePage = homePages?.[0] as { acf?: Record<string, unknown> } | undefined;
  return extractCtaBannerAcf(homePage?.acf);
}

export default async function CtaBanner() {
  const [ctaData, headerData] = await Promise.all([resolveCtaAcf(), fetchHeader()]);

  const title = acfStr(ctaData, "5th_section_banner_title");
  if (!title) return null;

  const description = acfStr(ctaData, "5th_section_banner_description");
  const callLabel = acfStr(ctaData, "5th_section_");
  const secondButtonLabel = acfStr(ctaData, "5th_section_2nd_button_link");
  const callIcon = (ctaData?.["5th_section_call_icon"] as { url?: string } | undefined)?.url;
  const secondButtonImage = (ctaData?.["5th_section_2nd_button_image"] as { url?: string } | undefined)?.url;
  const quoteLink = wpUrlToPath((headerData?.button_link as { url?: string } | undefined)?.url);

  return (
    <section className="bg-[#2563EB] w-full">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold text-white leading-tight font-heading">
              {title}
            </h2>
            {description && (
              <p className="text-white/90 text-base md:text-lg mt-3 leading-relaxed">{description}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <a
              href={telHref(CONTACT_NUMBER)}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-[#2563EB] font-semibold text-[15px] px-7 py-3.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              {callIcon ? (
                <img src={callIcon} alt="" className="w-5 h-5 object-contain" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                </svg>
              )}
              <span>{callLabel || CONTACT_NUMBER}</span>
            </a>

            {secondButtonLabel && (
              <Link
                href={quoteLink}
                className="inline-flex items-center justify-center gap-2.5 border-2 border-white text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span>{secondButtonLabel}</span>
                {secondButtonImage ? (
                  <img
                    src={secondButtonImage}
                    alt=""
                    className="w-4 h-4 object-contain brightness-0 invert"
                  />
                ) : (
                  <span className="text-lg leading-none">&rarr;</span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
