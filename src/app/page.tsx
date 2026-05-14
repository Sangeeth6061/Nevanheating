import { Button } from "@/components/ui/button";
import { Phone, Flame, ChevronDown, Check, Star, Award } from "lucide-react";
import { fetchServices, fetchHomePage } from "@/lib/wordpress";
import HeroSlider from "@/components/HeroSlider";
export default async function Home() {
  // Dynamically fetch results from WordPress endpoints
  const [services, homePages] = await Promise.all([
    fetchServices(),
    fetchHomePage()
  ]);

  const homeData = homePages?.[0]?.acf || null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      {homeData && homeData.slider && (
        <HeroSlider 
          slides={homeData.slider} 
        />
      )}

      {/* Main Services Section */}
      <main className="flex flex-col py-16 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full bg-[#F8FAFC] my-12 rounded-[40px]">
        {services.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>Loading services from WordPress... Please ensure NEXT_PUBLIC_WORDPRESS_URL is correct and the endpoint provides data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
            {services.map((service: any) => {
              const iconBg = "bg-white border border-slate-100 shadow-sm";
              const iconUrl = service.acf?.icon?.url;
              const hasButtonURL = service.acf?.button_link || "#";
              const buttonText = service.acf?.button || "Learn More";

              return (
                <div key={service.id} className="bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_2px_18px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-start gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${iconBg}`}>
                    {iconUrl ? (
                      <img src={iconUrl} alt={service.acf?.icon?.title || service.title?.rendered} className="w-7 h-7 object-contain" />
                    ) : (
                      <Flame className="w-7 h-7 text-slate-300" />
                    )}
                  </div>
                  <h3 className="text-[22px] font-bold text-[#1e40af] leading-tight">
                    {service.acf?.heading || service.title?.rendered}
                  </h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-4 flex-1">
                    {service.acf?.description}
                  </p>
                  <a href={hasButtonURL} className="text-[#2563EB] font-semibold text-[15px] flex items-center gap-1 hover:text-[#1e40af] transition-colors mt-auto">
                    {buttonText} <span className="text-xl leading-none font-normal ml-1">&rarr;</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
