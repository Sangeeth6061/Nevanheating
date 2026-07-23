import { Check } from "lucide-react";

export type AboutStoryPoint = {
  text?: string;
  iconUrl?: string;
};

type AboutStorySectionProps = {
  subHeading?: string;
  heading?: string;
  textArea?: string;
  points?: AboutStoryPoint[];
  imageUrl?: string;
  establishedYear?: string;
  establishedText?: string;
};

function splitParagraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);
}

export default function AboutStorySection({
  subHeading,
  heading,
  textArea,
  points = [],
  imageUrl,
  establishedYear,
  establishedText,
}: AboutStorySectionProps) {
  if (!heading && !subHeading && !textArea && points.length === 0 && !imageUrl) {
    return null;
  }

  const paragraphs = splitParagraphs(textArea);

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          <div className="order-2 lg:order-1">
            {subHeading && (
              <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                {subHeading}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-[42px] leading-[1.15] font-extrabold text-[#1E293B] tracking-tight font-heading mb-5 md:mb-6">
                {heading}
              </h2>
            )}
            {paragraphs.length > 0 && (
              <div className="space-y-4 mb-8 md:mb-10">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[#64748B] text-base md:text-[17px] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {points.length > 0 && (
              <ul className="flex flex-col gap-4">
                {points.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {point.iconUrl ? (
                      <img
                        src={point.iconUrl}
                        alt=""
                        className="w-5 h-5 object-contain shrink-0"
                      />
                    ) : (
                      <Check
                        className="w-5 h-5 text-[#1E293B] shrink-0"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-[#1E293B] text-[15px] md:text-base font-medium leading-snug">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {imageUrl && (
            <div className="order-1 lg:order-2 relative pb-10 sm:pb-12">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                <img
                  src={imageUrl}
                  alt={heading || subHeading || "About us"}
                  className="w-full h-auto min-h-[260px] sm:min-h-[320px] object-cover"
                />
              </div>
              {(establishedYear || establishedText) && (
                <div className="absolute -bottom-6 left-4 sm:-bottom-8 sm:-left-8 bg-[#F97316] text-white rounded-2xl px-6 py-5 shadow-[0_12px_40px_rgba(249,115,22,0.35)] min-w-[150px] z-10">
                  {establishedYear && (
                    <span className="block text-[38px] sm:text-[42px] font-extrabold leading-none mb-1 font-heading">
                      {establishedYear}
                    </span>
                  )}
                  {establishedText && (
                    <span className="block text-sm font-semibold text-white/95 leading-snug">
                      {establishedText}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
