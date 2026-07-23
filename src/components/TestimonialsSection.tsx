import { fetchHomePage } from "@/lib/wordpress";
import { parseRatingCards } from "@/lib/rating-cards";
import { parseTestimonials } from "@/lib/testimonials";
import RatingCardsRow from "@/components/RatingCardsRow";
import TestimonialsPageCarousel from "@/components/TestimonialsPageCarousel";

type TestimonialsSectionProps = {
  acf?: Record<string, unknown>;
};

export default async function TestimonialsSection({ acf }: TestimonialsSectionProps) {
  const homePages = await fetchHomePage();
  const homeAcf = (homePages?.[0] as { acf?: Record<string, unknown> } | undefined)?.acf;
  const ratingCards = parseRatingCards(acf);
  const testimonials = parseTestimonials(
    homeAcf?.["4th_sectioon_testimonials"] as unknown[] | undefined
  );

  if (ratingCards.length === 0 && testimonials.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <RatingCardsRow cards={ratingCards} />

      {testimonials.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-14 md:pt-16 lg:pt-20 pb-14 md:pb-16 lg:pb-20">
          <TestimonialsPageCarousel testimonials={testimonials} />
        </div>
      )}
    </section>
  );
}
