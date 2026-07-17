"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import type { BlogCategory } from "@/lib/blog";

type BlogSidebarProps = {
  categories: BlogCategory[];
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
  bannerTitle?: string;
  bannerDescription?: string;
  quoteHref: string;
  quoteLabel: string;
  linkCategories?: boolean;
};

export default function BlogSidebar({
  categories,
  activeCategory = "all",
  onCategoryChange,
  bannerTitle,
  bannerDescription,
  quoteHref,
  quoteLabel,
  linkCategories = false,
}: BlogSidebarProps) {
  const categoryClass = (isActive: boolean) =>
    [
      "inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors",
      isActive ? "text-[#2563EB]" : "text-[#475569] hover:text-[#2563EB]",
    ].join(" ");

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-6 py-6 md:px-7 md:py-7">
        <h2 className="text-xl font-bold text-[#1E293B] mb-5 font-heading">Categories</h2>
        <ul className="space-y-3">
          <li>
            {linkCategories ? (
              <Link href="/blog" className={categoryClass(activeCategory === "all")}>
                <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                All
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onCategoryChange?.("all")}
                className={categoryClass(activeCategory === "all")}
              >
                <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                All
              </button>
            )}
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              {linkCategories ? (
                <Link href="/blog" className={categoryClass(activeCategory === category.slug)}>
                  <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  {category.name}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onCategoryChange?.(category.slug)}
                  className={categoryClass(activeCategory === category.slug)}
                >
                  <Tag className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  {category.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-[#1E3A8A] px-6 py-7 md:px-8 md:py-8 text-center lg:sticky lg:top-28">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-heading">{bannerTitle}</h2>
        <p className="text-white/90 text-sm md:text-[15px] leading-relaxed mb-6">{bannerDescription}</p>
        <Link
          href={quoteHref}
          className="inline-flex items-center justify-center w-full rounded-full bg-white text-[#1E3A8A] text-sm md:text-[15px] font-bold px-6 py-3.5 hover:bg-slate-50 transition-colors"
        >
          {quoteLabel}
        </Link>
      </div>
    </aside>
  );
}
