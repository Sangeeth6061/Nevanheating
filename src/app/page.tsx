import { Flame, Wrench, Zap, Droplet, Bath, ShieldCheck } from "lucide-react";
import { fetchHomePage } from "@/lib/wordpress";
import HeroSlider from "@/components/HeroSlider";

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

export default async function Home() {
  // Dynamically fetch results from WordPress endpoints
  const homePages = await fetchHomePage();
  const homeData = homePages?.[0]?.acf || null;

  const whatWeDo = homeData?.["2nd_section_what_we_do"] || "WHAT WE DO";
  const sectionTitle = homeData?.["2nd_section_title"] || "Our Plumbing & Heating Services";
  const sectionDescription = homeData?.["2nd_section_description"] || "We provide a comprehensive range of plumbing, heating, and gas services across Edinburgh. From boiler installs to emergency repairs, our experts are here to help.";

  const serviceCards = homeData?.service_card && homeData.service_card.length > 0 
    ? homeData.service_card 
    : FALLBACK_SERVICES;

  const viewAllBtnText = homeData?.view_all_services_button || "View All Services";

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
    </div>
  );
}
