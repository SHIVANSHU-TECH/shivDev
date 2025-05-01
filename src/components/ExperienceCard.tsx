interface ExperienceCardProps {
    company: string;
    role: string;
    duration: string;
  }
  
  export default function ExperienceCard({ company, role, duration }: ExperienceCardProps) {
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="font-semibold">{role} @ {company}</h3>
        <p>{duration}</p>
      </div>
    );
  }