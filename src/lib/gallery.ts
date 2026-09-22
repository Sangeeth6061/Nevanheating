export type GalleryItem = {
  id: string;
  imageUrl?: string;
  /** Smaller WordPress rendition for the grid; falls back to the full image. */
  thumbUrl?: string;
  alt?: string;
  title?: string;
  location?: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseGalleryItems(acf?: Record<string, unknown> | null): GalleryItem[] {
  const items = acf?.gallery;
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const image = row.add_a_image as
        | { url?: string; alt?: string; sizes?: Record<string, unknown> }
        | undefined;
      const large = image?.sizes?.large;

      return {
        id: `gallery-${index}`,
        imageUrl: image?.url,
        thumbUrl: typeof large === "string" ? large : image?.url,
        alt: acfStr(image?.alt),
        title: acfStr(row.add_a_title),
        location:
          acfStr(row.add_a_place) ??
          acfStr(row.add_a_location) ??
          acfStr(row.add_location) ??
          acfStr(row.add_a_sub_title) ??
          acfStr(row.location),
      };
    })
    .filter((item) => item.imageUrl || item.title);
}
