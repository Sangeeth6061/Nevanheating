import type { AboutTeamMember } from "@/lib/about-team";

type AboutTeamMemberCardProps = {
  member: AboutTeamMember;
};

export default function AboutTeamMemberCard({ member }: AboutTeamMemberCardProps) {
  return (
    <>
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
    </>
  );
}
