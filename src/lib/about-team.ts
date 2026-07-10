export type AboutTeamMember = {
  id: string;
  imageUrl?: string;
  name?: string;
  designation?: string;
  qualification?: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseAboutTeamMembers(acf?: Record<string, unknown> | null): AboutTeamMember[] {
  const items = acf?.add_to_team;
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const row = item as Record<string, unknown>;
      const image = row.add_avatar_image as { url?: string } | undefined;

      return {
        id: `about-team-${index}`,
        imageUrl: image?.url,
        name: acfStr(row.add_name),
        designation: acfStr(row.add_designation),
        qualification: acfStr(row.add_qualification),
      };
    })
    .filter((member) => member.name || member.imageUrl || member.designation || member.qualification);
}
