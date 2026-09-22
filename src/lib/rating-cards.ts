import type { GoogleRatingSummary } from "@/lib/google-reviews";

export type RatingCard = {
  id: string;
  filledStars: number;
  starIconUrl?: string;
  rating: string;
  source: string;
  reviewsCount: string;
};

function acfStr(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function getFilledStarCount(rateTheStar: unknown): number {
  const value = Number(typeof rateTheStar === "string" ? rateTheStar.trim() : rateTheStar);
  if (!Number.isFinite(value)) return 0;
  return Math.min(5, Math.max(0, Math.round(value / 20)));
}

export function parseRatingCards(
  acf?: Record<string, unknown> | null,
  googleSummary?: GoogleRatingSummary | null
): RatingCard[] {
  const items = acf?.add_a_rating_card;
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): RatingCard | null => {
      const row = item as Record<string, unknown>;
      const rating = acfStr(row.rating_);
      const source = acfStr(row.rating_sourse);
      const reviewsCount = acfStr(row.reviews_count);
      const starIcon = row.rating_stars as { url?: string } | undefined;

      if (!rating && !source && !reviewsCount) return null;

      // Keep the Google card in sync with the live rating from the Google Reviews plugin.
      if (googleSummary && source?.toLowerCase().includes("google")) {
        return {
          id: `rating-card-${index}`,
          filledStars: Math.round(Number(googleSummary.rating)),
          starIconUrl: starIcon?.url,
          rating: googleSummary.rating,
          source,
          reviewsCount: `${googleSummary.total} review${googleSummary.total === 1 ? "" : "s"}`,
        };
      }

      return {
        id: `rating-card-${index}`,
        filledStars: getFilledStarCount(row.rate_the_star),
        starIconUrl: starIcon?.url,
        rating: rating ?? "",
        source: source ?? "",
        reviewsCount: reviewsCount ?? "",
      };
    })
    .filter((card): card is RatingCard => card !== null);
}
