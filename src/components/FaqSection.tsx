"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqGroup } from "@/lib/faq";

type FaqSectionProps = {
  groups: FaqGroup[];
};

export default function FaqSection({ groups }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const firstItem = groups[0]?.items[0];
    return firstItem ? new Set([firstItem.id]) : new Set();
  });

  if (groups.length === 0) return null;

  const toggleItem = (itemId: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 md:pt-14 lg:pt-16 pb-14 md:pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-14">
          {groups.map((group) => (
            <div key={group.id}>
              <h2 className="text-2xl md:text-[28px] font-bold text-[#1E293B] mb-4 font-heading">
                {group.title}
              </h2>
              <div className="border-b border-slate-200 mb-6" />

              <div className="space-y-3">
                {group.items.map((item) => {
                  const isOpen = openItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base md:text-lg font-bold text-[#1E293B] leading-snug font-heading">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={[
                            "w-5 h-5 shrink-0 text-[#2563EB] transition-transform duration-200",
                            isOpen ? "rotate-180" : "",
                          ].join(" ")}
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 md:px-6 md:pb-6 -mt-1">
                          <p className="text-[#64748B] text-sm md:text-[15px] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
