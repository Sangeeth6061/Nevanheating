import { NextResponse } from "next/server";
import { pageSlugFromPathname, resolveCtaBannerForPageSlug } from "@/lib/resolve-cta-banner";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slug")?.trim();
  const pathParam = searchParams.get("path")?.trim();

  const pageSlug =
    slugParam ||
    (pathParam ? pageSlugFromPathname(pathParam.startsWith("/") ? pathParam : `/${pathParam}`) : "home");

  try {
    const data = await resolveCtaBannerForPageSlug(pageSlug);
    return NextResponse.json(data ?? {});
  } catch (error) {
    console.error("GET /api/cta-banner:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
