import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      {projects.map((project, idx) => (
        <ProjectCard key={idx} {...project} />
      ))}
    </section>
  );
}