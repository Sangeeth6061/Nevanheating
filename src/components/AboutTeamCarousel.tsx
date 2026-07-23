"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import type { AboutTeamMember } from "@/lib/about-team";
import AboutTeamMemberCard from "@/components/AboutTeamMemberCard";

const SLIDE_RATIO = 0.5;
const SLIDE_GAP_PX = 12;

type AboutTeamCarouselProps = {
  members: AboutTeamMember[];
};

export default function AboutTeamCarousel({ members }: AboutTeamCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setContainerWidth(element.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, members.length - 1)));
  }, [members.length]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), members.length - 1));
    },
    [members.length]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= members.length - 1 ? 0 : prev + 1));
  }, [members.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? members.length - 1 : prev - 1));
  }, [members.length]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? 0;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const currentX = event.touches[0]?.clientX ?? 0;
    touchDeltaX.current = currentX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current <= -40) goNext();
    else if (touchDeltaX.current >= 40) goPrev();
    touchDeltaX.current = 0;
  };

  if (members.length === 0) return null;

  const slideWidth = containerWidth > 0 ? containerWidth * SLIDE_RATIO : 0;
  const peek = containerWidth > 0 ? (containerWidth - slideWidth) / 2 : 0;
  const translateX =
    containerWidth > 0 ? peek - currentIndex * (slideWidth + SLIDE_GAP_PX) : 0;

  return (
    <div ref={containerRef} className="relative w-full md:hidden">
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex will-change-transform transition-transform duration-500 ease-out"
          style={{
            gap: SLIDE_GAP_PX,
            transform: slideWidth > 0 ? `translateX(${translateX}px)` : undefined,
          }}
        >
          {members.map((member) => (
            <article
              key={member.id}
              className="flex shrink-0 flex-col items-center text-center"
              style={{ width: slideWidth > 0 ? slideWidth : `${SLIDE_RATIO * 100}%` }}
            >
              <AboutTeamMemberCard member={member} />
            </article>
          ))}
        </div>
      </div>

      {members.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {members.map((member, index) => (
            <button
              key={member.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-[#2563EB]" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Show team member ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
