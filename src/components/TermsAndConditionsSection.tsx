import { parseTermsAndConditions } from "@/lib/legal-page";

type TermsAndConditionsSectionProps = {
  acf?: Record<string, unknown>;
};

export default function TermsAndConditionsSection({ acf }: TermsAndConditionsSectionProps) {
  const content = parseTermsAndConditions(acf);
  if (!content) return null;

  const { subtitle, sections } = content;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {subtitle && (
            <p className="text-lg md:text-xl font-semibold text-[#1E3A8A] mb-8 md:mb-10 font-heading">
              {subtitle}
            </p>
          )}

          <div className="space-y-8 md:space-y-10">
            {sections.map((section) => (
              <article
                key={section.id}
                className="border-b border-slate-100 pb-8 md:pb-10 last:border-0 last:pb-0"
              >
                <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-3 font-heading leading-snug">
                  {section.number}. {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[#64748B] text-sm md:text-[15px] leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
