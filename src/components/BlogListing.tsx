"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calendar, Clock, Tag } from "lucide-react";
import type { BlogCategory, BlogPost } from "@/lib/blog";

type BlogListingProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  bannerTitle?: string;
  bannerDescription?: string;
  quoteHref: string;
  quoteLabel: string;
};

export default function BlogListing({
  posts,
  categories,
  bannerTitle,
  bannerDescription,
  quoteHref,
  quoteLabel,
}: BlogListingProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((post) => post.categorySlug === activeCategory);
  }, [activeCategory, posts]);

  if (posts.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 md:pt-14 lg:pt-16 pb-14 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
                >
                  {post.imageUrl && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-[#2563EB] text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="px-5 py-5 md:px-6 md:py-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] mb-4">
                      {post.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                          {post.date}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-[#1E293B] leading-snug mb-3 font-heading">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed mb-5 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={post.href}
                      className="inline-flex items-center gap-1.5 text-[#2563EB] text-sm font-semibold hover:text-[#1D4ED8] transition-colors"
                    >
                      Read More
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-6 py-6 md:px-7 md:py-7">
              <h2 className="text-xl font-bold text-[#1E293B] mb-5 font-heading">Categories</h2>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={[
                      "inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors",
                      activeCategory === "all"
                        ? "text-[#2563EB]"
                        : "text-[#475569] hover:text-[#2563EB]",
                    ].join(" ")}
                  >
                    <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                    All
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category.slug)}
                      className={[
                        "inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors",
                        activeCategory === category.slug
                          ? "text-[#2563EB]"
                          : "text-[#475569] hover:text-[#2563EB]",
                      ].join(" ")}
                    >
                      <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#1E3A8A] px-6 py-7 md:px-8 md:py-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-heading">
                {bannerTitle}
              </h2>
              <p className="text-white/90 text-sm md:text-[15px] leading-relaxed mb-6">
                {bannerDescription}
              </p>
              <Link
                href={quoteHref}
                className="inline-flex items-center justify-center w-full rounded-full bg-white text-[#1E3A8A] text-sm md:text-[15px] font-bold px-6 py-3.5 hover:bg-slate-50 transition-colors"
              >
                {quoteLabel}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
