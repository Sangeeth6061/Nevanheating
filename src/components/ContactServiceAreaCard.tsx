import type { ContactServiceAreaData } from "@/lib/contact";

type ContactServiceAreaCardProps = {
  serviceArea: ContactServiceAreaData;
};

export default function ContactServiceAreaCard({ serviceArea }: ContactServiceAreaCardProps) {
  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 px-5 py-5 md:px-6 md:py-6">
      <h3 className="text-base md:text-lg font-bold text-[#1E293B] mb-2 font-heading">
        {serviceArea.title}
      </h3>
      <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
        {serviceArea.description}
      </p>
    </div>
  );
}
