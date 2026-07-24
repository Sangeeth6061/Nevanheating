function acfStr(data: Record<string, unknown> | undefined | null, key: string): string | undefined {
  const value = data?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export type LegalSection = {
  id: string;
  number: number;
  heading: string;
  paragraphs: string[];
};

export type TermsAndConditionsContent = {
  subtitle?: string;
  sections: LegalSection[];
};

export function isTermsAndConditionsPage(
  slug: string,
  acf?: Record<string, unknown> | null
): boolean {
  if (slug === "terms-and-conditions" || slug === "terms-of-service") return true;
  return Boolean(acfStr(acf, "terms_and_conditions_text_area"));
}

function paragraphsFromBody(body: string | undefined): string[] {
  if (!body?.trim()) return [];

  return body
    .trim()
    .split(/\r?\n\r?\n+/)
    .flatMap((block) =>
      block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    );
}

function parseNumberedSections(text: string): LegalSection[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const sectionPattern = /(?:^|\n)(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n\d+\.\s+|$)/g;
  const sections: LegalSection[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = sectionPattern.exec(normalized)) !== null) {
    const paragraphs = paragraphsFromBody(match[3]);
    if (paragraphs.length === 0) continue;

    sections.push({
      id: `terms-section-${index++}`,
      number: Number.parseInt(match[1], 10),
      heading: match[2].trim(),
      paragraphs,
    });
  }

  return sections;
}

export function parseTermsAndConditions(
  acf?: Record<string, unknown> | null
): TermsAndConditionsContent | null {
  const text = acfStr(acf, "terms_and_conditions_text_area");
  if (!text) return null;

  const sections = parseNumberedSections(text);
  if (sections.length === 0) return null;

  return {
    subtitle: acfStr(acf, "terms_and_conditions_sub_title"),
    sections,
  };
}
