"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Clock, Star, Users } from "lucide-react";
import { parseStatValue, type AboutStatItem } from "@/lib/about-stats";

type AboutStatsSectionProps = {
  stats: AboutStatItem[];
};

const FALLBACK_ICONS = [Clock, Users, Award, Star];

function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { target, suffix, decimals } = parseStatValue(value);

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 1400;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const current = target * eased;
        setDisplayValue(
          decimals > 0 ? current.toFixed(decimals) + suffix : Math.round(current) + suffix
        );
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="block text-4xl md:text-[42px] font-extrabold text-white leading-none mb-2 font-heading">
      {displayValue}
    </span>
  );
}

export default function AboutStatsSection({ stats }: AboutStatsSectionProps) {
  if (stats.length === 0) return null;

  return (
    <section className="w-full bg-[#0F172A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-6">
          {stats.map((stat, index) => {
            const FallbackIcon = FALLBACK_ICONS[index % FALLBACK_ICONS.length];

            return (
              <div key={stat.id} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-[#2a3f5c] flex items-center justify-center mb-4">
                  {stat.iconUrl ? (
                    <img src={stat.iconUrl} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <FallbackIcon className="w-6 h-6 text-[#ff791a]" strokeWidth={2} aria-hidden="true" />
                  )}
                </div>
                <AnimatedStatValue value={stat.value} />
                {stat.label && (
                  <p className="text-sm md:text-[15px] text-[#94A3B8] font-medium">{stat.label}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
