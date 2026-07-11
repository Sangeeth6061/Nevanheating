import Link from "next/link";
import { Check } from "lucide-react";
import {
  getServiceIconColorClasses,
  parseServicesPageItems,
  type ServicePageItem,
} from "@/lib/services-page";
import ServicesHashScroller from "@/components/ServicesHashScroller";

type ServicesPageSectionProps = {
  acf?: Record<string, unknown>;
};

function ServicePageBlock({ service, index }: { service: ServicePageItem; index: number }) {
  const imageOnLeft = index % 2 === 1;
  const iconColors = getServiceIconColorClasses(service.iconUrl, service.iconName);

  return (
    <div
      id={service.sectionAnchor}
      className="scroll-mt-28 lg:scroll-mt-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center"
    >
      <div className={imageOnLeft ? "order-2 lg:order-2" : "order-1 lg:order-1"}>
        {service.iconUrl && (
          <div
            className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconColors}`}
          >
            <img src={service.iconUrl} alt="" className="h-7 w-7 object-contain" />
          </div>
        )}

        <h2 className="text-2xl md:text-3xl lg:text-[34px] font-extrabold text-[#1E3A8A] leading-tight font-heading mb-4 md:mb-5">
          {service.title}
        </h2>

        {service.paragraphs.length > 0 ? (
          <div className="space-y-4 mb-6 md:mb-8">
            {service.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="text-[#64748B] text-sm md:text-[15px] leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          service.description && (
            <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed mb-6 md:mb-8">
              {service.description}
            </p>
          )
        )}

        {service.points.length > 0 && (
          <ul className="space-y-3 mb-7 md:mb-8">
            {service.points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex items-center gap-3">
                {point.iconUrl ? (
                  <img src={point.iconUrl} alt="" className="h-5 w-5 shrink-0 object-contain" />
                ) : (
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF]">
                    <Check className="h-3 w-3 text-[#2563EB]" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <span className="text-sm md:text-[15px] font-medium text-[#1E293B]">{point.text}</span>
              </li>
            ))}
          </ul>
        )}

        <Link
          href={service.buttonHref}
          className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-3 text-sm md:text-[15px] font-bold text-white transition-colors hover:bg-[#1E40AF]"
        >
          {service.buttonLabel}
        </Link>
      </div>

      {service.imageUrl && (
        <div className={imageOnLeft ? "order-1 lg:order-1" : "order-2 lg:order-2"}>
          <div className="aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPageSection({ acf }: ServicesPageSectionProps) {
  const services = parseServicesPageItems(acf);
  if (services.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <ServicesHashScroller />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24">
          {services.map((service, index) => (
            <ServicePageBlock key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
