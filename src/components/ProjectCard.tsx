interface ProjectCardProps {
    title: string;
    description: string;
  }
  
  export default function ProjectCard({ title, description }: ProjectCardProps) {
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="font-bold text-xl">{title}</h3>
        <p>{description}</p>
      </div>
    );
  }