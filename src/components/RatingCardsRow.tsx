import type { RatingCard } from "@/lib/rating-cards";

type RatingCardsRowProps = {
  cards: RatingCard[];
};

function RatingStars({ filledStars, starIconUrl }: { filledStars: number; starIconUrl?: string }) {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < filledStars;

        if (starIconUrl) {
          return (
            <img
              key={index}
              src={starIconUrl}
              alt=""
              className={[
                "w-4 h-4 object-contain",
                isFilled ? "opacity-100" : "opacity-25 grayscale",
              ].join(" ")}
            />
          );
        }

        return (
          <span
            key={index}
            className={[
              "text-sm leading-none",
              isFilled ? "text-[#FBBF24]" : "text-slate-300",
            ].join(" ")}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function RatingCardsRow({ cards }: RatingCardsRowProps) {
  if (cards.length === 0) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-[100px]">
      <div className="flex flex-wrap justify-center gap-[25px]">
        {cards.map((card) => (
          <article
            key={card.id}
            className="w-[240px] h-[150px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-slate-100 px-4 py-4 text-center flex flex-col items-center justify-center"
          >
            <RatingStars filledStars={card.filledStars} starIconUrl={card.starIconUrl} />

            {card.rating && (
              <p className="text-2xl font-bold text-[#1E293B] leading-none mb-1 font-heading">
                {card.rating}
              </p>
            )}

            {card.source && (
              <p className="text-sm font-bold text-[#1E293B] mb-0.5 font-heading leading-tight">
                {card.source}
              </p>
            )}

            {card.reviewsCount && (
              <p className="text-xs text-[#64748B] leading-tight">{card.reviewsCount}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
