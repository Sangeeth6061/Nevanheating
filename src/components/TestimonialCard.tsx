import type { TestimonialItem } from "@/lib/testimonials";

type TestimonialCardProps = {
  testimonial: TestimonialItem;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="bg-[#F8FAFC] rounded-xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100/80 flex flex-col h-full min-h-[280px]">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-1">
          {testimonial.starUrls.length > 0 ? (
            testimonial.starUrls.map((starUrl, starIndex) => (
              <img key={starIndex} src={starUrl} alt="" className="w-4 h-4 object-contain" />
            ))
          ) : (
            Array.from({ length: 5 }).map((_, starIndex) => (
              <span key={starIndex} className="text-[#FBBF24] text-base leading-none">
                ★
              </span>
            ))
          )}
        </div>
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

      {testimonial.message && (
        <p className="text-[#4B5563] text-[15px] leading-[1.7] flex-1 mb-8">{testimonial.message}</p>
      )}

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
