export type TestimonialItem = {
  id: string;
  starUrls: string[];
  quoteIconUrl?: string;
  message?: string;
  initials?: string;
  fullName?: string;
  location?: string;
};

const STAR_KEYS = [
  "4th_testimonials_stars",
  "4th_testimonials_stars_2",
  "4th_testimonials_stars_3",
  "4th_testimonials_stars_4",
  "5th_testimonials_stars_5",
] as const;

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseTestimonials(items: unknown[] | undefined | null): TestimonialItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): TestimonialItem | null => {
      const testimonial = item as Record<string, unknown>;
      const message = acfStr(testimonial["4th_section_customer_message"]);
      const fullName = acfStr(testimonial["4th_section_full_name"]);

      if (!message && !fullName) return null;

      const starUrls = STAR_KEYS.map((key) => {
        const star = testimonial[key] as { url?: string } | undefined;
        return star?.url;
      }).filter((url): url is string => Boolean(url));

      const quoteIcon = testimonial["4th_section_quotes_icon"] as { url?: string } | undefined;

      return {
        id: `testimonial-${index}`,
        starUrls,
        quoteIconUrl: quoteIcon?.url,
        message,
        initials: acfStr(testimonial["4th_section_user_image"]),
        fullName,
        location: acfStr(testimonial["$th_section_full_name"]),
      };
    })
    .filter((item): item is TestimonialItem => item !== null);
}
