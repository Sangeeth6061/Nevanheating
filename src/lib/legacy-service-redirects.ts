/** Old Services page repeater slugs → sub-service landing URLs. */
export const LEGACY_SERVICE_SECTION_REDIRECTS: Record<string, string> = {
  "boiler-installation": "/services/expert-boiler-installation-repairs-servicing",
  "central-heating": "/services/complete-central-underfloor-heating-solutions",
  "emergency-plumbing": "/services/all-kind-of-plumbing-repairs",
  "bathroom-fitting": "/services/all-kind-of-plumbing-repairs",
  "gas-safety-checks": "/services/certified-gas-services-safety-inspections",
  "unvented-cylinders": "/services/high-pressure-hot-water-cylinder-specialists",
};

export function getLegacyServiceSectionRedirect(sectionAnchor: string): string | null {
  return LEGACY_SERVICE_SECTION_REDIRECTS[sectionAnchor] ?? null;
}

export function resolveServiceSubpageHref(sectionAnchor: string): string {
  return getLegacyServiceSectionRedirect(sectionAnchor) ?? `/services/${sectionAnchor}`;
}
