import { useEffect, useState } from "react";
import { api, mailto } from "../lib/api";
import type { Campaign, Customer, Prospect, WorkItem } from "../types";

type Bundle = {
  customers: Customer[];
  work: WorkItem[];
  prospects: Prospect[];
  campaigns: Campaign[];
};

export function Customers() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = () => api<Bundle>("/api/admin/customers").then(setBundle);
  useEffect(() => {
    void load();
  }, []);

  if (!bundle) return <p>Loading customers…</p>;
  const active = bundle.customers.find((c) => c.id === activeId) ?? null;
  const nights = bundle.work.filter((w) => w.customerId === activeId);
  const leads = bundle.prospects.filter((p) => p.customerId === activeId);
  const campaigns = bundle.campaigns.filter((c) => c.customerId === activeId);

  return (
    <>
      <header className="studio-head">
        <div>
          <p className="studio-kicker">Accounts</p>
          <h1>Venues that keep coming back.</h1>
        </div>
        <button className="btn btn--ghost" type="button" onClick={() => setAdding(true)}>
          New customer
        </button>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Venue</th>
            <th>Nights</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bundle.customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <strong>{customer.name}</strong>
                <div className="muted">{customer.email}</div>
              </td>
              <td>
                {customer.venue}
                <div className="muted">{customer.city}</div>
              </td>
              <td>{bundle.work.filter((w) => w.customerId === customer.id).length}</td>
              <td>
                <span className={`pill ${customer.status === "active" ? "on" : ""}`}>
                  {customer.status}
                </span>
              </td>
              <td>
                <button className="linkish" type="button" onClick={() => setActiveId(customer.id)}>
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {adding ? (
        <div className="drawer-back" onClick={() => setAdding(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <h2>New customer</h2>
            <form
              className="field-grid"
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
                await api("/api/admin/customers", {
                  method: "POST",
                  body: JSON.stringify(payload),
                });
                setAdding(false);
                await load();
              }}
            >
              <label>
                Name
                <input name="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" />
              </label>
              <label>
                Venue
                <input name="venue" />
              </label>
              <label>
                City
                <input name="city" />
              </label>
              <label className="full">
                Notes
                <textarea name="notes" rows={4} />
              </label>
              <div className="row-actions full">
                <button className="btn btn--hot" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="drawer-back" onClick={() => setActiveId(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <p className="studio-kicker">{active.venue}</p>
            <h2>{active.name}</h2>
            <form
              className="field-grid"
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
                await api(`/api/admin/customers/${active.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(payload),
                });
                await load();
              }}
            >
              <label>
                Name
                <input name="name" defaultValue={active.name} />
              </label>
              <label>
                Email
                <input name="email" defaultValue={active.email} />
              </label>
              <label>
                Phone
                <input name="phone" defaultValue={active.phone} />
              </label>
              <label>
                Venue
                <input name="venue" defaultValue={active.venue} />
              </label>
              <label>
                City
                <input name="city" defaultValue={active.city} />
              </label>
              <label>
                Status
                <select name="status" defaultValue={active.status}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="full">
                Notes
                <textarea name="notes" rows={4} defaultValue={active.notes} />
              </label>
              <div className="row-actions full">
                <button className="btn btn--hot" type="submit">
                  Save account
                </button>
                {active.email ? (
                  <a
                    className="btn btn--ghost"
                    href={mailto(
                      active.email,
                      `Next night at ${active.venue}`,
                      `Want me on the next ${active.venue} night? Send the date and I'll run the same system.`,
                    )}
                  >
                    Repeat-night email
                  </a>
                ) : null}
              </div>
            </form>
            <h3 style={{ margin: "1.2rem 0 0.5rem", fontSize: "1rem" }}>Published nights</h3>
            <ul className="feed">
              {nights.map((w) => (
                <li key={w.id}>
                  {w.title} · {w.date}
                </li>
              ))}
              {nights.length === 0 ? <li className="muted">No published work linked yet.</li> : null}
            </ul>
            <h3 style={{ margin: "1.2rem 0 0.5rem", fontSize: "1rem" }}>Pipeline + campaigns</h3>
            <ul className="feed">
              {leads.map((p) => (
                <li key={p.id}>
                  Brief · {p.stage} · {p.eventDate || "no date"}
                </li>
              ))}
              {campaigns.map((c) => (
                <li key={c.id}>
                  Campaign · {c.name} · {c.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
