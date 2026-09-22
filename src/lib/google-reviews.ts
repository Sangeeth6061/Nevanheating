import type { TestimonialItem } from "@/lib/testimonials";

const WP_BASE = (
  process.env.WORDPRESS_URL ??
  process.env.NEXT_PUBLIC_WORDPRESS_URL ??
  ""
).replace(/\/$/, "");

export type GoogleReview = {
  id: string;
  author: string;
  author_photo?: string;
  author_url?: string;
  rating: number;
  text: string;
  time: string;
  relative_time?: string;
};

export type GoogleReviewsData = {
  place: {
    name?: string;
    rating?: number | null;
    total?: number | null;
    url?: string;
  };
  reviews: GoogleReview[];
};

/** Reviews synced by the "Nevan Google Reviews" WordPress plugin. */
export async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  if (!WP_BASE) return null;

  try {
    const res = await fetch(`${WP_BASE}/wp-json/nevan/v1/google-reviews`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Partial<GoogleReviewsData>;
    return {
      place: data.place ?? {},
      reviews: Array.isArray(data.reviews) ? data.reviews : [],
    };
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return null;
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0]?.[0]];
  return letters.filter(Boolean).join("").toUpperCase();
}

export function googleReviewsToTestimonials(reviews: GoogleReview[]): TestimonialItem[] {
  return reviews.map((review) => ({
    id: `google-review-${review.id}`,
    starUrls: [],
    rating: review.rating,
    message: review.text,
    initials: initialsFromName(review.author),
    fullName: review.author,
    location: review.relative_time ? `Google review · ${review.relative_time}` : "Google review",
  }));
}

export type GoogleRatingSummary = {
  rating: string;
  total: number;
  url?: string;
};

export function googleRatingSummary(data: GoogleReviewsData | null): GoogleRatingSummary | null {
  const rating = data?.place.rating;
  const total = data?.place.total;
  if (typeof rating !== "number" || typeof total !== "number") return null;

  return { rating: rating.toFixed(1), total, url: data?.place.url || undefined };
}
