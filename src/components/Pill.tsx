export function Pill({ children, teal = false }: { children: React.ReactNode; teal?: boolean }) {
  return <span className={`pill ${teal ? "pill-teal" : ""}`}>{children}</span>;
}