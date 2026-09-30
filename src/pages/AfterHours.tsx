import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const lineup = [
  { slot: "01", name: "Kira Völ", room: "Main room" },
  { slot: "02", name: "Nate Cross", room: "Main room" },
  { slot: "03", name: "Sleeve", room: "Room 2" },
];

export function AfterHoursPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previous = document.title;
    document.title = "After / Hours — Warehouse 12";
    return () => {
      document.title = previous;
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const plus = String(data.get("plus") ?? "").trim();
    try {
      await api("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name,
          email: data.get("email"),
          venue: "Warehouse 12",
          date: "Sat 08.15",
          need: "After / Hours guest list",
          message: `Guest list for After / Hours. ${plus ? `Plus: ${plus}.` : "Just me."}`,
        }),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add you to the list.");
    }
  };

  return (
    <div className="after-page">
      <header className="after-bar">
        <Link to="/">Salamnca Graphx</Link>
        <span>Warehouse 12 · Downtown</span>
        <a href="#list">Guest list</a>
      </header>

      <section className="after-hero">
        <div className="after-hero__stripe" aria-hidden="true" />
        <p className="after-kicker">Techno · No photos after 2</p>
        <h1>
          After
          <span>/</span>
          Hours
        </h1>
        <p className="after-time">04:00</p>
        <p className="after-foot">Sat 08.15 · Doors 01:00 · Warehouse 12</p>
      </section>

      <section className="after-lineup" aria-label="Lineup">
        {lineup.map((act) => (
          <article key={act.slot}>
            <span>{act.slot}</span>
            <h2>{act.name}</h2>
            <p>{act.room}</p>
          </article>
        ))}
      </section>

      <section className="after-note">
        <p>
          A 4AM warehouse series. Industrial, loud, and built to be recognized
          on a telephone pole before you read the name.
        </p>
        <ul>
          <li>A3 street poster</li>
          <li>Story set</li>
          <li>Feed square</li>
          <li>Door signage</li>
        </ul>
      </section>

      <section className="after-list" id="list">
        <div>
          <p className="after-kicker">Name at the door</p>
          <h2>Guest list</h2>
          <p>Closes at 1:40am. Dress for a dark room.</p>
        </div>
        {sent ? (
          <p className="after-thanks">You’re on the list. See you after 1.</p>
        ) : (
          <form onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Plus
              <input name="plus" placeholder="Optional" />
            </label>
            {error ? <p className="after-error">{error}</p> : null}
            <button type="submit">Get on the list</button>
          </form>
        )}
      </section>

      <footer className="after-end">
        <p>Sold out by 1:40am. Now a monthly series.</p>
        <Link to="/">Designed by Salamnca Graphx</Link>
      </footer>
    </div>
  );
}
