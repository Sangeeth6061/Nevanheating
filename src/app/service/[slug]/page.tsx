import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchServiceBySlug } from "@/lib/wordpress";
import { wpUrlToPath } from "@/lib/wp-utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug) as {
    title?: { rendered?: string };
    acf?: Record<string, unknown>;
  } | null;

  if (!service) {
    notFound();
  }

  const acf = service.acf ?? {};
  const icon = acf.icon as { url?: string } | undefined;
  const heading = (acf.heading as string | undefined) || service.title?.rendered;
  const description = acf.description as string | undefined;
  const bulletPoints = acf.bullet_points as Array<{ point?: string }> | undefined;
  const buttonText = acf.button as string | undefined;
  const buttonLink = wpUrlToPath((acf.button_link as { url?: string } | undefined)?.url);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-24">
      <div className="max-w-3xl">
        {icon?.url && (
          <img src={icon.url} alt="" className="w-14 h-14 object-contain mb-6" />
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-6 font-heading">
          {heading}
        </h1>
        {description && (
          <p className="text-slate-600 text-lg leading-relaxed mb-8">{description}</p>
        )}
        {bulletPoints && bulletPoints.length > 0 && (
          <ul className="space-y-3 mb-10">
            {bulletPoints.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-[#1e3a8a]">
                <span className="text-[#2563EB] font-bold">✓</span>
                <span>{item.point}</span>
              </li>
            ))}
          </ul>
        )}
        {buttonText && (
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
