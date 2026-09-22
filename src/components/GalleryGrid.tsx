"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery";

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxItem = lightboxIndex === null ? null : items[lightboxIndex];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showNext = useCallback(() => {
    setLightboxIndex((index) => (index === null ? index : (index + 1) % items.length));
  }, [items.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? index : (index - 1 + items.length) % items.length
    );
  }, [items.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightboxIndex, showNext, showPrev]);

  if (items.length === 0) return null;

  return (
    <>
      <section className="w-full bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 md:pt-14 lg:pt-16 pb-14 md:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              >
                {item.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="group relative block w-full aspect-[4/5] overflow-hidden cursor-pointer"
                    aria-label={item.title ? `View ${item.title}` : "View gallery image"}
                  >
                    <img
                      src={item.thumbUrl ?? item.imageUrl}
                      alt={item.alt || item.title || "Gallery project"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8 sm:px-16"
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

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {lightboxItem.imageUrl && (
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.alt || lightboxItem.title || "Gallery project"}
                className="block max-h-[85vh] w-auto max-w-full object-contain bg-slate-100"
              />
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
