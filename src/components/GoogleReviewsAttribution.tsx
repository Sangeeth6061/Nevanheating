import type { GoogleRatingSummary } from "@/lib/google-reviews";

type GoogleReviewsAttributionProps = {
  summary: GoogleRatingSummary | null;
};

/** Google requires review content to be attributed; also links to the full profile. */
export default function GoogleReviewsAttribution({ summary }: GoogleReviewsAttributionProps) {
  if (!summary) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-[#64748B]">
      <span className="font-bold text-[#1E293B]">{summary.rating}</span>
      <span className="text-[#FBBF24] leading-none" aria-hidden="true">
        ★★★★★
      </span>
      <span>
        from {summary.total} Google review{summary.total === 1 ? "" : "s"}
      </span>
      {summary.url && (
        <>
          <span aria-hidden="true">·</span>
          <a
            href={summary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
          >
            Read all reviews on Google
          </a>
        </>
      )}
    </div>
  );
}
