import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { fetchFooter } from "@/lib/wordpress";
import { parseContactSection, parseContactServiceArea, parseServiceOptions } from "@/lib/contact";
import type { AcfLink } from "@/lib/wp-utils";
import ContactForm from "@/components/ContactForm";
import ContactServiceAreaCard from "@/components/ContactServiceAreaCard";

type FooterServiceItem = {
  add_a_service_label?: AcfLink;
};

type ContactSectionProps = {
  acf?: Record<string, unknown>;
};

function ContactInfoIcon({ label, iconUrl }: { label: string; iconUrl?: string }) {
  if (iconUrl) {
    return <img src={iconUrl} alt="" className="w-5 h-5 object-contain" />;
  }

  if (label === "Phone") return <Phone className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />;
  if (label === "Email") return <Mail className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />;
  if (label === "Location") return <MapPin className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />;
  return <Clock className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />;
}

export default async function ContactSection({ acf }: ContactSectionProps) {
  const contactSection = parseContactSection(acf);
  const serviceArea = parseContactServiceArea(acf);
  const footerData = await fetchFooter();
  const services = parseServiceOptions(
    footerData?.add_services as FooterServiceItem[] | undefined
  );

  return (
    <section className="w-full bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4 font-heading">
              {contactSection.title}
            </h2>
            <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed mb-8 max-w-xl">
              {contactSection.description}
            </p>

            <div className="space-y-4">
              {contactSection.cards.map((item) => {
                const content = (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#EDF5FF] border border-[#DDECFF] flex items-center justify-center shrink-0">
                      <ContactInfoIcon label={item.label} iconUrl={item.iconUrl} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#64748B] mb-1">{item.label}</p>
                      <p className="text-base md:text-lg font-bold text-[#1E293B] leading-snug">
                        {item.value}
                      </p>
                      {item.subtitle && (
                        <p className="text-sm text-[#64748B] mt-1">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] px-5 py-5"
                  >
                    {item.href ? (
                      <a href={item.href} className="block hover:opacity-90 transition-opacity">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>

            {serviceArea && (
              <div className="mt-4">
                <ContactServiceAreaCard serviceArea={serviceArea} />
              </div>
            )}
          </div>

          <ContactForm services={services} />
        </div>
      </div>
    </section>
  );
}
