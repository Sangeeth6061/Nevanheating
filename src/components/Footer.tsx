import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { fetchFooter } from "@/lib/wordpress";
import {
  acfImageUrl,
  acfLegalLinkHref,
  acfLinkHref,
  wpUrlToPath,
  CONTACT_NUMBER,
  isHoursContactText,
  isLocationContactText,
  isPhoneNumber,
  resolveAcfContactTitle,
  telHref,
  type AcfLink,
} from "@/lib/wp-utils";

type QuickLinkItem = { link_label?: AcfLink };
type ServiceItem = { add_a_service_label?: AcfLink };
type ContactItem = {
  contact_info_icon?: { url?: string } | false;
  add_a_ft_col_4_contact_info_link?: AcfLink;
  add_a_ft_col_4_contact_info_description?: string;
};
type SocialItem = { add_a_social_link_?: AcfLink };

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIcon({ name }: { name?: string }) {
  const key = name?.toLowerCase() ?? "";
  if (key.includes("face")) return <FacebookIcon className="w-4 h-4" />;
  if (key.includes("insta")) return <InstagramIcon className="w-4 h-4" />;
  return <TwitterIcon className="w-4 h-4" />;
}

function ContactFallbackIcon({
  title,
  description,
  isPhone,
  isLocation,
  isHours,
}: {
  title?: string;
  description?: string;
  isPhone?: boolean;
  isLocation?: boolean;
  isHours?: boolean;
}) {
  if (isPhone) return <Phone className="w-4 h-4 text-[#F97316] shrink-0" />;
  if (isLocation) return <MapPin className="w-4 h-4 text-[#ff791a] shrink-0" />;
  if (isHours) return <Clock className="w-4 h-4 text-[#F97316] shrink-0" />;
  const text = `${title ?? ""} ${description ?? ""}`.toLowerCase();
  if (text.includes("@")) return <Mail className="w-4 h-4 text-[#F97316] shrink-0" />;
  return <Phone className="w-4 h-4 text-[#F97316] shrink-0" />;
}

function splitHoursLines(description?: string): string[] {
  if (!description) return [];
  if (description.includes("Saturday")) {
    return description.split(/\s{2,}|\s+(?=Saturday)/).map((line) => line.trim()).filter(Boolean);
  }
  return [description];
}

export default async function Footer() {
  const footerData = await fetchFooter();
  if (!footerData) return null;

  const logoUrl = acfImageUrl(footerData.ft_logo as { url?: string } | undefined);
  const companyDescription = footerData.ft_company_description as string | undefined;
  const quickLinksTitle = footerData.ft_col_2_title as string | undefined;
  const servicesTitle = footerData.ft_col_3_title as string | undefined;
  const contactTitle = footerData.ft_col_4_title as string | undefined;
  const copyright = footerData.copyright_part as string | undefined;
  const privacyLink = footerData.pr as AcfLink | undefined;
  const termsLink = footerData.terms_of_services as AcfLink | undefined;

  const quickLinks = (footerData.quick_links as QuickLinkItem[] | undefined) ?? [];
  const serviceLinks = (footerData.add_services as ServiceItem[] | undefined) ?? [];
  const contactItems = (footerData.add_contact_info as ContactItem[] | undefined) ?? [];
  const socialIcons = (footerData.social_icons as SocialItem[] | undefined) ?? [];

  const showBottomBar = copyright || privacyLink?.title || termsLink?.title;

  return (
    <footer className="bg-[#1a2b4d] text-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Column 1 — Company */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              {logoUrl ? (
                <img src={logoUrl} alt="Nevan Plumbing and Heating" className="h-12 sm:h-14 w-auto object-contain" />
              ) : (
                <span className="font-bold text-lg">Nevan Plumbing &amp; Heating</span>
              )}
            </Link>
            {companyDescription && (
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">{companyDescription}</p>
            )}
            {socialIcons.length > 0 && (
              <div className="flex items-center gap-3">
                {socialIcons.map((item, index) => {
                  const link = item.add_a_social_link_;
                  if (!link?.url && !link?.title) return null;
                  return (
                    <a
                      key={index}
                      href={acfLinkHref(link)}
                      target={link.target || "_blank"}
                      rel="noopener noreferrer"
                      aria-label={link.title}
                      className="w-9 h-9 rounded-full border border-slate-500/50 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-300 transition-colors"
                    >
                      <SocialIcon name={link.title} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links + Services — two columns on responsive, separate columns on desktop */}
          {(quickLinks.length > 0 && quickLinksTitle) || (serviceLinks.length > 0 && servicesTitle) ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:col-span-2 sm:gap-x-8 lg:contents">
              {quickLinks.length > 0 && quickLinksTitle && (
                <div className="min-w-0">
                  <h3 className="font-bold text-base mb-4 sm:mb-5">{quickLinksTitle}</h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {quickLinks.map((item, index) => {
                      const link = item.link_label;
                      if (!link?.title) return null;
                      return (
                        <li key={index}>
                          <Link
                            href={wpUrlToPath(link.url)}
                            className="block py-0.5 text-slate-300 hover:text-white text-sm transition-colors break-words"
                          >
                            {link.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {serviceLinks.length > 0 && servicesTitle && (
                <div className="min-w-0">
                  <h3 className="font-bold text-base mb-4 sm:mb-5">{servicesTitle}</h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {serviceLinks.map((item, index) => {
                      const link = item.add_a_service_label;
                      if (!link?.title) return null;
                      return (
                        <li key={index}>
                          <Link
                            href={wpUrlToPath(link.url)}
                            className="block py-0.5 text-slate-300 hover:text-white text-sm transition-colors break-words"
                          >
                            {link.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Column 4 — Contact */}
          {contactItems.length > 0 && contactTitle && (
            <div className="sm:col-span-2 lg:col-span-1 min-w-0">
              <h3 className="font-bold text-base mb-4 sm:mb-5">{contactTitle}</h3>
              <ul className="space-y-4">
                {contactItems.map((item, index) => {
                  const link = item.add_a_ft_col_4_contact_info_link;
                  const description = item.add_a_ft_col_4_contact_info_description;
                  const iconUrl = acfImageUrl(item.contact_info_icon);
                  const title = resolveAcfContactTitle(link, description);
                  if (!title) return null;

                  const subDescription =
                    description?.trim() && description.trim() !== title ? description.trim() : undefined;
                  const rawHref = acfLinkHref(link);
                  const isPhone = isPhoneNumber(title) || rawHref.startsWith("tel:");
                  const isLocation = isLocationContactText(title) || isLocationContactText(subDescription);
                  const isHours = isHoursContactText(title, subDescription);
                  const displayTitle = isPhone ? CONTACT_NUMBER : title;
                  const href = isPhone ? telHref(CONTACT_NUMBER) : rawHref;
                  const isEmail = href.startsWith("mailto:");
                  const isClickable =
                    !isLocation &&
                    !isHours &&
                    (isPhone || isEmail || (Boolean(link?.url) && href !== "#" && !href.startsWith("http://+")));
                  const hourLines = isHours ? splitHoursLines(subDescription ?? title) : [];

                  const content = (
                    <div className="flex items-start gap-3">
                      {isPhone || !iconUrl || isLocation ? (
                        <ContactFallbackIcon
                          title={title}
                          description={subDescription}
                          isPhone={isPhone}
                          isLocation={isLocation}
                          isHours={isHours}
                        />
                      ) : (
                        <img src={iconUrl} alt="" className="w-4 h-4 object-contain shrink-0 mt-0.5 brightness-0 saturate-100 invert-[.65] sepia hue-rotate-[350deg]" />
                      )}
                      <div className="min-w-0">
                        <span
                          className={`block text-sm leading-snug ${
                            isHours ? "text-[#F97316] font-semibold" : "text-white"
                          }`}
                        >
                          {displayTitle}
                        </span>
                        {isHours && hourLines.length > 0 ? (
                          <div className="mt-1 space-y-0.5">
                            {hourLines.map((line, lineIndex) => (
                              <span key={lineIndex} className="block text-sm text-slate-300 leading-relaxed">
                                {line}
                              </span>
                            ))}
                          </div>
                        ) : (
                          subDescription && (
                            <span
                              className={`block text-sm mt-1 leading-relaxed ${
                                isPhone ? "text-slate-400" : isHours ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {subDescription}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <li key={index}>
                      {isClickable ? (
                        <a href={href} className="hover:opacity-90 transition-opacity">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      {showBottomBar && (
        <div className="border-t border-slate-700/60 bg-[#152238]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            {copyright && <p className="text-slate-400 text-xs sm:text-sm">{copyright}</p>}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm">
              {privacyLink?.title && (
                <Link href={acfLegalLinkHref(privacyLink)} className="text-slate-400 hover:text-white transition-colors">
                  {privacyLink.title}
                </Link>
              )}
              {termsLink?.title && (
                <Link href={acfLegalLinkHref(termsLink)} className="text-slate-400 hover:text-white transition-colors">
                  {termsLink.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
