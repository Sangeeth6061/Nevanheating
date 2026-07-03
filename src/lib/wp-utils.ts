const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") ?? "";

export function wpUrlToPath(url?: string | null): string {
  if (!url) return "#";
  if (url.startsWith("/")) return normalizeHomePath(url);
  let path = url;
  if (WP_BASE && url.startsWith(WP_BASE)) {
    path = url.slice(WP_BASE.length) || "/";
  } else {
    try {
      const parsed = new URL(url);
      path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return url;
    }
  }
  return normalizeHomePath(path);
}

function normalizeHomePath(path: string): string {
  if (path === "/home" || path === "/home/") return "/";
  return path || "/";
}

export const CONTACT_NUMBER =
  process.env.NEXT_PUBLIC_CONTACT_NUMBER?.trim() || "+44 7720 843384";

export function isPhoneNumber(value?: string | null): boolean {
  if (!value) return false;
  return /^\+?[\d\s()-]+$/.test(value.trim());
}

export function telHref(number?: string | null): string {
  if (!number) return "#";
  return `tel:${number.replace(/\s+/g, "")}`;
}

export type AcfLink = { title?: string; url?: string; target?: string };

export function acfLinkHref(link?: AcfLink | null): string {
  const title = link?.title?.trim() ?? "";
  const url = link?.url?.trim() ?? "";

  if (title.includes("@")) return `mailto:${title}`;
  if (/^\+?[\d\s()-]+$/.test(title)) return telHref(title);
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return url;
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) return "#";
  return wpUrlToPath(url);
}

export function acfImageUrl(image?: { url?: string } | false | null): string | undefined {
  if (!image || typeof image !== "object") return undefined;
  return image.url;
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findMenuPath(
  menu: Array<{ page_name?: string; page_link?: { url?: string } }> | undefined,
  name: string
): string {
  const item = menu?.find(
    (entry) => entry.page_name?.toLowerCase() === name.toLowerCase()
  );
  return wpUrlToPath(item?.page_link?.url);
}

type ServicePost = {
  slug: string;
  title: { rendered: string };
  link: string;
};

export function findServicePath(
  title: string | undefined,
  services: ServicePost[]
): string | null {
  if (!title) return null;
  const normalizedTitle = title.toLowerCase().trim();
  const slug = titleToSlug(title);

  const match = services.find((service) => {
    const serviceTitle = service.title.rendered.toLowerCase().trim();
    return service.slug === slug || serviceTitle === normalizedTitle;
  });

  return match ? wpUrlToPath(match.link) : null;
}
