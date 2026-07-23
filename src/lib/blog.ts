import { acfLinkHref, type AcfLink } from "@/lib/wp-utils";

export type BlogSidebarBanner = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function parseBlogSidebarBanner(acf?: Record<string, unknown> | null): BlogSidebarBanner {
  const buttonLink = acf?.small_banner_button_text as AcfLink | undefined;

  return {
    title: acfStr(acf?.small_banner_title),
    description: acfStr(acf?.small_banner_text_area),
    buttonLabel: buttonLink?.title?.trim(),
    buttonHref: buttonLink ? acfLinkHref(buttonLink) : undefined,
  };
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  category?: string;
  categorySlug?: string;
  date: string;
  readTime: string;
  href: string;
};

export type BlogPostDetail = BlogPost & {
  content: string;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
};

type WpEmbeddedTerm = {
  taxonomy?: string;
  name?: string;
  slug?: string;
};

type WpEmbeddedMedia = {
  source_url?: string;
};

type WpPostResponse = {
  id?: number;
  slug?: string;
  link?: string;
  date?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: WpEmbeddedMedia[];
    "wp:term"?: WpEmbeddedTerm[][];
  };
};

type WpCategoryResponse = {
  id?: number;
  name?: string;
  slug?: string;
  count?: number;
};

type AcfPostObject = {
  ID?: number;
  post_name?: string;
  post_title?: string;
  post_content?: string;
  post_excerpt?: string;
  post_date?: string;
  guid?: string;
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export { stripHtml };

export function formatBlogDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function estimateReadTime(content?: string): string {
  const text = stripHtml(content);
  if (!text) return "1 min read";

  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function getPrimaryCategory(post: WpPostResponse): { name?: string; slug?: string } {
  const terms = post._embedded?.["wp:term"];
  if (!Array.isArray(terms)) return {};

  for (const group of terms) {
    if (!Array.isArray(group)) continue;
    const category = group.find((term) => term.taxonomy === "category" && term.name);
    if (category) {
      return { name: category.name, slug: category.slug };
    }
  }

  return {};
}

function postHref(slug?: string, link?: string): string {
  if (slug) return `/${slug}`;
  if (link) {
    try {
      const parsed = new URL(link);
      return parsed.pathname || "/";
    } catch {
      return link;
    }
  }
  return "#";
}

export function parseBlogPosts(posts: unknown[]): BlogPost[] {
  return posts
    .map((item, index): BlogPost | null => {
      if (!item || typeof item !== "object") return null;
      const post = item as WpPostResponse;
      const title = stripHtml(post.title?.rendered);
      const excerpt = stripHtml(post.excerpt?.rendered) || stripHtml(post.content?.rendered);
      const content = post.content?.rendered ?? post.excerpt?.rendered;
      const category = getPrimaryCategory(post);
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];

      if (!title) return null;

      return {
        id: String(post.id ?? `post-${index}`),
        slug: post.slug ?? "",
        title,
        excerpt,
        imageUrl: featuredMedia?.source_url,
        category: category.name,
        categorySlug: category.slug,
        date: formatBlogDate(post.date),
        readTime: estimateReadTime(content),
        href: postHref(post.slug, post.link),
      };
    })
    .filter((post): post is BlogPost => post !== null);
}

export function parseBlogPostDetail(post: unknown): BlogPostDetail | null {
  if (!post || typeof post !== "object") return null;
  const parsed = parseBlogPosts([post])[0];
  if (!parsed) return null;

  const raw = post as WpPostResponse;
  const content = raw.content?.rendered?.trim();
  if (!content) return null;

  return {
    ...parsed,
    content,
  };
}

export function parseAcfBlogPosts(acf?: Record<string, unknown> | null): BlogPost[] {
  if (!acf) return [];

  const raw = acf.add_a_new_post;
  const items = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return items
    .map((item, index): BlogPost | null => {
      const post = item as AcfPostObject;
      const title = post.post_title?.trim();
      if (!title) return null;

      const excerpt = stripHtml(post.post_excerpt) || stripHtml(post.post_content);

      return {
        id: String(post.ID ?? `acf-post-${index}`),
        slug: post.post_name ?? "",
        title,
        excerpt,
        date: formatBlogDate(post.post_date),
        readTime: estimateReadTime(post.post_content),
        href: postHref(post.post_name, post.guid),
      };
    })
    .filter((post): post is BlogPost => post !== null);
}

export function parseBlogCategories(categories: unknown[]): BlogCategory[] {
  return categories
    .map((item) => {
      const category = item as WpCategoryResponse;
      if (!category.id || !category.name || !category.slug) return null;
      if ((category.count ?? 0) === 0) return null;

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
      };
    })
    .filter((category): category is BlogCategory => category !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBlogCategoriesFromPosts(posts: BlogPost[]): BlogCategory[] {
  const seen = new Map<string, BlogCategory>();

  for (const post of posts) {
    if (!post.category || !post.categorySlug) continue;
    if (!seen.has(post.categorySlug)) {
      seen.set(post.categorySlug, {
        id: seen.size + 1,
        name: post.category,
        slug: post.categorySlug,
      });
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
}
