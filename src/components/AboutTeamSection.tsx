import type { AboutTeamMember } from "@/lib/about-team";
import AboutTeamCarousel from "@/components/AboutTeamCarousel";
import AboutTeamMemberCard from "@/components/AboutTeamMemberCard";

type AboutTeamSectionProps = {
  subHeading?: string;
  heading?: string;
  members: AboutTeamMember[];
};

export default function AboutTeamSection({
  subHeading,
  heading,
  members,
}: AboutTeamSectionProps) {
  if (!heading && !subHeading && members.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 min-h-[515px] lg:h-[515px] flex flex-col items-center justify-start pt-16 pb-10 sm:justify-center sm:pt-0 sm:pb-0">
        {(subHeading || heading) && (
          <div className="text-center mb-6 shrink-0">
            {subHeading && (
              <span className="text-sm font-bold uppercase tracking-wider text-[#2563EB] mb-3 block">
                {subHeading}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#1E293B] tracking-tight font-heading">
                {heading}
              </h2>
            )}
          </div>
        )}

        {members.length > 0 && (
          <>
            <div className="w-full md:hidden">
              <AboutTeamCarousel members={members} />
            </div>

            <div className="hidden md:flex flex-wrap justify-center items-start gap-y-10 gap-x-8 lg:gap-x-[140px]">
              {members.map((member) => (
                <article key={member.id} className="flex flex-col items-center text-center">
                  <AboutTeamMemberCard member={member} />
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
