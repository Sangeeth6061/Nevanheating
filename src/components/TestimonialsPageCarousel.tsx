"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";
import type { TestimonialItem } from "@/lib/testimonials";

const VISIBLE_DESKTOP = 3;
const VISIBLE_MOBILE = 1;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

type TestimonialsPageCarouselProps = {
  testimonials: TestimonialItem[];
};

export default function TestimonialsPageCarousel({
  testimonials,
}: TestimonialsPageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_MOBILE);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateVisibleCount = () => {
      setVisibleCount(mediaQuery.matches ? VISIBLE_DESKTOP : VISIBLE_MOBILE);
    };

    updateVisibleCount();
    mediaQuery.addEventListener("change", updateVisibleCount);
    return () => mediaQuery.removeEventListener("change", updateVisibleCount);
  }, []);

  const total = testimonials.length;
  const maxIndex = Math.max(0, total - visibleCount);
  const totalDots = maxIndex + 1;
  const canSlide = total > visibleCount;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

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
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [canSlide, goNext]);

  if (total === 0) return null;

  const trackWidthPercent = (total / visibleCount) * 100;
  const slideWidthPercent = 100 / total;

  return (
    <div className="relative w-full">
      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#1E3A8A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#1E3A8A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="overflow-hidden mx-4 sm:mx-10 lg:mx-10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${trackWidthPercent}%`,
            transform: `translateX(-${currentIndex * slideWidthPercent}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="shrink-0 px-2 sm:px-3"
              style={{ width: `${slideWidthPercent}%` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {canSlide && totalDots > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-[#2563EB] w-8" : "bg-slate-300 w-2.5 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
