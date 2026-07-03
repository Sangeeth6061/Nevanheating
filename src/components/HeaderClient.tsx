"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, ChevronDown, Flame } from "lucide-react";
import Link from "next/link";
import { wpUrlToPath } from "@/lib/wp-utils";

export default function HeaderClient({ headerData }: { headerData: any }) {
  const [showTopRow, setShowTopRow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [topRowHeight, setTopRowHeight] = useState(40); // fallback height
  const topRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRowRef.current) {
      setTopRowHeight(topRowRef.current.offsetHeight);
    }
  }, [headerData]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we are at the very top, always show it
      if (currentScrollY < 50) {
        setShowTopRow(true);
        setLastScrollY(currentScrollY);
      } else {
        // Add a threshold of 10px to prevent vibrating on small scroll bounces
        if (currentScrollY > lastScrollY + 10) {
          setShowTopRow(false); // scrolling down -> hide
          setLastScrollY(currentScrollY);
        } else if (currentScrollY < lastScrollY - 10) {
          setShowTopRow(true); // scrolling up -> appear
          setLastScrollY(currentScrollY);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!headerData) {
    return (
      <header className="px-6 lg:px-12 relative z-50 w-full h-[90px] flex items-center justify-between bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-blue-100 text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-bold text-[9px] tracking-wider text-blue-900 leading-none mt-1">NEVAN PLUMBING</span>
            <span className="text-[6px] text-orange-500 font-bold tracking-widest leading-none mt-0.5">&amp; HEATING</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div 
      className="sticky top-0 z-50 w-full flex flex-col shadow-sm transition-transform duration-300 ease-in-out"
      style={{ transform: showTopRow ? 'translateY(0)' : `translateY(-${topRowHeight}px)` }}
    >
      {/* Top Row */}
      <div 
        id="top-row"
        ref={topRowRef}
        className="bg-[#1e3a8a] text-slate-200 text-[13px] px-6 lg:px-12 flex items-center justify-between py-2"
      >
        <div>{headerData.tag_line}</div>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden md:block border-r border-slate-400/30 pr-4 lg:pr-6">{headerData.opening_hours}</div>
          <a href={`tel:${headerData.contact_number?.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-[#F97316] font-semibold hover:text-orange-400 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            {headerData.contact_number}
          </a>
        </div>
      </div>

      {/* Menu Row */}
      <header id="menu-row" className="bg-white px-6 lg:px-12 w-full h-[90px] flex items-center justify-between border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            {headerData.logo?.url ? (
              <img src={headerData.logo.url} alt={headerData.logo.alt || "Logo"} className="h-12 lg:h-14 w-auto object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-blue-100 text-orange-500">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="font-bold text-[9px] tracking-wider text-blue-900 leading-none mt-1">NEVAN PLUMBING</span>
                <span className="text-[6px] text-orange-500 font-bold tracking-widest leading-none mt-0.5">&amp; HEATING</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-semibold text-[15px] text-[#1e3a8a]">
          {headerData.menu?.map((item: { page_name: string; page_link?: { url?: string } }, i: number) => {
            const isHome = item.page_name.toLowerCase() === "home";
            const href = wpUrlToPath(item.page_link?.url);
            return (
              <Link
                key={i}
                href={href}
                className={`${isHome ? "text-[#2563EB]" : "hover:text-[#2563EB]"} transition-colors flex items-center gap-1`}
              >
                {item.page_name}
                {item.page_name.toLowerCase() === "services" && <ChevronDown className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          {headerData.contact_number && (
            <a
              href={`tel:${headerData.contact_number.replace(/\s+/g, "")}`}
              className="hidden md:flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          )}
          <Link
            href={wpUrlToPath(headerData.button_link?.url)}
            className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-blue-800 text-white rounded-[8px] px-6 py-5 shadow-sm text-[15px] font-medium"
          >
            {headerData.button_text}
          </Link>
        </div>
      </header>
    </div>
  );
}
