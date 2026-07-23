import {
  acfImageUrl,
  acfLinkHref,
  CONTACT_NUMBER,
  isHoursContactText,
  isLocationContactText,
  isPhoneNumber,
  resolveAcfContactTitle,
  telHref,
  type AcfLink,
} from "@/lib/wp-utils";

export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  subtitle?: string;
  href?: string;
  iconUrl?: string;
};

export type ContactSectionContent = {
  title: string;
  description: string;
  cards: ContactInfoItem[];
};

export type ContactEmergencyBannerData = {
  message: string;
  phoneDisplay: string;
  phoneHref: string;
  iconUrl?: string;
};

export type ContactServiceAreaData = {
  title: string;
  description: string;
};

export type ContactLocationMapData = {
  mapImageUrl?: string;
  mapsEmbedUrl?: string;
  businessName: string;
  address: string;
};

export type ContactFormData = {
  full_name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
};

type ContactCardAcfItem = {
  contact_card_icon?: { url?: string } | false;
  contact_card_name?: string;
  contact_card_details?: string;
  additional_info?: string;
};

type FooterContactItem = {
  contact_info_icon?: { url?: string } | false;
  add_a_ft_col_4_contact_info_link?: AcfLink;
  add_a_ft_col_4_contact_info_description?: string;
};

function acfStr(data: Record<string, unknown> | undefined | null, key: string): string | undefined {
  const value = data?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function getContactHrefFromDetails(label: string, details: string): string | undefined {
  if (label === "Phone" && isPhoneNumber(details)) return telHref(details);
  if (label === "Email" && details.includes("@")) return `mailto:${details}`;
  return undefined;
}

function formatPhoneDisplay(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return CONTACT_NUMBER;

  if (trimmed.includes(" ")) {
    return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("44") && digits.length >= 11) {
    const local = digits.slice(2);
    if (local.length === 10) {
      return `+44 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    if (local.length === 9) {
      return `+44 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    }
  }

  return trimmed.startsWith("+") ? trimmed : `+${digits}`;
}

function normalizePhoneForTel(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return CONTACT_NUMBER.replace(/\s+/g, "");
  return digits.startsWith("44") ? `+${digits}` : `+${digits}`;
}

function findContactCardPhone(acf?: Record<string, unknown> | null): string | undefined {
  if (!Array.isArray(acf?.add_contact_card)) return undefined;

  for (const item of acf.add_contact_card) {
    const row = item as ContactCardAcfItem;
    const name = row.contact_card_name?.trim().toLowerCase() ?? "";
    if (!name.includes("phone")) continue;

    const details = row.contact_card_details?.trim();
    if (details && isPhoneNumber(details)) return details;
  }

  return undefined;
}

export function parseContactEmergencyBanner(
  acf?: Record<string, unknown> | null
): ContactEmergencyBannerData | null {
  const message = acfStr(acf, "contact_page_emergency_");
  const phoneRaw = acfStr(acf, "contact_page_emegency_number");
  const phoneFromCard = findContactCardPhone(acf);

  if (!message && !phoneFromCard && !phoneRaw) return null;

  const phoneValue = phoneFromCard ?? CONTACT_NUMBER;
  const iconUrl =
    acfImageUrl(acf?.contat_page_emergency_icon as { url?: string } | false | null | undefined) ??
    acfImageUrl(acf?.contact_page_emergency_icon as { url?: string } | false | null | undefined);

  return {
    message: message ?? "24/7 Plumbing Emergency? Don't wait — call us now.",
    phoneDisplay: formatPhoneDisplay(phoneValue),
    phoneHref: telHref(normalizePhoneForTel(phoneValue)),
    iconUrl,
  };
}

export function parseContactCards(items: unknown): ContactInfoItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): ContactInfoItem | null => {
      const row = item as ContactCardAcfItem;
      const label = row.contact_card_name?.trim();
      const value = row.contact_card_details?.trim();
      if (!label || !value) return null;

      return {
        id: `contact-card-${index}`,
        label,
        value,
        subtitle: row.additional_info?.trim(),
        href: getContactHrefFromDetails(label, value),
        iconUrl: acfImageUrl(row.contact_card_icon),
      };
    })
    .filter((item): item is ContactInfoItem => item !== null);
}

export function parseContactSection(acf?: Record<string, unknown> | null): ContactSectionContent {
  return {
    title: acfStr(acf, "2nd_section_2nd_title") ?? "Get in Touch",
    description:
      acfStr(acf, "2nd_sec_2nd_text_area") ??
      "Whether you need a free quote, have a plumbing emergency, or just want to ask a question — we're here to help.",
    cards: parseContactCards(acf?.add_contact_card),
  };
}

function findLocationAddress(acf?: Record<string, unknown> | null): string | undefined {
  if (!Array.isArray(acf?.add_contact_card)) return undefined;

  for (const item of acf.add_contact_card) {
    const row = item as ContactCardAcfItem;
    const name = row.contact_card_name?.trim().toLowerCase() ?? "";
    if (name.includes("location")) {
      return row.contact_card_details?.trim();
    }
  }

  return undefined;
}

export function parseContactServiceArea(
  acf?: Record<string, unknown> | null
): ContactServiceAreaData | null {
  const title = acfStr(acf, "contact_message_title");
  const description = acfStr(acf, "contact_message_text_area");

  if (!title && !description) return null;

  return {
    title: title ?? "Service Area",
    description: description ?? "",
  };
}

export function parseContactLocationMap(
  acf?: Record<string, unknown> | null,
  businessName = "Nevan Plumbing & Heating"
): ContactLocationMapData | null {
  const address = findLocationAddress(acf);
  if (!address) return null;

  const mapImageUrl = acfImageUrl(
    acf?.set_your_location as { url?: string } | false | null | undefined
  );

  return {
    mapImageUrl,
    mapsEmbedUrl: mapImageUrl
      ? undefined
      : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`,
    businessName,
    address,
  };
}

function getContactLabel(title: string, description?: string): string {
  if (isPhoneNumber(title)) return "Phone";
  if (title.includes("@")) return "Email";
  if (isLocationContactText(title) || isLocationContactText(description)) return "Location";
  if (isHoursContactText(title, description)) return "Hours";

  return "Contact";
}

function getContactSubtitle(label: string, description?: string, title?: string): string | undefined {
  if (label === "Hours" && description) {
    const parts = description.split(/\s{2,}|\s+(?=Saturday)/).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
      return `${parts[1]} | 24/7 Emergency`;
    }
    return "Sat: 9am–4pm | 24/7 Emergency";
  }

  if (description && label !== "Hours" && description !== title) return description;

  if (label === "Phone") return "24/7 for emergencies";
  if (label === "Email") return "Reply within 2 hours";
  if (label === "Location" && description && description !== title) return description;
  if (label === "Hours" && title) return "Sat: 9am–4pm | 24/7 Emergency";

  return undefined;
}

function getContactHref(label: string, title: string, rawHref: string): string | undefined {
  if (label === "Phone") return telHref(isPhoneNumber(title) ? title : CONTACT_NUMBER);
  if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return rawHref;
  if (title.includes("@")) return `mailto:${title}`;
  return undefined;
}

export function parseContactInfoItems(items: FooterContactItem[] | undefined): ContactInfoItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): ContactInfoItem | null => {
      const link = item.add_a_ft_col_4_contact_info_link;
      const description = item.add_a_ft_col_4_contact_info_description?.trim();
      const title = resolveAcfContactTitle(link, description);
      if (!title) return null;
      const label = getContactLabel(title, description);
      const rawHref = acfLinkHref(link);
      const value =
        label === "Phone" && isPhoneNumber(title)
          ? CONTACT_NUMBER
          : label === "Hours" && description
            ? description.split(/\s{2,}|\s+(?=Saturday)/)[0]?.trim() || title
            : title;

      return {
        id: `contact-info-${index}`,
        label,
        value,
        subtitle: getContactSubtitle(label, description, title),
        href: getContactHref(label, title, rawHref),
        iconUrl: acfImageUrl(item.contact_info_icon),
      };
    })
    .filter((item): item is ContactInfoItem => item !== null);
}

export function parseServiceOptions(
  services: Array<{ add_a_service_label?: AcfLink }> | undefined
): string[] {
  if (!Array.isArray(services)) return [];

  return services
    .map((service) => service.add_a_service_label?.title?.trim())
    .filter((title): title is string => Boolean(title));
}
