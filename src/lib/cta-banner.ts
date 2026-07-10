export type CtaBannerAcf = {
  "5th_section_banner_title"?: string;
  "5th_section_banner_description"?: string;
  "5th_section_"?: string;
  "5th_section_call_icon"?: { url?: string };
  "5th_section_2nd_button_link"?: string;
  "5th_section_2nd_button_image"?: { url?: string };
};

const CTA_FIELD_KEYS = [
  "5th_section_banner_title",
  "5th_section_banner_description",
  "5th_section_",
  "5th_section_call_icon",
  "5th_section_2nd_button_link",
  "5th_section_2nd_button_image",
] as const;

export function acfStr(data: Record<string, unknown> | null | undefined, key: string): string | undefined {
  const value = data?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function extractCtaBannerAcf(acf?: Record<string, unknown> | null): CtaBannerAcf | null {
  if (!acf) return null;

  const title = acfStr(acf, "5th_section_banner_title");
  if (!title) return null;

  const extracted: CtaBannerAcf = { "5th_section_banner_title": title };

  for (const key of CTA_FIELD_KEYS) {
    if (key === "5th_section_banner_title") continue;
    const value = acf[key];
    if (value !== undefined && value !== null && value !== false && value !== "") {
      (extracted as Record<string, unknown>)[key] = value;
    }
  }

  return extracted;
}
