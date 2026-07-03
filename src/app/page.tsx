import { Flame, Wrench, Zap, Droplet, Bath, ShieldCheck, Check } from "lucide-react";
import { fetchHomePage, fetchHeader } from "@/lib/wordpress";
import HeroSlider from "@/components/HeroSlider";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const getIconColorClasses = (iconUrl: string, iconName?: string) => {
  const url = iconUrl ? iconUrl.toLowerCase() : "";
  const name = iconName ? iconName.toLowerCase() : "";

  if (url.includes("flame") || name.includes("flame")) {
    return {
      bg: "bg-[#FFF5EC] border border-[#FFEADA]",
    };
  }
  if (
    url.includes("wrench") || url.includes("water-drops") || url.includes("water") ||
    name.includes("wrench") || name.includes("water-drops") || name.includes("water")
  ) {
    return {
      bg: "bg-[#EDF5FF] border border-[#DDECFF]",
    };
  }
  if (url.includes("bolt") || name.includes("bolt") || name.includes("zap") || name.includes("emergency")) {
    return {
      bg: "bg-[#FFF0F0] border border-[#FFE1E1]",
    };
  }
  if (url.includes("bathroom") || name.includes("bathroom") || name.includes("bath")) {
    return {
      bg: "bg-[#F7F4FF] border border-[#ECE6FF]",
    };
  }
  if (url.includes("security") || name.includes("security") || name.includes("shield")) {
    return {
      bg: "bg-[#ECFDF5] border border-[#D1FAE5]",
    };
  }
  return {
    bg: "bg-slate-50 border border-slate-100",
  };
};

const renderCardIcon = (iconName?: string, iconUrl?: string, title?: string) => {
  if (iconUrl) {
    return <img src={iconUrl} alt={title || "icon"} className="w-7 h-7 object-contain" />;
  }

  const name = iconName ? iconName.toLowerCase() : "";
  if (name.includes("flame")) {
    return <Flame className="w-7 h-7 text-orange-500" />;
  }
  if (name.includes("wrench")) {
    return <Wrench className="w-7 h-7 text-blue-500" />;
  }
  if (name.includes("bolt") || name.includes("zap") || name.includes("emergency")) {
    return <Zap className="w-7 h-7 text-red-500" />;
  }
  if (name.includes("water") || name.includes("drop")) {
    return <Droplet className="w-7 h-7 text-blue-500" />;
  }
  if (name.includes("bathroom") || name.includes("bath")) {
    return <Bath className="w-7 h-7 text-purple-500" />;
  }
  if (name.includes("security") || name.includes("shield")) {
    return <ShieldCheck className="w-7 h-7 text-emerald-500" />;
  }
  return <Flame className="w-7 h-7 text-slate-300" />;
};

const FALLBACK_SERVICES = [
  {
    add_a_serv_card_title: "Boiler Installation",
    add_a_serv_card_description: "Expert installation of all major boiler brands with full commissioning and warranty.",
    add_a_serv_card_icon: { name: "flame" },
    add_a_serv_card_learn_more_button: "Learn More",
  },
  {
    add_a_serv_card_title: "Boiler Repair & Service",
    add_a_serv_card_description: "Fast, reliable boiler repairs and annual servicing to keep your heating running efficiently.",
    add_a_serv_card_icon: { name: "wrench" },
    add_a_serv_card_learn_more_button: "Learn More",
  },
  {
    add_a_serv_card_title: "Emergency Plumbing",
    add_a_serv_card_description: "24/7 emergency response for burst pipes, leaks, and urgent plumbing issues across Edinburgh.",
    add_a_serv_card_icon: { name: "bolt" },
    add_a_serv_card_learn_more_button: "Learn More",
  },
  {
    add_a_serv_card_title: "Central Heating",
    add_a_serv_card_description: "Full central heating system design, installation and upgrades for your home or business.",
    add_a_serv_card_icon: { name: "water" },
    add_a_serv_card_learn_more_button: "Learn More",
  },
  {
    add_a_serv_card_title: "Bathroom Fitting",
    add_a_serv_card_description: "Complete bathroom design and installation — from showers and baths to full suite fitting.",
    add_a_serv_card_icon: { name: "bathroom" },
    add_a_serv_card_learn_more_button: "Learn More",
  },
  {
    add_a_serv_card_title: "Gas Safety Checks",
    add_a_serv_card_description: "Annual gas safety inspections and certificates for landlords and homeowners.",
    add_a_serv_card_icon: { name: "security" },
    add_a_serv_card_learn_more_button: "Learn More",
  }
];

const FALLBACK_POINTS = [
  {
    title: "Gas Safe Registered",
    description: "All engineers fully Gas Safe registered for your peace of mind.",
  },
  {
    title: "24/7 Emergency Response",
    description: "We're available around the clock for plumbing emergencies.",
  },
  {
    title: "No Hidden Costs",
    description: "Clear, upfront quotes with no surprise charges. Honest pricing.",
  },
  {
    title: "5-Star Rated Service",
    description: "100+ five-star reviews — our reputation speaks for itself.",
  }
];

const FALLBACK_TESTIMONIALS = [
  {
    "4th_section_customer_message": "\"Absolutely outstanding service. Nevan replaced our old boiler quickly and professionally. Friendly, tidy, and fair price. Highly recommend!\"",
    "4th_section_user_image": "SM",
    "4th_section_full_name": "Sarah Mitchell",
    "$th_section_full_name": "Edinburgh",
  },
  {
    "4th_section_customer_message": "\"Called for an emergency leak at 10pm. Arrived within the hour and fixed in no time. Exceptional service and very reasonably priced.\"",
    "4th_section_user_image": "JR",
    "4th_section_full_name": "James Robertson",
    "$th_section_full_name": "Leith",
  },
  {
    "4th_section_customer_message": "\"Had a full central heating system installed. Professional, respectful of our home, completed on time. Could not be happier.\"",
    "4th_section_user_image": "ET",
    "4th_section_full_name": "Emma Thompson",
    "$th_section_full_name": "Morningside",
  },
];

export default async function Home() {
  const [homePages, headerData] = await Promise.all([fetchHomePage(), fetchHeader()]);
  const homeData = homePages?.[0]?.acf || null;

  // Services section variables
  const whatWeDo = homeData?.["2nd_section_what_we_do"] || "WHAT WE DO";
  const sectionTitle = homeData?.["2nd_section_title"] || "Our Plumbing & Heating Services";
  const sectionDescription = homeData?.["2nd_section_description"] || "We provide a comprehensive range of plumbing, heating, and gas services across Edinburgh. From boiler installs to emergency repairs, our experts are here to help.";

  const serviceCards = homeData?.service_card && homeData.service_card.length > 0 
    ? homeData.service_card 
    : FALLBACK_SERVICES;

  const viewAllBtnText = homeData?.view_all_services_button || "View All Services";

  // Why Choose Us variables
  const whyChooseUsImageUrl = homeData?.["3rd_section_image"]?.url || null;
  const whyChooseUsYears = homeData?.["3rd_section_years_of_experiance"] || "15+";
  const whyChooseUsYearsText = homeData?.["years_of_experiance_text"] || "Years of Experience";
  const whyChooseUsTitle = homeData?.["3rd_section_title"] || "Why Choose Us";
  const whyChooseUsSubTitle = homeData?.["3rd_section_sub_title"] || "Edinburgh's Most Trusted Plumbing Specialists";
  const whyChooseUsTextArea = homeData?.["3rd_section_text_area"] || "With over 15 years serving Edinburgh, Nevan Plumbing and Heating has built a reputation for quality, reliability, and honest service.";

  const whyChooseUsPoints =
    homeData?.["add_3rd_section_why_choose_us_points"]?.length > 0
      ? homeData["add_3rd_section_why_choose_us_points"]
      : FALLBACK_POINTS;

  // Reviews section variables
  const reviewsTitle = homeData?.["4th_section_title"] || "Reviews";
  const reviewsSubTitle = homeData?.["4th_section_sub_title"] || "What Our Customers Say";
  const testimonials =
    homeData?.["4th_sectioon_testimonials"]?.length > 0
      ? homeData["4th_sectioon_testimonials"]
      : FALLBACK_TESTIMONIALS;

  // CTA banner variables
  const ctaTitle = homeData?.["5th_section_banner_title"] || "Need a Plumber or Heating Engineer?";
  const ctaDescription =
    homeData?.["5th_section_banner_description"] ||
    "Contact us today for a free, no-obligation quote.";
  const ctaCallIconUrl = homeData?.["5th_section_call_icon"]?.url || null;
  const ctaCallButtonText = homeData?.["5th_section_"] || "Call Now";
  const ctaQuoteButtonText = homeData?.["5th_section_2nd_button_link"] || "Get a Free Quote";
  const ctaQuoteButtonIconUrl = homeData?.["5th_section_2nd_button_image"]?.url || null;
  const contactNumber = headerData?.contact_number || "+44 123 456 7890";
  const quoteLink = headerData?.button_link?.url || "#";

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      {homeData && homeData.slider && (
        <HeroSlider 
          slides={homeData.slider} 
        />
      )}

      {/* Services Section */}
      <main className="flex flex-col py-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto w-full bg-[#F8FAFC] my-12 rounded-[40px] shadow-[0_2px_40px_rgba(0,0,0,0.02)]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 block">
            {whatWeDo}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4 font-heading">
            {sectionTitle}
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
          {serviceCards.map((card: any, index: number) => {
            const title = card.add_a_serv_card_title;
            const description = card.add_a_serv_card_description;
            const iconUrl = card.add_a_serv_card_icon?.url;
            const iconName = card.add_a_serv_card_icon?.name;
            const buttonText = card.add_a_serv_card_learn_more_button || "Learn More";
            const buttonIconUrl = card.add_a_serv_card_button_icon?.url;
            
            const colors = getIconColorClasses(iconUrl, iconName);

            return (
              <div 
                key={index} 
                className="group bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 flex flex-col items-start gap-4 hover:shadow-[0_20px_40px_rgba(15,23,42,0.05)] hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-105 ${colors.bg}`}>
                  {renderCardIcon(iconName, iconUrl, title)}
                </div>

                {/* Card Title */}
                <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight font-heading group-hover:text-blue-600 transition-colors duration-300">
                  {title}
                </h3>

                {/* Card Description */}
                <p className="text-slate-500 text-[15px] leading-relaxed mb-4 flex-1">
                  {description}
                </p>

                {/* Learn More Link */}
                <a 
                  href="#" 
                  className="text-[#2563EB] font-bold text-[15px] flex items-center gap-1.5 hover:text-blue-700 transition-colors mt-auto group/link"
                >
                  <span>{buttonText}</span> 
                  {buttonIconUrl ? (
                    <img 
                      src={buttonIconUrl} 
                      alt="arrow" 
                      className="w-4 h-4 object-contain group-hover/link:translate-x-1.5 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-xl leading-none font-normal ml-1 group-hover/link:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                  )}
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 text-center">
          <a 
            href="#"
            className="group inline-flex items-center justify-center bg-[#0F172A] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300 gap-3 text-base"
          >
            <span>{viewAllBtnText}</span>
            {homeData?.view_all_serv_arrow?.url ? (
              <img 
                src={homeData.view_all_serv_arrow.url} 
                alt="arrow" 
                className="w-5 h-5 object-contain brightness-0 invert group-hover:translate-x-1 transition-transform duration-300"
              />
            ) : (
              <span className="text-xl leading-none font-normal ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            )}
          </a>
        </div>
      </main>

      {/* Why Choose Us Section */}
      <section className="bg-[#F8F9FA] py-20 lg:py-24 w-full">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column — image with experience badge */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[540px]">
                <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-slate-100">
                  {whyChooseUsImageUrl ? (
                    <img
                      src={whyChooseUsImageUrl}
                      alt={whyChooseUsSubTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Flame className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-5 right-4 sm:right-6 bg-[#2563EB] text-white rounded-2xl px-7 py-5 shadow-[0_12px_40px_rgba(37,99,235,0.35)] min-w-[160px] z-10">
                  <span className="block text-[42px] font-extrabold leading-none mb-1 font-heading">
                    {whyChooseUsYears}
                  </span>
                  <span className="block text-sm font-semibold text-white/95 leading-snug">
                    {whyChooseUsYearsText}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — heading and feature points */}
            <div className="flex flex-col items-start lg:pl-4 xl:pl-8">
              <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                {whyChooseUsTitle}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] leading-[1.15] font-extrabold text-[#1E293B] tracking-tight mb-5 font-heading">
                {whyChooseUsSubTitle}
              </h2>
              <p className="text-[#64748B] text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                {whyChooseUsTextArea}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 w-full">
                {whyChooseUsPoints.map((point: Record<string, unknown>, index: number) => {
                  const pTitle =
                    (point["3rd_section_point_title"] as string | undefined) ||
                    (point.title as string | undefined);
                  const pDesc =
                    (point["3rd_section_point_description"] as string | undefined) ||
                    (point.description as string | undefined);
                  const pImgUrl =
                    (point["3rd_section_point_image"] as { url?: string } | undefined)?.url ||
                    (point.imageUrl as string | undefined);

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
                        <h4 className="font-bold text-[#1E293B] text-base leading-snug mb-1.5">
                          {pTitle}
                        </h4>
                        <p className="text-[#64748B] text-sm leading-relaxed">
                          {pDesc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-20 lg:py-24 w-full">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-14 lg:mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
              {reviewsTitle}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-extrabold text-[#1E3A8A] tracking-tight font-heading">
              {reviewsSubTitle}
            </h2>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="bg-[#2563EB] w-full">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold text-white leading-tight font-heading">
                {ctaTitle}
              </h2>
              <p className="text-white/90 text-base md:text-lg mt-3 leading-relaxed">
                {ctaDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <a
                href={`tel:${contactNumber.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2.5 bg-white text-[#2563EB] font-semibold text-[15px] px-7 py-3.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                {ctaCallIconUrl ? (
                  <img src={ctaCallIconUrl} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                  </svg>
                )}
                <span>{ctaCallButtonText}</span>
              </a>

              <a
                href={quoteLink}
                className="inline-flex items-center justify-center gap-2.5 border-2 border-white text-white font-semibold text-[15px] px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span>{ctaQuoteButtonText}</span>
                {ctaQuoteButtonIconUrl ? (
                  <img
                    src={ctaQuoteButtonIconUrl}
                    alt=""
                    className="w-4 h-4 object-contain brightness-0 invert"
                  />
                ) : (
                  <span className="text-lg leading-none">&rarr;</span>
                )}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
