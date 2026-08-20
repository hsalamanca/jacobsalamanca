import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Activity, Prospect } from "../types";

type Overview = {
  prospects: number;
  open: number;
  newLeads: number;
  customers: number;
  publishedWork: number;
  liveCampaigns: number;
  recent: Activity[];
  inbox: Prospect[];
};

export function Overview() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    api<Overview>("/api/admin/overview").then(setData);
  }, []);

  if (!data) return <p>Loading desk…</p>;

  return (
    <>
      <header className="studio-head">
        <div>
          <p className="studio-kicker">Tonight’s desk</p>
          <h1>Run the room from here.</h1>
        </div>
        <Link className="btn btn--hot" to="/admin/funnel">
          Open funnel
        </Link>
      </header>
      <div className="studio-grid">
        <article className="stat">
          <span className="muted">New briefs</span>
          <b>{data.newLeads}</b>
        </article>
        <article className="stat">
          <span className="muted">Open pipeline</span>
          <b>{data.open}</b>
        </article>
        <article className="stat">
          <span className="muted">Customers</span>
          <b>{data.customers}</b>
        </article>
        <article className="stat">
          <span className="muted">Live campaigns</span>
          <b>{data.liveCampaigns}</b>
        </article>
      </div>
      <div className="studio-split">
        <section className="panel">
          <h2>Inbox · Book a night</h2>
          {data.inbox.length === 0 ? (
            <p className="muted">No new briefs. They land here the moment the form is sent.</p>
          ) : (
            <ul className="feed">
              {data.inbox.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> · {p.venue} · {p.need}
                  <time>{new Date(p.createdAt).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel">
          <h2>Activity</h2>
          <ul className="feed">
            {data.recent.map((a) => (
              <li key={a.id}>
                {a.body}
                <time>{new Date(a.at).toLocaleString()}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
