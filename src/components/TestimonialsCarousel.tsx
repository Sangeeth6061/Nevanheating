"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VISIBLE_COUNT = 3;

const STAR_KEYS = [
  "4th_testimonials_stars",
  "4th_testimonials_stars_2",
  "4th_testimonials_stars_3",
  "4th_testimonials_stars_4",
  "5th_testimonials_stars_5",
] as const;

const getStars = (testimonial: Record<string, unknown>) =>
  STAR_KEYS.map((key) => {
    const star = testimonial[key] as { url?: string } | undefined;
    return star?.url;
  }).filter((url): url is string => Boolean(url));

interface TestimonialsCarouselProps {
  testimonials: Record<string, unknown>[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, testimonials.length - VISIBLE_COUNT);
  const totalDots = maxIndex + 1;
  const canSlide = testimonials.length > VISIBLE_COUNT;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), maxIndex));
    },
    [maxIndex]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!canSlide) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [canSlide, goNext]);

  if (!testimonials.length) return null;

  const trackWidthPercent = (testimonials.length / VISIBLE_COUNT) * 100;
  const slideWidthPercent = 100 / testimonials.length;

  return (
    <div className="relative">
      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#1E3A8A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#1E3A8A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="overflow-hidden mx-6 sm:mx-10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${trackWidthPercent}%`,
            transform: `translateX(-${currentIndex * slideWidthPercent}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => {
            const stars = getStars(testimonial);
            const quoteIconUrl = (testimonial["4th_section_quotes_icon"] as { url?: string } | undefined)?.url;
            const message = testimonial["4th_section_customer_message"] as string | undefined;
            const initials = testimonial["4th_section_user_image"] as string | undefined;
            const fullName = (testimonial["4th_section_full_name"] as string | undefined)?.trim();
            const location = testimonial["$th_section_full_name"] as string | undefined;

            return (
              <div
                key={index}
                className="shrink-0 px-3"
                style={{ width: `${slideWidthPercent}%` }}
              >
                <div className="bg-[#F8FAFC] rounded-xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100/80 flex flex-col h-full min-h-[280px]">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {stars.length > 0 ? (
                        stars.map((starUrl, starIndex) => (
                          <img
                            key={starIndex}
                            src={starUrl}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                        ))
                      ) : (
                        Array.from({ length: 5 }).map((_, starIndex) => (
                          <span key={starIndex} className="text-[#FBBF24] text-base leading-none">
                            ★
                          </span>
                        ))
                      )}
                    </div>
                    {quoteIconUrl ? (
                      <img
                        src={quoteIconUrl}
                        alt=""
                        className="w-10 h-10 object-contain opacity-20 shrink-0"
                      />
                    ) : (
                      <span className="text-5xl leading-none text-slate-200 font-serif select-none">
                        &ldquo;
                      </span>
                    )}
                  </div>

                  <p className="text-[#4B5563] text-[15px] leading-[1.7] flex-1 mb-8">
                    {message}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold uppercase tracking-wide">
                        {initials}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#1E3A8A] text-base leading-tight">
                        {fullName}
                      </span>
                      {location && (
                        <span className="text-[#9CA3AF] text-sm leading-tight mt-0.5">
                          {location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {canSlide && totalDots > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-[#2563EB] w-8" : "bg-slate-300 w-2.5 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
