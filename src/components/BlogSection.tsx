import { fetchCategories, fetchPosts } from "@/lib/wordpress";
import {
  getBlogCategoriesFromPosts,
  parseAcfBlogPosts,
  parseBlogCategories,
  parseBlogPosts,
  parseBlogSidebarBanner,
} from "@/lib/blog";
import BlogListing from "@/components/BlogListing";

type BlogSectionProps = {
  acf?: Record<string, unknown>;
};

export default async function BlogSection({ acf }: BlogSectionProps) {
  const [postsData, categoriesData] = await Promise.all([fetchPosts(), fetchCategories()]);

  const posts =
    parseBlogPosts(postsData).length > 0
      ? parseBlogPosts(postsData)
      : parseAcfBlogPosts(acf);

  if (posts.length === 0) return null;

  const categories =
    parseBlogCategories(categoriesData).length > 0
      ? parseBlogCategories(categoriesData)
      : getBlogCategoriesFromPosts(posts);

  const banner = parseBlogSidebarBanner(acf);

  return (
    <BlogListing
      posts={posts}
      categories={categories}
      bannerTitle={banner.title}
      bannerDescription={banner.description}
      quoteHref={banner.buttonHref ?? "#"}
      quoteLabel={banner.buttonLabel ?? "Get a Quote"}
    />
  );
}
