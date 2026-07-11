export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseFaqGroups(acf?: Record<string, unknown> | null): FaqGroup[] {
  const groups = acf?.add_a_faqs;
  if (!Array.isArray(groups)) return [];

  return groups
    .map((group, groupIndex) => {
      const row = group as Record<string, unknown>;
      const title = acfStr(row.title);
      const subFaqs = row.add_sub_faqs;

      if (!title || !Array.isArray(subFaqs)) return null;

      const items = subFaqs
        .map((item, itemIndex): FaqItem | null => {
          const faq = item as Record<string, unknown>;
          const question = acfStr(faq.add_a_question);
          const answer = acfStr(faq.add_a_answer);
          if (!question || !answer) return null;

          return {
            id: `faq-${groupIndex}-${itemIndex}`,
            question,
            answer,
          };
        })
        .filter((item): item is FaqItem => item !== null);

      if (items.length === 0) return null;

      return {
        id: `faq-group-${groupIndex}`,
        title,
        items,
      };
    })
    .filter((group): group is FaqGroup => group !== null);
}
