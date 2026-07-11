import { parseContactEmergencyBanner } from "@/lib/contact";
import ContactEmergencyBanner from "@/components/ContactEmergencyBanner";

type ContactEmergencyBannerSectionProps = {
  acf?: Record<string, unknown>;
};

export default function ContactEmergencyBannerSection({ acf }: ContactEmergencyBannerSectionProps) {
  const banner = parseContactEmergencyBanner(acf);
  if (!banner) return null;

  return <ContactEmergencyBanner banner={banner} />;
}
