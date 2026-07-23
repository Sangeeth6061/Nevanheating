import Link from "next/link";
import { Check } from "lucide-react";
import {
  getServiceIconColorClasses,
  parseServicesPageItems,
  type ServicePageItem,
} from "@/lib/services-page";

type ServicesOverviewSectionProps = {
  acf?: Record<string, unknown>;
};

function serviceSummary(service: ServicePageItem): string {
  if (service.paragraphs[0]) return service.paragraphs[0];
  if (service.description.length > 160) {
    return `${service.description.slice(0, 157).trim()}…`;
  }
  return service.description;
}

export default function ServicesOverviewSection({ acf }: ServicesOverviewSectionProps) {
  const services = parseServicesPageItems(acf);
  if (services.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const iconColors = getServiceIconColorClasses(service.iconUrl, service.iconName);

            return (
              <Link
                key={service.id}
                href={service.href}
                className="group flex flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                {service.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  {service.iconUrl && (
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconColors}`}
                    >
                      <img src={service.iconUrl} alt="" className="h-7 w-7 object-contain" />
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#1E3A8A] font-heading mb-3 group-hover:text-[#2563EB] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed mb-4 flex-1">
                    {serviceSummary(service)}
                  </p>

                  {service.points.length > 0 && (
                    <ul className="space-y-2.5 mb-5">
                      {service.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2.5 text-left">
                          {point.iconUrl ? (
                            <img
                              src={point.iconUrl}
                              alt=""
                              className="mt-0.5 h-4 w-4 shrink-0 object-contain"
                            />
                          ) : (
                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EDF5FF]">
                              <Check className="h-2.5 w-2.5 text-[#2563EB]" strokeWidth={3} aria-hidden="true" />
                            </span>
                          )}
                          <span className="text-sm text-[#1E293B] leading-snug">{point.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] group-hover:gap-3 transition-all mt-auto">
                    View service
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
