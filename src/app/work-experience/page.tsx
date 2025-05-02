import ExperienceCard from "@/Components/ExperienceCard";
import { experiences } from "@/data/experiences";

export default function WorkExperiencePage() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
      {experiences.map((exp, idx) => (
        <ExperienceCard key={idx} {...exp} />
      ))}
    </section>
  );
}