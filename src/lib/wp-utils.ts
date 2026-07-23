import { resolveServiceSubpageHref } from "@/lib/legacy-service-redirects";

const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") ?? "";

function slugifyPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return pathname;

  const lastIndex = parts.length - 1;
  const decoded = (() => {
    try {
      return decodeURIComponent(parts[lastIndex]);
    } catch {
      return parts[lastIndex];
    }
  })();

  if (/[\s,]/.test(decoded) || (decoded.includes("&") && !decoded.includes("-"))) {
    parts[lastIndex] = titleToSlug(decoded);
    return `/${parts.join("/")}`;
  }

  return pathname;
}

export function wpUrlToPath(url?: string | null): string {
  if (!url) return "#";
  if (url.startsWith("/")) {
    const q = url.indexOf("?");
    const h = url.indexOf("#");
    const cut = [q, h].filter((i) => i >= 0).sort((a, b) => a - b)[0];
    const pathname = cut === undefined ? url : url.slice(0, cut);
    const suffix = cut === undefined ? "" : url.slice(cut);
    return normalizeHomePath(slugifyPathname(pathname)) + suffix;
  }
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
  const q = path.indexOf("?");
  const h = path.indexOf("#");
  const cut = [q, h].filter((i) => i >= 0).sort((a, b) => a - b)[0];
  const pathname = cut === undefined ? path : path.slice(0, cut);
  const suffix = cut === undefined ? "" : path.slice(cut);
  return normalizeHomePath(slugifyPathname(pathname)) + suffix;
}

function normalizeHomePath(path: string): string {
  if (path === "/home" || path === "/home/") return "/";
  return path || "/";
}

export const CONTACT_NUMBER =
  process.env.NEXT_PUBLIC_CONTACT_NUMBER?.trim() || "+44 7720 843384";

/** Contact page + form anchor for “Get a Quote” CTAs site-wide */
export const CONTACT_FORM_ID = "contact-form";
export const CONTACT_QUOTE_HREF = `/contact#${CONTACT_FORM_ID}`;

export function isPhoneNumber(value?: string | null): boolean {
  if (!value) return false;
  return /^\+?[\d\s()-]+$/.test(value.trim());
}

export function telHref(number?: string | null): string {
  if (!number) return "#";
  return `tel:${number.replace(/\s+/g, "")}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() ||
  "Hi, I am interested in your plumbing and heating services. Could you please help me?";

export function whatsappHref(number?: string | null, message?: string): string {
  const source =
    number?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
    CONTACT_NUMBER;
  const digits = source.replace(/\D/g, "");
  if (!digits) return "#";

  const url = `https://wa.me/${digits}`;
  const text = message ?? WHATSAPP_DEFAULT_MESSAGE;
  if (text) {
    return `${url}?text=${encodeURIComponent(text)}`;
  }

  return url;
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

export function acfLegalLinkHref(link?: AcfLink | null): string {
  if (!link?.title) return "#";
  const url = link.url?.trim() ?? "";
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      const looksValid = parsed.hostname.includes(".") && !parsed.hostname.includes(" ");
      if (looksValid) return wpUrlToPath(url);
    } catch {
      // fall through to slug path
    }
  }

  return wpUrlToPath(`/${titleToSlug(link.title)}`);
}

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, "")
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

  const resolvedSlug = match?.slug ?? slug;
  return resolveServiceSubpageHref(resolvedSlug);
}
