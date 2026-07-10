export type AboutValueCard = {
  id: string;
  iconUrl?: string;
  title?: string;
  description?: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseAboutValueCards(acf?: Record<string, unknown> | null): AboutValueCard[] {
  const items = acf?.value_card;
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const icon = row.about_value_card_icon as { url?: string } | undefined;

      return {
        id: `about-value-${index}`,
        iconUrl: icon?.url,
        title: acfStr(row.about_value_card_title),
        description: acfStr(row.about_value_card_text_area),
      };
    })
    .filter((card) => card.title || card.description);
}
