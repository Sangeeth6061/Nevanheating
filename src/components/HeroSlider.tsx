"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Check, Award, Star } from "lucide-react";

interface Feature {
  slider_2_icon?: { url: string };
  slider_2_feature: string;
}

interface SlideData {
  heading_h1: string;
  phargarph_slider2: string;
  features: Feature[];
  slider_image?: { url: string };
  feature_title?: string;
  feature_title_icon?: { url: string };
}

interface HeroStat {
  value: string;
  label: string;
}

interface HeroSliderProps {
  slides: SlideData[];
  quoteButtonText?: string;
  quoteButtonLink?: string;
  contactNumber?: string;
  heroStats?: HeroStat[];
  showRating?: boolean;
  ratingLabel?: string;
}

export default function HeroSlider({
  slides,
  quoteButtonText,
  quoteButtonLink,
  contactNumber,
  heroStats = [],
  showRating = false,
  ratingLabel,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full shrink-0">
            <section className="px-6 lg:px-12 py-12 lg:py-20 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <div className="flex flex-col lg:col-span-7 pr-0 lg:pr-8 xl:pr-12 relative min-h-[500px] lg:min-h-0">
                <h1 className="text-[40px] md:text-[56px] xl:text-[60px] leading-[1.000001] font-bold text-[#1e40af] mb-6 tracking-tight">
                  {slide.heading_h1}
                </h1>

                <p className="text-lg text-slate-600 mb-8 max-w-[600px] leading-relaxed bg-slate-100/50 p-1 decoration-clone inline-block">
                  {slide.phargarph_slider2}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 w-full max-w-[600px]">
                  {slide.features?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[#1e3a8a] font-medium text-[15px]">
                      <div className="shrink-0 w-5 h-5 rounded-full border-[1.5px] border-[#2563EB] flex items-center justify-center bg-white">
                        {item.slider_2_icon?.url ? (
                          <img src={item.slider_2_icon.url} alt="" className="w-3.5 h-3.5 object-contain" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={3} />
                        )}
                      </div>
                      {item.slider_2_feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full">
                  {quoteButtonText && quoteButtonLink && (
                    <Link
                      href={quoteButtonLink}
                      className="inline-flex items-center justify-center bg-[#1e40af] hover:bg-blue-800 text-white rounded-xl px-8 h-14 shadow-sm text-[16px] font-semibold transition-colors"
                    >
                      {quoteButtonText}
                    </Link>
                  )}
                  {contactNumber && (
                    <a
                      href={`tel:${contactNumber.replace(/\s+/g, "")}`}
                      className="inline-flex items-center justify-center gap-2 text-[#1e40af] border border-[#1e3a8a]/20 hover:bg-blue-50 rounded-xl px-8 h-14 shadow-sm text-[16px] font-semibold bg-white transition-colors"
                    >
                      <Phone className="w-5 h-5 text-[#2563EB]" />
                      {contactNumber}
                    </a>
                  )}
                </div>

                {(heroStats.length > 0 || showRating) && (
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-6 lg:gap-12 border-t border-slate-100 pt-8 w-full">
                    {heroStats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-3xl font-extrabold text-[#111827]">{stat.value}</span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                    {showRating && ratingLabel && (
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 lg:ml-auto">
                        <div className="flex text-yellow-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">
                          {ratingLabel}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[640px] xl:h-[700px] rounded-bl-[40px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[40px] overflow-visible lg:col-span-5 bg-slate-100 z-10 mt-8 lg:mt-0">
                {slide.slider_image?.url && (
                  <img
                    src={slide.slider_image.url}
                    alt={slide.heading_h1}
                    className="w-full h-full object-cover rounded-[inherit] absolute inset-0 z-0 shadow-lg"
                  />
                )}

                <div className="absolute -z-10 top-8 -right-8 w-full h-full border-[3px] border-slate-100 rounded-[inherit] hidden lg:block" />

                {(slide.feature_title || slide.feature_title_icon) && (
                  <div className="absolute -bottom-6 sm:bottom-8 left-4 sm:-left-10 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4 border border-slate-100 z-20 w-[90%] sm:w-auto max-w-[280px]">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      {slide.feature_title_icon?.url ? (
                        <img src={slide.feature_title_icon.url} className="w-6 h-6 object-contain" alt="" />
                      ) : (
                        <Award className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1e40af] text-[15px] leading-tight">
                        {slide.feature_title}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex gap-3 justify-center z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-[#1e40af] w-8" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
