export function SectionHeading({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="section-heading">
      <div className="section-icon">{icon}</div>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}