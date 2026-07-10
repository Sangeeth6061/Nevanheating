export type AboutStatItem = {
  id: string;
  iconUrl?: string;
  value: string;
  label?: string;
};

const REPEATER_KEYS = ["add_stat_card", "about_3rd_sec_add_a_countdown", "about_3rd_sec_add_a_stats"] as const;

const ICON_KEYS = ["add_a_stat_card_icon", "about_3rd_section_icon", "icon"] as const;
const VALUE_KEYS = ["add_stat_card_number", "about_3rd_sec_add_a_count", "add_a_count", "value"] as const;
const LABEL_KEYS = ["add_stat_card_name", "about_3rd_sec_add_a_text", "add_a_label", "label"] as const;

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function firstField(row: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && value !== false && value !== "") {
      return value;
    }
  }
  return undefined;
}

export function parseAboutStats(acf?: Record<string, unknown> | null): AboutStatItem[] {
  if (!acf) return [];

  let items: unknown[] | undefined;
  for (const key of REPEATER_KEYS) {
    const candidate = acf[key];
    if (Array.isArray(candidate) && candidate.length > 0) {
      items = candidate;
      break;
    }
  }

  if (!items) return [];

  return items
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const icon = firstField(row, ICON_KEYS) as { url?: string } | undefined;
      const value = acfStr(firstField(row, VALUE_KEYS));
      const label = acfStr(firstField(row, LABEL_KEYS));

      if (!value) return null;

      return {
        id: `about-stat-${index}`,
        iconUrl: icon?.url,
        value,
        label,
      };
    })
    .filter((item): item is AboutStatItem => item !== null);
}

export type ParsedStatValue = {
  target: number;
  suffix: string;
  decimals: number;
};

export function parseStatValue(value: string): ParsedStatValue {
  const match = value.trim().match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { target: 0, suffix: value, decimals: 0 };
  }

  const numericPart = match[1].replace(/,/g, "");
  const suffix = match[2] ?? "";
  const decimals = numericPart.includes(".") ? numericPart.split(".")[1].length : 0;

  return {
    target: Number.parseFloat(numericPart),
    suffix,
    decimals,
  };
}
