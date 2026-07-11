"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, ChevronDown, Flame, Menu } from "lucide-react";
import Link from "next/link";
import { wpUrlToPath, CONTACT_NUMBER, telHref } from "@/lib/wp-utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MenuItem = {
  page_name: string;
  page_link?: { url?: string };
};

type ServiceMenuItem = {
  label: string;
  href: string;
};

type HeaderData = {
  tag_line?: string;
  opening_hours?: string;
  menu?: MenuItem[];
  logo?: { url?: string; alt?: string };
  button_text?: string;
  button_link?: { url?: string };
};

export default function HeaderClient({
  headerData,
  serviceMenuItems = [],
}: {
  headerData: HeaderData | null;
  serviceMenuItems?: ServiceMenuItem[];
}) {
  const [showTopRow, setShowTopRow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [topRowHeight, setTopRowHeight] = useState(40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRowRef.current) {
      setTopRowHeight(topRowRef.current.offsetHeight);
    }
  }, [headerData]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setShowTopRow(true);
        setLastScrollY(currentScrollY);
      } else if (currentScrollY > lastScrollY + 10) {
        setShowTopRow(false);
        setLastScrollY(currentScrollY);
      } else if (currentScrollY < lastScrollY - 10) {
        setShowTopRow(true);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!headerData) {
    return (
      <header className="px-4 sm:px-6 lg:px-12 relative z-50 w-full min-h-[72px] lg:h-[90px] flex items-center justify-between bg-white border-b border-slate-100 shadow-sm">
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

  const quoteHref = wpUrlToPath(headerData.button_link?.url);

  return (
    <div
      className="sticky top-0 z-50 w-full flex flex-col shadow-sm transition-transform duration-300 ease-in-out"
      style={{ transform: showTopRow ? "translateY(0)" : `translateY(-${topRowHeight}px)` }}
    >
      {/* Top Row */}
      <div
        id="top-row"
        ref={topRowRef}
        className="bg-[#1e3a8a] text-slate-200 text-xs sm:text-[13px] px-4 sm:px-6 lg:px-12 flex items-center justify-between py-2 gap-3"
      >
        <div className="truncate hidden sm:block">{headerData.tag_line}</div>
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 ml-auto sm:ml-0">
          <div className="hidden md:block border-r border-slate-400/30 pr-4 lg:pr-6 whitespace-nowrap">
            {headerData.opening_hours}
          </div>
          <a
            href={telHref(CONTACT_NUMBER)}
            className="flex items-center gap-2 text-[#F97316] font-semibold hover:text-orange-400 transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{CONTACT_NUMBER}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>

      {/* Menu Row */}
      <header
        id="menu-row"
        className="bg-white px-4 sm:px-6 lg:px-12 w-full min-h-[72px] lg:h-[90px] flex items-center justify-between border-b border-slate-100 relative z-10 gap-3"
      >
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/">
            {headerData.logo?.url ? (
              <img
                src={headerData.logo.url}
                alt={headerData.logo.alt || "Logo"}
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              />
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

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-semibold text-[15px] text-[#1e3a8a]">
          {headerData.menu?.map((item, i) => {
            const isHome = item.page_name.toLowerCase() === "home";
            const isServices = item.page_name.toLowerCase() === "services";
            const href = wpUrlToPath(item.page_link?.url);

            if (isServices && serviceMenuItems.length > 0) {
              return (
                <div key={i} className="relative group">
                  <Link
                    href={href}
                    className="hover:text-[#2563EB] transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    {item.page_name}
                    <ChevronDown className="w-4 h-4 opacity-70 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                    <div className="min-w-[240px] rounded-xl border border-slate-100 bg-white py-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
                      {serviceMenuItems.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="block px-4 py-2.5 text-[14px] font-semibold text-[#1e3a8a] hover:bg-slate-50 hover:text-[#2563EB] transition-colors"
                        >
                          {service.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={i}
                href={href}
                className={`${isHome ? "text-[#2563EB]" : "hover:text-[#2563EB]"} transition-colors flex items-center gap-1 whitespace-nowrap`}
              >
                {item.page_name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
          <a
            href={telHref(CONTACT_NUMBER)}
            className="hidden md:flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors whitespace-nowrap"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>

          <Link
            href={quoteHref}
            className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-blue-800 text-white rounded-[8px] px-4 sm:px-6 py-3 sm:py-4 lg:py-5 shadow-sm text-sm sm:text-[15px] font-medium whitespace-nowrap"
          >
            {headerData.button_text}
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#1e3a8a] hover:bg-slate-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm bg-white p-0">
              <SheetHeader className="border-b border-slate-100 px-5 py-4">
                <SheetTitle className="text-[#1e3a8a] font-bold text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-5 py-4">
                {headerData.menu?.map((item, i) => {
                  const isHome = item.page_name.toLowerCase() === "home";
                  const isServices = item.page_name.toLowerCase() === "services";
                  const href = wpUrlToPath(item.page_link?.url);

                  if (isServices && serviceMenuItems.length > 0) {
                    return (
                      <div key={i} className="border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((open) => !open)}
                          className="w-full py-3.5 text-[15px] font-semibold text-[#1e3a8a] flex items-center justify-between"
                        >
                          <span>{item.page_name}</span>
                          <ChevronDown
                            className={`w-4 h-4 opacity-70 transition-transform ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileServicesOpen && (
                          <div className="pb-3 pl-3 flex flex-col gap-1">
                            <Link
                              href={href}
                              onClick={() => setMobileOpen(false)}
                              className="py-2 text-sm font-semibold text-[#2563EB]"
                            >
                              All Services
                            </Link>
                            {serviceMenuItems.map((service) => (
                              <Link
                                key={service.href}
                                href={service.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition-colors"
                              >
                                {service.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={i}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`py-3.5 border-b border-slate-100 text-[15px] font-semibold flex items-center justify-between ${
                        isHome ? "text-[#2563EB]" : "text-[#1e3a8a]"
                      }`}
                    >
                      {item.page_name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto px-5 pb-6 pt-2 flex flex-col gap-3 border-t border-slate-100">
                <a
                  href={telHref(CONTACT_NUMBER)}
                  className="inline-flex items-center justify-center gap-2 text-[#2563EB] font-semibold py-3"
                >
                  <Phone className="w-4 h-4" />
                  Call Now — {CONTACT_NUMBER}
                </a>
                <Link
                  href={quoteHref}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-blue-800 text-white rounded-lg px-6 py-3.5 font-medium"
                >
                  {headerData.button_text}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
