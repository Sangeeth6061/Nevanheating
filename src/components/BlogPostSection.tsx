import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import AboutHero from "@/components/AboutHero";
import BlogSidebar from "@/components/BlogSidebar";
import { fetchCategories, fetchPageBySlug, fetchPosts } from "@/lib/wordpress";
import {
  getBlogCategoriesFromPosts,
  parseBlogCategories,
  parseBlogPosts,
  parseBlogSidebarBanner,
  type BlogPostDetail,
} from "@/lib/blog";

type BlogPostSectionProps = {
  post: BlogPostDetail;
};

export default async function BlogPostSection({ post }: BlogPostSectionProps) {
  const [blogPage, postsData, categoriesData] = await Promise.all([
    fetchPageBySlug("blog"),
    fetchPosts(),
    fetchCategories(),
  ]);

  const blogAcf = (blogPage as { acf?: Record<string, unknown> } | null)?.acf;
  const banner = parseBlogSidebarBanner(blogAcf);

  const posts = parseBlogPosts(postsData);
  const categories =
    parseBlogCategories(categoriesData).length > 0
      ? parseBlogCategories(categoriesData)
      : getBlogCategoriesFromPosts(posts);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AboutHero
        title={post.title}
        description={post.excerpt}
        breadcrumbsText="Home > Blog"
        pageTitle={post.title}
      />

      <section className="w-full bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
            <article className="lg:col-span-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Blog
              </Link>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B] leading-tight tracking-tight font-heading mb-5">
                {post.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {post.category && (
                  <span className="inline-flex items-center rounded-full bg-[#2563EB] px-4 py-1.5 text-sm font-semibold text-white">
                    {post.category}
                  </span>
                )}
                {post.date && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#64748B]">
                    <Calendar className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                    {post.date}
                  </span>
                )}
                {post.readTime && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#64748B]">
                    <Clock className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                    {post.readTime}
                  </span>
                )}
              </div>

              {post.imageUrl && (
                <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                  <div className="aspect-[16/9] sm:aspect-[21/9]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            <BlogSidebar
              categories={categories}
              activeCategory={post.categorySlug ?? "all"}
              bannerTitle={banner.title}
              bannerDescription={banner.description}
              quoteHref={banner.buttonHref ?? "#"}
              quoteLabel={banner.buttonLabel ?? "Get a Quote"}
              linkCategories
            />
          </div>
        </div>
      </section>
    </div>
  );
}
