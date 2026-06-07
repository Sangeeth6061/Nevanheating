import { Flame } from "lucide-react";
import { fetchHomePage } from "@/lib/wordpress";
import HeroSlider from "@/components/HeroSlider";

const getIconColorClasses = (iconUrl: string) => {
  const url = iconUrl ? iconUrl.toLowerCase() : "";
  if (url.includes("flame")) {
    return {
      bg: "bg-[#FFF5EC] border border-[#FFEADA]",
    };
  }
  if (url.includes("wrench") || url.includes("water-drops") || url.includes("water")) {
    return {
      bg: "bg-[#EDF5FF] border border-[#DDECFF]",
    };
  }
  if (url.includes("bolt")) {
    return {
      bg: "bg-[#FFF0F0] border border-[#FFE1E1]",
    };
  }
  if (url.includes("bathroom")) {
    return {
      bg: "bg-[#F7F4FF] border border-[#ECE6FF]",
    };
  }
  if (url.includes("security")) {
    return {
      bg: "bg-[#ECFDF5] border border-[#D1FAE5]",
    };
  }
  return {
    bg: "bg-slate-50 border border-slate-100",
  };
};

export default async function Home() {
  // Dynamically fetch results from WordPress endpoints
  const homePages = await fetchHomePage();
  const homeData = homePages?.[0]?.acf || null;

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
        {!homeData || !homeData.service_card || homeData.service_card.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>Loading services from WordPress... Please ensure NEXT_PUBLIC_WORDPRESS_URL is correct and the homepage contains ACF service cards.</p>
          </div>
        ) : (
          <>
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              {homeData["2nd_section_what_we_do"] && (
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 block">
                  {homeData["2nd_section_what_we_do"]}
                </span>
              )}
              {homeData["2nd_section_title"] && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4 font-heading">
                  {homeData["2nd_section_title"]}
                </h2>
              )}
              {homeData["2nd_section_description"] && (
                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {homeData["2nd_section_description"]}
                </p>
              )}
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
              {homeData.service_card.map((card: any, index: number) => {
                const title = card.add_a_serv_card_title;
                const description = card.add_a_serv_card_description;
                const iconUrl = card.add_a_serv_card_icon?.url;
                const buttonText = card.add_a_serv_card_learn_more_button || "Learn More";
                const buttonIconUrl = card.add_a_serv_card_button_icon?.url;
                
                const colors = getIconColorClasses(iconUrl);

                return (
                  <div 
                    key={index} 
                    className="group bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 flex flex-col items-start gap-4 hover:shadow-[0_20px_40px_rgba(15,23,42,0.05)] hover:-translate-y-1.5 transition-all duration-300 ease-out"
                  >
                    {/* Icon Container */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-105 ${colors.bg}`}>
                      {iconUrl ? (
                        <img 
                          src={iconUrl} 
                          alt={card.add_a_serv_card_icon?.title || title} 
                          className="w-7 h-7 object-contain" 
                        />
                      ) : (
                        <Flame className="w-7 h-7 text-slate-300" />
                      )}
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
            {homeData.view_all_services_button && (
              <div className="mt-16 text-center">
                <a 
                  href="#"
                  className="group inline-flex items-center justify-center bg-[#0F172A] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300 gap-3 text-base"
                >
                  <span>{homeData.view_all_services_button}</span>
                  {homeData.view_all_serv_arrow?.url && (
                    <img 
                      src={homeData.view_all_serv_arrow.url} 
                      alt="arrow" 
                      className="w-5 h-5 object-contain brightness-0 invert group-hover:translate-x-1 transition-transform duration-300"
                    />
                  )}
                </a>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
