/** Sub-service landings must not be statically cached (layout + CTA depend on request). */
export const dynamic = "force-dynamic";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
