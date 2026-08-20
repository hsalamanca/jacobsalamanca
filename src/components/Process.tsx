import { processSteps } from "../data/site";

export function Process() {
  return (
    <section className="section process" id="process">
      <header className="section__head">
        <p className="eyebrow">How a night gets designed</p>
        <h2>From “we need a flyer by Thursday” to a full drop.</h2>
      </header>
      <ol className="process__grid">
        {processSteps.map((step) => (
          <li key={step.num}>
            <span>{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
