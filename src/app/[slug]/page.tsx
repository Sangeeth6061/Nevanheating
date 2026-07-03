import { notFound, redirect } from "next/navigation";
import { fetchPageBySlug } from "@/lib/wordpress";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "home") {
    redirect("/");
  }

  const page = await fetchPageBySlug(slug) as {
    title?: { rendered?: string };
    content?: { rendered?: string };
  } | null;

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16 lg:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] mb-8 font-heading">
        {page.title?.rendered}
      </h1>
      {page.content?.rendered ? (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      ) : (
        <p className="text-slate-500">Content coming soon.</p>
      )}
    </div>
  );
}
