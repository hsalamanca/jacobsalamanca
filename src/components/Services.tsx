import { services } from "../data/site";

export function Services() {
  return (
    <section className="section services" id="services">
      <header className="section__head">
        <p className="eyebrow">What I make</p>
        <h2>Marketing for rooms that live or die on a Friday.</h2>
        <p className="section__intro">
          Clubs and bars don't need a brand film. They need a flyer that gets
          screenshot in a group chat, a story sequence that sells tables, and a
          look people recognize before they read the name.
        </p>
      </header>
      <ol className="services__list">
        {services.map((s) => (
          <li key={s.num}>
            <span>{s.num}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
