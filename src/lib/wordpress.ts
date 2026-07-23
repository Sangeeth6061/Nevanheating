const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");

async function wpFetch<T>(path: string): Promise<T | null> {
  if (!NEXT_PUBLIC_WORDPRESS_URL) {
    console.warn("NEXT_PUBLIC_WORDPRESS_URL is not defined in .env.local");
    return null;
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error fetching WordPress ${path}:`, error);
    return null;
  }
}

export async function fetchPosts() {
  return (await wpFetch<unknown[]>("posts?per_page=100&_embed")) ?? [];
}

export async function fetchCategories() {
  return (await wpFetch<unknown[]>("categories?per_page=100")) ?? [];
}

export async function fetchServices() {
  return (await wpFetch<unknown[]>("service?_embed")) ?? [];
}

export async function fetchHomePage() {
  return (await wpFetch<unknown[]>("pages?slug=home&_embed")) ?? [];
}

export async function fetchPageBySlug(slug: string) {
  const pages = (await wpFetch<unknown[]>(`pages?slug=${slug}&_embed`)) ?? [];
  return pages[0] ?? null;
}

export type WpPageSummary = {
  slug: string;
  link?: string;
  menu_order?: number;
  title?: { rendered?: string };
  acf?: Record<string, unknown>;
};

export async function fetchPublishedPages(): Promise<WpPageSummary[]> {
  return (
    (await wpFetch<WpPageSummary[]>(
      "pages?per_page=100&status=publish&orderby=menu_order&order=asc"
    )) ?? []
  );
}

export async function fetchPostBySlug(slug: string) {
  const posts = (await wpFetch<unknown[]>(`posts?slug=${slug}&_embed`)) ?? [];
  return posts[0] ?? null;
}

export async function fetchServiceBySlug(slug: string) {
  const services = (await wpFetch<unknown[]>(`service?slug=${slug}&_embed`)) ?? [];
  return services[0] ?? null;
}

export async function fetchHeader() {
  const data = await wpFetch<Array<{ acf?: Record<string, unknown> }>>("header?_embed");
  return data?.[0]?.acf ?? null;
}

export async function fetchFooter() {
  const data = await wpFetch<Array<{ acf?: Record<string, unknown> }>>("footer?_embed");
  return data?.[0]?.acf ?? null;
}
