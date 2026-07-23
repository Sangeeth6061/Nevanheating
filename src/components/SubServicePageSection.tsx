import Link from "next/link";
import { Check } from "lucide-react";
import type { SubServicePageContent } from "@/lib/sub-service-page";
import { CONTACT_QUOTE_HREF } from "@/lib/wp-utils";

type SubServicePageSectionProps = {
  content: SubServicePageContent;
};

export default function SubServicePageSection({ content }: SubServicePageSectionProps) {
  const {
    servicePoints,
    mainDescriptionParagraphs,
    mainImageUrl,
    whyChooseHeading,
    whyChoosePoints,
  } = content;

  const hasServicesList = servicePoints.length > 0;
  const hasMainBlock = mainDescriptionParagraphs.length > 0 || mainImageUrl;
  const hasWhyChoose = Boolean(whyChooseHeading) || whyChoosePoints.length > 0;

  if (!hasServicesList && !hasMainBlock && !hasWhyChoose) return null;

  return (
    <>
      {hasServicesList && (
        <section className="w-full bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {servicePoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#F8FAFC] px-4 py-4 md:px-5 md:py-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#DDECFF]">
                    {point.iconUrl ? (
                      <img src={point.iconUrl} alt="" className="h-5 w-5 object-contain" />
                    ) : (
                      <Check className="h-5 w-5 text-[#2563EB]" strokeWidth={3} aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-sm md:text-[15px] font-semibold text-[#1E293B] leading-snug pt-1.5">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasMainBlock && (
        <section className="w-full bg-[#F8FAFC]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
              <div className="order-2 lg:order-1">
                {mainDescriptionParagraphs.length > 0 && (
                  <div className="space-y-4 mb-8 md:mb-10">
                    {mainDescriptionParagraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-[#64748B] text-sm md:text-[15px] font-normal leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                <Link
                  href={CONTACT_QUOTE_HREF}
                  className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-3 text-sm md:text-[15px] font-bold text-white transition-colors hover:bg-[#1E40AF]"
                >
                  Get a Quote
                </Link>
              </div>

              {mainImageUrl && (
                <div className="order-1 lg:order-2">
                  <div className="aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                    <img
                      src={mainImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {hasWhyChoose && (
        <section className="w-full bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
            {whyChooseHeading && (
              <h2 className="text-2xl md:text-3xl lg:text-[34px] font-extrabold text-[#1E3A8A] font-heading mb-8 md:mb-10 text-center lg:text-left">
                {whyChooseHeading}
              </h2>
            )}
            {whyChoosePoints.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {whyChoosePoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF] border border-[#DDECFF]">
                      {point.iconUrl ? (
                        <img src={point.iconUrl} alt="" className="h-5 w-5 object-contain" />
                      ) : (
                        <Check className="h-5 w-5 text-[#2563EB]" strokeWidth={3} aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      {point.title && (
                        <h3 className="font-bold text-[#1E293B] text-base leading-snug mb-1.5">
                          {point.title}
                        </h3>
                      )}
                      <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
