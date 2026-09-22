"use client";

import { useState } from "react";
import type { TestimonialItem } from "@/lib/testimonials";

/** Long Google reviews are clamped so carousel cards keep a consistent height. */
const LONG_MESSAGE_CHARS = 260;

export function TestimonialStars({ testimonial }: { testimonial: TestimonialItem }) {
  if (typeof testimonial.rating === "number") {
    return (
      <div className="flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <span
            key={starIndex}
            className={[
              "text-base leading-none",
              starIndex < (testimonial.rating ?? 0) ? "text-[#FBBF24]" : "text-slate-300",
            ].join(" ")}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {testimonial.starUrls.length > 0
        ? testimonial.starUrls.map((starUrl, starIndex) => (
            <img key={starIndex} src={starUrl} alt="" className="w-4 h-4 object-contain" />
          ))
        : Array.from({ length: 5 }).map((_, starIndex) => (
            <span key={starIndex} className="text-[#FBBF24] text-base leading-none">
              ★
            </span>
          ))}
    </div>
  );
}

export function TestimonialMessage({ message }: { message?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!message) return <div className="flex-1 mb-8" />;

  const isLong = message.length > LONG_MESSAGE_CHARS;

  return (
    <div className="flex-1 mb-8">
      <p
        className={[
          "text-[#4B5563] text-[15px] leading-[1.7] whitespace-pre-line",
          isLong && !expanded ? "line-clamp-6" : "",
        ].join(" ")}
      >
        {message}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

type TestimonialCardProps = {
  testimonial: TestimonialItem;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="bg-[#F8FAFC] rounded-xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100/80 flex flex-col h-full min-h-[280px]">
      <div className="flex items-start justify-between mb-6">
        <TestimonialStars testimonial={testimonial} />
        {testimonial.quoteIconUrl ? (
          <img
            src={testimonial.quoteIconUrl}
            alt=""
            className="w-10 h-10 object-contain opacity-20 shrink-0"
          />
        ) : (
          <span className="text-5xl leading-none text-slate-200 font-serif select-none">
            &ldquo;
          </span>
        )}
      </div>

      <TestimonialMessage message={testimonial.message} />

      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold uppercase tracking-wide">
            {testimonial.initials}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          {testimonial.fullName && (
            <span className="font-bold text-[#1E3A8A] text-base leading-tight">
              {testimonial.fullName}
            </span>
          )}
          {testimonial.location && (
            <span className="text-[#9CA3AF] text-sm leading-tight mt-0.5">
              {testimonial.location}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
