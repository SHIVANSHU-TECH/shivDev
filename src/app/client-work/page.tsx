import ProjectCard from "@/Components/ProjectCard";
import { clientWork } from "@/data/clientWork";

export default function ClientWorkPage() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Client Work</h2>
      {clientWork.map((work, idx) => (
        <ProjectCard key={idx} {...work} />
      ))}
    </section>
  );
}