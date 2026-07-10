import type { AboutTeamMember } from "@/lib/about-team";

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-[515px] flex flex-col items-center justify-center">
        {(subHeading || heading) && (
          <div className="text-center mb-6">
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
          <div className="flex flex-wrap justify-center items-start gap-y-10 gap-x-8 lg:gap-x-[140px]">
            {members.map((member) => (
              <article key={member.id} className="flex flex-col items-center text-center">
                {member.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={member.imageUrl}
                      alt={member.name || "Team member"}
                      width={130}
                      height={130}
                      className="size-[130px] aspect-square object-cover rounded-2xl"
                    />
                  </div>
                )}
                {member.name && (
                  <h3 className="text-[16px] font-bold text-[#1E293B] leading-snug mb-1 font-heading">
                    {member.name}
                  </h3>
                )}
                {member.designation && (
                  <p className="text-[#64748B] text-[14px] mb-3">{member.designation}</p>
                )}
                {member.qualification && (
                  <span className="inline-flex items-center justify-center rounded-full bg-[#eef2f6] text-[#2a3f5c] text-[12px] font-medium px-4 py-1.5">
                    {member.qualification}
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
