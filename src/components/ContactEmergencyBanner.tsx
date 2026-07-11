import { AlertTriangle } from "lucide-react";
import type { ContactEmergencyBannerData } from "@/lib/contact";

type ContactEmergencyBannerProps = {
  banner: ContactEmergencyBannerData;
};

export default function ContactEmergencyBanner({ banner }: ContactEmergencyBannerProps) {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-6 md:py-8">
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 text-[#DC2626]">
                {banner.iconUrl ? (
                  <img src={banner.iconUrl} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <AlertTriangle className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" />
                )}
              </div>
              <p className="text-sm md:text-[15px] font-semibold text-[#B91C1C] leading-snug">
                {banner.message}
              </p>
            </div>

            <a
              href={banner.phoneHref}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#EF4444] px-6 py-2.5 text-sm md:text-[15px] font-bold text-white transition-colors hover:bg-[#DC2626] self-start sm:self-auto"
            >
              {banner.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
