import { useEffect, useMemo, useState } from "react";
import { WorkPoster } from "./Posters";
import { work as fallbackWork } from "../data/site";
import type { Category, WorkItem } from "../types";

const filters: Category[] = ["All", "Club", "Bar", "Campaign"];

export function Work() {
  const [filter, setFilter] = useState<Category>("All");
  const [active, setActive] = useState<WorkItem | null>(null);
  const [work, setWork] = useState<WorkItem[]>(
    fallbackWork.map((item, index) => ({
      ...item,
      posterStyle: item.id as WorkItem["posterStyle"],
      published: true,
      sortOrder: index,
    })),
  );

  useEffect(() => {
    fetch("/api/work")
      .then((r) => r.json())
      .then((d: { work?: WorkItem[] }) => {
        if (Array.isArray(d.work) && d.work.length) setWork(d.work);
      })
      .catch(() => undefined);
  }, []);

  const items = useMemo(
    () => (filter === "All" ? work : work.filter((w) => w.category === filter)),
    [filter, work],
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
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="work__tile"
            onClick={() => setActive(item)}
          >
            <span className="paper work__poster">
              <WorkPoster item={item} />
            </span>
            <span className="work__meta">
              <strong>{item.title}</strong>
              <em>
                {item.venue} · {item.category}
              </em>
            </span>
          </button>
        ))}
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
            <div className="paper lightbox__paper">
              <WorkPoster item={active} />
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
              <a className="btn btn--ticket" href="#book" onClick={() => setActive(null)}>
                I need this for my night
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
