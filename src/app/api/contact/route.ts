import { NextResponse } from "next/server";
import type { ContactFormData } from "@/lib/contact";

const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");

export async function POST(request: Request) {
  if (!WP_BASE) {
    return NextResponse.json({ error: "WordPress URL is not configured." }, { status: 500 });
  }

  let body: ContactFormData;

  try {
    body = (await request.json()) as ContactFormData;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${WP_BASE}/wp-json/nevan/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json()) as {
      message?: string;
      code?: string;
      data?: { message?: string };
    };

    if (!response.ok) {
      const message =
        data.message || data.data?.message || "Unable to send your message. Please try again.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the contact form service. Please try again later." },
      { status: 502 }
    );
  }
}
