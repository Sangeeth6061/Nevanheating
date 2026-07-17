import Link from "next/link";
import { Home } from "lucide-react";
import { acfImageUrl } from "@/lib/wp-utils";

type AboutHeroProps = {
  title?: string;
  description?: string;
  breadcrumbsText?: string;
  breadcrumbsIcon?: { url?: string } | false | null;
  pageTitle?: string;
};

function Breadcrumbs({
  breadcrumbsText,
  breadcrumbsIcon,
  pageTitle,
}: Pick<AboutHeroProps, "breadcrumbsText" | "breadcrumbsIcon" | "pageTitle">) {
  const iconUrl = acfImageUrl(breadcrumbsIcon);

  if (breadcrumbsText) {
    const parts = breadcrumbsText.split(">").map((part) => part.trim());
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300/90 mb-5 md:mb-6">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="w-4 h-4 object-contain opacity-80" />
        ) : (
          <Home className="w-4 h-4 shrink-0 opacity-80" aria-hidden="true" />
        )}
        <ol className="flex items-center flex-wrap gap-1.5">
          {parts.map((part, index) => {
            const isHome = part.toLowerCase() === "home";
            const isBlog = part.toLowerCase() === "blog";
            const isLast = index === parts.length - 1;
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-slate-400/80">&gt;</span>}
                {isHome && !isLast ? (
                  <Link href="/" className="hover:text-white transition-colors">
                    {part}
                  </Link>
                ) : isBlog && !isLast ? (
                  <Link href="/blog" className="hover:text-white transition-colors">
                    {part}
                  </Link>
                ) : (
                  <span className={isLast ? "text-slate-200" : undefined}>{part}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300/90 mb-5 md:mb-6">
      {iconUrl ? (
        <img src={iconUrl} alt="" className="w-4 h-4 object-contain opacity-80" />
      ) : (
        <Home className="w-4 h-4 shrink-0 opacity-80" aria-hidden="true" />
      )}
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
        </li>
        <li className="flex items-center gap-1.5">
          <span className="text-slate-400/80">&gt;</span>
          <span className="text-slate-200">{pageTitle}</span>
        </li>
      </ol>
    </nav>
  );
}

export default function AboutHero({
  title,
  description,
  breadcrumbsText,
  breadcrumbsIcon,
  pageTitle,
}: AboutHeroProps) {
  if (!title) return null;

  return (
    <section className="w-full bg-gradient-to-r from-[#4a5d6f] via-[#6d7f92] to-[#e8edf2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20">
        <Breadcrumbs
          breadcrumbsText={breadcrumbsText}
          breadcrumbsIcon={breadcrumbsIcon}
          pageTitle={pageTitle}
        />
        <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] font-extrabold text-white leading-tight tracking-tight font-heading max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 md:mt-5 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
