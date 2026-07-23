import { MapPin } from "lucide-react";
import type { ContactLocationMapData } from "@/lib/contact";

type ContactLocationMapProps = {
  locationMap: ContactLocationMapData;
};

export default function ContactLocationMap({ locationMap }: ContactLocationMapProps) {
  return (
    <section className="w-full">
      <div className="relative w-full min-h-[280px] md:min-h-[320px] bg-[#D9CDB8] overflow-hidden">
        {locationMap.mapImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${locationMap.mapImageUrl})` }}
            aria-hidden="true"
          />
        ) : locationMap.mapsEmbedUrl ? (
          <iframe
            title={`Map showing ${locationMap.address}`}
            src={locationMap.mapsEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center px-4 py-10 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] px-8 py-6 md:px-10 md:py-7 text-center max-w-sm w-full pointer-events-auto">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center text-[#2563EB]">
              <MapPin className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-1 font-heading">
              {locationMap.businessName}
            </h3>
            <p className="text-sm md:text-[15px] text-[#64748B] leading-relaxed">
              {locationMap.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
