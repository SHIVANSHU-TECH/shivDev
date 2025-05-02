import SkillTag from "@/Components/SkillTag";
import { skills } from "@/data/skills";

export default function SkillsPage() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
      <div className="flex flex-wrap">
        {skills.map((skill, idx) => (
          <SkillTag key={idx} skill={skill} />
        ))}
      </div>
    </section>
  );
}