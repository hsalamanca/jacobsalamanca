import { useEffect, useMemo, useState } from "react";
import { posters } from "./Posters";
import { type Category, type WorkItem, work } from "../data/site";

const filters: Category[] = ["All", "Club", "Bar", "Campaign"];

export function Work() {
  const [filter, setFilter] = useState<Category>("All");
  const [active, setActive] = useState<WorkItem | null>(null);

  const items = useMemo(
    () => (filter === "All" ? work : work.filter((w) => w.category === filter)),
    [filter],
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section className="section work" id="work">
      <header className="section__head">
        <p className="eyebrow">Selected nights</p>
        <h2>Work that was built to get shared — and then show up.</h2>
      </header>
      <div className="filters" role="tablist" aria-label="Filter work">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? "is-on" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="work__grid">
        {items.map((item) => {
          const Poster = posters[item.id as keyof typeof posters];
          return (
            <button
              key={item.id}
              type="button"
              className="work__tile"
              onClick={() => setActive(item)}
            >
              <Poster />
              <span className="work__meta">
                <strong>{item.title}</strong>
                <em>
                  {item.venue} · {item.category}
                </em>
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
          onClick={() => setActive(null)}
        >
          <div className="lightbox__panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox__close"
              type="button"
              onClick={() => setActive(null)}
            >
              Close
            </button>
            <div className="lightbox__poster">
              {(() => {
                const Poster = posters[active.id as keyof typeof posters];
                return <Poster />;
              })()}
            </div>
            <div className="lightbox__copy">
              <p className="eyebrow">
                {active.venue} · {active.city} · {active.date}
              </p>
              <h3 id="case-title">{active.title}</h3>
              <p>{active.brief}</p>
              <h4>Campaign drop</h4>
              <ul>
                {active.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="lightbox__result">{active.result}</p>
              <a className="btn btn--hot" href="#book" onClick={() => setActive(null)}>
                I need this for my night
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
