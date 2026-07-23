import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy `/service/:slug` URLs → `/services/:slug` sub-pages */
export default async function LegacyServiceRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/services/${slug}`);
}
