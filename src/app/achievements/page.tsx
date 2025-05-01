import { achievements } from "@/data/achievements";

export default function AchievementsPage() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
      <ul className="list-disc pl-6">
        {achievements.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
