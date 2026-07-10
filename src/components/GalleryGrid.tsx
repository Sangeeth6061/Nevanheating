"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { getGalleryCategories, type GalleryItem } from "@/lib/gallery";

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const categories = useMemo(() => ["All", ...getGalleryCategories(items)], [items]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  useEffect(() => {
    if (!lightboxItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxItem]);

  if (items.length === 0) return null;

  return (
    <>
      <section className="w-full bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 md:pt-14 lg:pt-16 pb-14 md:pb-16 lg:pb-20">
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 md:mb-12">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={[
                      "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-[#E8EEF7] text-[#334155] hover:bg-[#DDE7F5]",
                    ].join(" ")}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              >
                {item.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    className="group relative block w-full aspect-[4/3] overflow-hidden cursor-pointer"
                    aria-label={item.title ? `View ${item.title}` : "View gallery image"}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Gallery project"}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />

                    {item.category && (
                      <span className="absolute top-4 left-4 z-10 bg-white text-[#1E293B] text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                        {item.category}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-[#0f172a]/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {(item.title || item.location) && (
                      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {item.title && (
                          <h3 className="text-lg font-bold text-white leading-snug font-heading text-left">
                            {item.title}
                          </h3>
                        )}
                        {item.location && (
                          <p className="mt-1 text-sm text-white/90 text-left">{item.location}</p>
                        )}
                      </div>
                    )}
                  </button>
                )}

                {(item.title || item.location) && (
                  <div className="px-5 py-4 md:px-6 md:py-5">
                    {item.title && (
                      <h3 className="text-lg md:text-xl font-bold text-[#1E293B] leading-snug font-heading">
                        {item.title}
                      </h3>
                    )}
                    {item.location && (
                      <p className="mt-1.5 text-sm md:text-[15px] text-[#64748B]">{item.location}</p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 sm:px-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title || "Gallery image"}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close gallery image"
          >
            <X className="h-7 w-7" strokeWidth={2} />
          </button>

          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {lightboxItem.imageUrl && (
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title || "Gallery project"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {(lightboxItem.title || lightboxItem.location) && (
              <div className="border-t border-slate-100 px-6 py-5 md:px-8 md:py-6">
                {lightboxItem.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-[#1E293B] leading-snug font-heading">
                    {lightboxItem.title}
                  </h3>
                )}
                {lightboxItem.location && (
                  <p className="mt-1.5 text-sm md:text-[15px] text-[#64748B]">{lightboxItem.location}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
