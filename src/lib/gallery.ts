export type GalleryItem = {
  id: string;
  imageUrl?: string;
  title?: string;
  category?: string;
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
      const image = row.add_a_image as { url?: string } | undefined;

      return {
        id: `gallery-${index}`,
        imageUrl: image?.url,
        title: acfStr(row.add_a_title),
        category: acfStr(row.add_category),
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

export function getGalleryCategories(items: GalleryItem[]): string[] {
  const categories = new Set<string>();
  for (const item of items) {
    if (item.category) categories.add(item.category);
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}
