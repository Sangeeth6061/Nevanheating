import { Check } from "lucide-react";
import type { AboutValueCard } from "@/lib/about-values";

type AboutCoreValuesSectionProps = {
  subHeading?: string;
  heading?: string;
  cards: AboutValueCard[];
};

export default function AboutCoreValuesSection({
  subHeading,
  heading,
  cards,
}: AboutCoreValuesSectionProps) {
  if (!heading && !subHeading && cards.length === 0) return null;

  return (
    <section className="w-full bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16 lg:py-20">
        {(subHeading || heading) && (
          <div className="text-center mb-10 md:mb-12 lg:mb-14">
            {subHeading && (
              <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                {subHeading}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#1E293B] tracking-tight font-heading">
                {heading}
              </h2>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {cards.map((card) => (
              <article
                key={card.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.05)] px-6 py-7 md:px-7 md:py-8"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EDF5FF] border border-[#DDECFF] flex items-center justify-center mb-5">
                  {card.iconUrl ? (
                    <img src={card.iconUrl} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <Check className="w-6 h-6 text-[#2563EB]" strokeWidth={2.5} aria-hidden="true" />
                  )}
                </div>
                {card.title && (
                  <h3 className="text-lg md:text-xl font-bold text-[#1E293B] leading-snug mb-3 font-heading">
                    {card.title}
                  </h3>
                )}
                {card.description && (
                  <p className="text-[#64748B] text-[15px] md:text-base leading-relaxed">
                    {card.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
