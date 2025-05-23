import "./landing.scss";

export type Persona = "prospect" | "lead" | "candidate";

export default function LandingPage({ onSelect }: { onSelect: (p: Persona) => void }) {
  return (
    <div className="landing-page">
      <h1>Select a Persona</h1>
      <div className="persona-options">
        <button className="persona-button" onClick={() => onSelect("prospect")}>Prospect</button>
        <button className="persona-button" onClick={() => onSelect("lead")}>Lead</button>
        <button className="persona-button" onClick={() => onSelect("candidate")}>Candidate</button>
      </div>
    </div>
  );
}
