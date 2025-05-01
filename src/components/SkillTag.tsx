interface SkillTagProps {
    skill: string;
  }
  
  export default function SkillTag({ skill }: SkillTagProps) {
    return <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded m-1 inline-block">{skill}</span>;
  }
  

  