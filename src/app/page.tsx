import Link from "next/link";
import { Flame, Wrench, Zap, Droplet, Bath, ShieldCheck, Check } from "lucide-react";
import { fetchHomePage, fetchHeader, fetchServices } from "@/lib/wordpress";
import { findMenuPath, findServicePath, wpUrlToPath, CONTACT_NUMBER, telHref } from "@/lib/wp-utils";
import HeroSlider from "@/components/HeroSlider";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

type AcfRecord = Record<string, unknown>;
type ServicePost = { slug: string; title: { rendered: string }; link: string };

function acfStr(data: AcfRecord | null | undefined, key: string): string | undefined {
  const value = data?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

const getIconColorClasses = (iconUrl: string, iconName?: string) => {
  const url = iconUrl ? iconUrl.toLowerCase() : "";
  const name = iconName ? iconName.toLowerCase() : "";

  if (url.includes("flame") || name.includes("flame")) {
    return { bg: "bg-[#FFF5EC] border border-[#FFEADA]" };
  }
  if (
    url.includes("wrench") || url.includes("water-drops") || url.includes("water") ||
    name.includes("wrench") || name.includes("water-drops") || name.includes("water")
  ) {
    return { bg: "bg-[#EDF5FF] border border-[#DDECFF]" };
  }
  if (url.includes("bolt") || name.includes("bolt") || name.includes("zap") || name.includes("emergency")) {
    return { bg: "bg-[#FFF0F0] border border-[#FFE1E1]" };
  }
  if (url.includes("bathroom") || name.includes("bathroom") || name.includes("bath")) {
    return { bg: "bg-[#F7F4FF] border border-[#ECE6FF]" };
  }
  if (url.includes("security") || name.includes("security") || name.includes("shield")) {
    return { bg: "bg-[#ECFDF5] border border-[#D1FAE5]" };
  }
  return { bg: "bg-slate-50 border border-slate-100" };
};

const renderCardIcon = (iconName?: string, iconUrl?: string, title?: string) => {
  if (iconUrl) {
    return <img src={iconUrl} alt={title || "icon"} className="w-7 h-7 object-contain" />;
  }

  const name = iconName ? iconName.toLowerCase() : "";
  if (name.includes("flame")) return <Flame className="w-7 h-7 text-orange-500" />;
  if (name.includes("wrench")) return <Wrench className="w-7 h-7 text-blue-500" />;
  if (name.includes("bolt") || name.includes("zap") || name.includes("emergency")) {
    return <Zap className="w-7 h-7 text-red-500" />;
  }
  if (name.includes("water") || name.includes("drop")) return <Droplet className="w-7 h-7 text-blue-500" />;
  if (name.includes("bathroom") || name.includes("bath")) return <Bath className="w-7 h-7 text-purple-500" />;
  if (name.includes("security") || name.includes("shield")) return <ShieldCheck className="w-7 h-7 text-emerald-500" />;
  return <Flame className="w-7 h-7 text-slate-300" />;
};

function buildHeroStats(homeData: AcfRecord | null) {
  if (!homeData) return [];

  const stats: { value: string; label: string }[] = [];

  const years = homeData["3rd_section_years_of_experiance"] as string | undefined;
  const yearsLabel = homeData["years_of_experiance_text"] as string | undefined;
  if (years && yearsLabel) {
    stats.push({ value: years, label: yearsLabel });
  }

  const points = homeData["add_3rd_section_why_choose_us_points"] as AcfRecord[] | undefined;
  const emergencyPoint = points?.find((point) => {
    const title = point["3rd_section_point_title"] as string | undefined;
    return title?.toLowerCase().includes("24/7");
  });
  if (emergencyPoint) {
    const title = emergencyPoint["3rd_section_point_title"] as string | undefined;
    if (title) {
      stats.push({ value: "24/7", label: title });
    }
  }

  const ratingPoint = points?.find((point) => {
    const title = point["3rd_section_point_title"] as string | undefined;
    return title?.toLowerCase().includes("star") || title?.toLowerCase().includes("rated");
  });
  if (ratingPoint) {
    const title = ratingPoint["3rd_section_point_title"] as string | undefined;
    const desc = ratingPoint["3rd_section_point_description"] as string | undefined;
    const match = desc?.match(/\d+\+/);
    if (match && title) {
      stats.push({ value: match[0], label: title });
    }
  }

  return stats;
}

export default async function Home() {
  const [homePages, headerData, services] = await Promise.all([
    fetchHomePage(),
    fetchHeader(),
    fetchServices(),
  ]);

  const homeData = (homePages?.[0] as { acf?: AcfRecord } | undefined)?.acf ?? null;
  const servicePosts = services as ServicePost[];
  const servicesPagePath = findMenuPath(
    headerData?.menu as Array<{ page_name?: string; page_link?: { url?: string } }>,
    "Services"
  );

  const quoteButtonText = headerData?.button_text as string | undefined;
  const quoteLink = wpUrlToPath((headerData?.button_link as { url?: string } | undefined)?.url);
  const contactNumber = CONTACT_NUMBER;

  const section2Eyebrow = acfStr(homeData, "2nd_section_what_we_do");
  const section2Title = acfStr(homeData, "2nd_section_title");
  const section2Description = acfStr(homeData, "2nd_section_description");
  const viewAllServicesButton = acfStr(homeData, "view_all_services_button");
  const viewAllServArrow = (homeData?.view_all_serv_arrow as { url?: string } | undefined)?.url;
  const section3Title = acfStr(homeData, "3rd_section_title");
  const section3SubTitle = acfStr(homeData, "3rd_section_sub_title");
  const section3Text = acfStr(homeData, "3rd_section_text_area");
  const section3Years = acfStr(homeData, "3rd_section_years_of_experiance");
  const section3YearsLabel = acfStr(homeData, "years_of_experiance_text");
  const section4Title = acfStr(homeData, "4th_section_title");
  const section4SubTitle = acfStr(homeData, "4th_section_sub_title");
  const section5Title = acfStr(homeData, "5th_section_banner_title");
  const section5Description = acfStr(homeData, "5th_section_banner_description");
  const section5CallLabel = acfStr(homeData, "5th_section_");
  const section5SecondButtonLabel = acfStr(homeData, "5th_section_2nd_button_link");
  const section5CallIcon = (homeData?.["5th_section_call_icon"] as { url?: string } | undefined)?.url;
  const section5SecondButtonImage = (homeData?.["5th_section_2nd_button_image"] as { url?: string } | undefined)?.url;
  const section3Image = (homeData?.["3rd_section_image"] as { url?: string } | undefined)?.url;

  const slider = homeData?.slider as unknown[] | undefined;
  const serviceCards = (homeData?.service_card as AcfRecord[] | undefined) ?? [];
  const whyChooseUsPoints = (homeData?.["add_3rd_section_why_choose_us_points"] as AcfRecord[] | undefined) ?? [];
  const testimonials = (homeData?.["4th_sectioon_testimonials"] as AcfRecord[] | undefined) ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {slider && slider.length > 0 && (
        <HeroSlider
          slides={slider as never[]}
          quoteButtonText={quoteButtonText}
          quoteButtonLink={quoteLink}
          contactNumber={contactNumber}
          heroStats={buildHeroStats(homeData)}
          showRating={false}
        />
      )}

      {serviceCards.length > 0 && (
        <section className="flex flex-col py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full bg-[#F8FAFC] my-12 rounded-[40px] shadow-[0_2px_40px_rgba(0,0,0,0.02)]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {section2Eyebrow && (
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 block">
                {section2Eyebrow}
              </span>
            )}
            {section2Title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4 font-heading">
                {section2Title}
              </h2>
            )}
            {section2Description && (
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                {section2Description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
            {serviceCards.map((card, index) => {
              const title = card.add_a_serv_card_title as string | undefined;
              const description = card.add_a_serv_card_description as string | undefined;
              const icon = card.add_a_serv_card_icon as { url?: string; name?: string } | undefined;
              const buttonText = (card.add_a_serv_card_learn_more_button as string | undefined) || "Learn More";
              const buttonIcon = card.add_a_serv_card_button_icon as { url?: string } | undefined;
              const cardLink = findServicePath(title, servicePosts) || servicesPagePath;
              const colors = getIconColorClasses(icon?.url ?? "", icon?.name);

              return (
                <div
                  key={index}
                  className="group bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 flex flex-col items-start gap-4 hover:shadow-[0_20px_40px_rgba(15,23,42,0.05)] hover:-translate-y-1.5 transition-all duration-300 ease-out"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-105 ${colors.bg}`}>
                    {renderCardIcon(icon?.name, icon?.url, title)}
                  </div>

                  <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight font-heading group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                  </h3>

                  <p className="text-slate-500 text-[15px] leading-relaxed mb-4 flex-1">
                    {description}
                  </p>

                  <Link
                    href={cardLink}
                    className="text-[#2563EB] font-bold text-[15px] flex items-center gap-1.5 hover:text-blue-700 transition-colors mt-auto group/link"
                  >
                    <span>{buttonText}</span>
                    {buttonIcon?.url ? (
                      <img
                        src={buttonIcon.url}
                        alt=""
                        className="w-4 h-4 object-contain group-hover/link:translate-x-1.5 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-xl leading-none font-normal ml-1 group-hover/link:translate-x-1.5 transition-transform duration-300">
                        &rarr;
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {viewAllServicesButton && (
            <div className="mt-16 text-center">
              <Link
                href={servicesPagePath}
                className="group inline-flex items-center justify-center bg-[#0F172A] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300 gap-3 text-base"
              >
                <span>{viewAllServicesButton}</span>
                {viewAllServArrow ? (
                  <img
                    src={viewAllServArrow}
                    alt=""
                    className="w-5 h-5 object-contain brightness-0 invert group-hover:translate-x-1 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xl leading-none font-normal ml-1 transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                )}
              </Link>
            </div>
          )}
        </section>
      )}

      {homeData && (section3Title || whyChooseUsPoints.length > 0) && (
        <section className="bg-[#F8F9FA] py-20 lg:py-24 w-full">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative flex justify-center lg:justify-start">
                <div className="relative w-full max-w-[540px]">
                  <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-slate-100">
                    {(section3Image) ? (
                      <img
                        src={section3Image}
                        alt={section3SubTitle || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flame className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {section3Years && (
                    <div className="absolute -bottom-5 right-4 sm:right-6 bg-[#2563EB] text-white rounded-2xl px-7 py-5 shadow-[0_12px_40px_rgba(37,99,235,0.35)] min-w-[160px] z-10">
                      <span className="block text-[42px] font-extrabold leading-none mb-1 font-heading">
                        {section3Years}
                      </span>
                      {section3YearsLabel && (
                        <span className="block text-sm font-semibold text-white/95 leading-snug">
                          {section3YearsLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start lg:pl-4 xl:pl-8">
                {section3Title && (
                  <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                    {section3Title}
                  </span>
                )}
                {section3SubTitle && (
                  <h2 className="text-3xl md:text-4xl lg:text-[42px] leading-[1.15] font-extrabold text-[#1E293B] tracking-tight mb-5 font-heading">
                    {section3SubTitle}
                  </h2>
                )}
                {section3Text && (
                  <p className="text-[#64748B] text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                    {section3Text}
                  </p>
                )}

                {whyChooseUsPoints.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 w-full">
                    {whyChooseUsPoints.map((point, index) => {
                      const pTitle = point["3rd_section_point_title"] as string | undefined;
                      const pDesc = point["3rd_section_point_description"] as string | undefined;
                      const pImgUrl = (point["3rd_section_point_image"] as { url?: string } | undefined)?.url;

                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-full bg-[#EDF5FF] border border-[#DDECFF] flex items-center justify-center shrink-0">
                            {pImgUrl ? (
                              <img src={pImgUrl} alt="" className="w-5 h-5 object-contain" />
                            ) : (
                              <Check className="w-5 h-5 text-[#2563EB]" strokeWidth={3} />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h4 className="font-bold text-[#1E293B] text-base leading-snug mb-1.5">{pTitle}</h4>
                            <p className="text-[#64748B] text-sm leading-relaxed">{pDesc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-white py-20 lg:py-24 w-full">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-14 lg:mb-16">
              {section4Title && (
                <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                  {section4Title}
                </span>
              )}
              {section4SubTitle && (
                <h2 className="text-3xl md:text-4xl lg:text-[36px] font-extrabold text-[#1E3A8A] tracking-tight font-heading">
                  {section4SubTitle}
                </h2>
              )}
            </div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {section5Title && (
        <section className="bg-[#2563EB] w-full">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-14 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold text-white leading-tight font-heading">
                  {section5Title}
                </h2>
                {section5Description && (
                  <p className="text-white/90 text-base md:text-lg mt-3 leading-relaxed">
                    {section5Description}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                {contactNumber && (
                  <a
                    href={telHref(contactNumber)}
                    className="inline-flex items-center justify-center gap-2.5 bg-white text-[#2563EB] font-semibold text-[15px] px-7 py-3.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    {section5CallIcon ? (
                      <img
                        src={section5CallIcon}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                      </svg>
                    )}
                    <span>{section5CallLabel || contactNumber}</span>
                  </a>
                )}

                {section5SecondButtonLabel && (
                  <Link
                    href={quoteLink}
                    className="inline-flex items-center justify-center gap-2.5 border-2 border-white text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span>{section5SecondButtonLabel}</span>
                    {section5SecondButtonImage ? (
                      <img
                        src={section5SecondButtonImage}
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
      )}
    </div>
  );
}
