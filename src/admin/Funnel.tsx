import { useEffect, useMemo, useState } from "react";
import { api, mailto } from "../lib/api";
import { FUNNEL_STAGES, type Activity, type Customer, type EmailTemplate, type Prospect, type ProspectStage } from "../types";

type Bundle = {
  prospects: Prospect[];
  activities: Activity[];
  templates: EmailTemplate[];
  customers: Customer[];
};

export function Funnel() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = () => api<Bundle>("/api/admin/prospects").then(setBundle);

  useEffect(() => {
    void load();
  }, []);

  const active = bundle?.prospects.find((p) => p.id === activeId) ?? null;

  const onDrop = async (stage: ProspectStage, prospectId: string) => {
    await api(`/api/admin/prospects/${prospectId}`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    });
    await load();
  };

  if (!bundle) return <p>Loading funnel…</p>;

  return (
    <>
      <header className="studio-head">
        <div>
          <p className="studio-kicker">Prospects</p>
          <h1>Book a night → packed room.</h1>
        </div>
        <button className="btn btn--ghost" type="button" onClick={() => setAdding(true)}>
          Add lead
        </button>
      </header>
      <div className="board">
        {FUNNEL_STAGES.map((col) => {
          const cards = bundle.prospects.filter((p) => p.stage === col.id);
          return (
            <section
              key={col.id}
              className="col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const prospectId = e.dataTransfer.getData("text/plain");
                if (prospectId) void onDrop(col.id, prospectId);
              }}
            >
              <header>
                <h2 title={col.hint}>{col.label}</h2>
                <span>{cards.length}</span>
              </header>
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className="card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", card.id)}
                  onClick={() => setActiveId(card.id)}
                >
                  <strong>{card.name}</strong>
                  <em>
                    {card.venue}
                    {card.eventDate ? ` · ${card.eventDate}` : ""}
                  </em>
                  <div className="muted">{card.need}</div>
                </button>
              ))}
            </section>
          );
        })}
      </div>

      {adding ? (
        <LeadForm
          onClose={() => setAdding(false)}
          onSave={async (payload) => {
            await api("/api/admin/prospects", {
              method: "POST",
              body: JSON.stringify(payload),
            });
            setAdding(false);
            await load();
          }}
        />
      ) : null}

      {active ? (
        <ProspectDrawer
          prospect={active}
          activities={bundle.activities.filter((a) => a.prospectId === active.id)}
          templates={bundle.templates}
          onClose={() => setActiveId(null)}
          onChange={async (patch) => {
            await api(`/api/admin/prospects/${active.id}`, {
              method: "PATCH",
              body: JSON.stringify(patch),
            });
            await load();
          }}
          onNote={async (body) => {
            await api(`/api/admin/prospects/${active.id}/note`, {
              method: "POST",
              body: JSON.stringify({ body }),
            });
            await load();
          }}
          onMail={async (templateId) => {
            const result = await api<{ mail: { to: string; subject: string; body: string } }>(
              `/api/admin/prospects/${active.id}/email`,
              { method: "POST", body: JSON.stringify({ templateId }) },
            );
            window.location.href = mailto(result.mail.to, result.mail.subject, result.mail.body);
            await load();
          }}
          onCampaign={async () => {
            await api("/api/admin/campaigns", {
              method: "POST",
              body: JSON.stringify({
                name: `${active.venue} drop`,
                eventDate: active.eventDate,
                prospectId: active.id,
                customerId: active.customerId,
                headline: `${active.venue} — ${active.eventDate || "TBD"}`,
                caption: active.message,
                status: "draft",
              }),
            });
            window.location.href = "/admin/marketing";
          }}
        />
      ) : null}
    </>
  );
}

function LeadForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: Record<string, string>) => Promise<void>;
}) {
  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <p className="studio-kicker">Manual lead</p>
        <h2>Add a prospect</h2>
        <form
          className="field-grid"
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget).entries());
            void onSave(data as Record<string, string>);
          }}
        >
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Venue
            <input name="venue" required />
          </label>
          <label>
            Event date
            <input name="eventDate" />
          </label>
          <label className="full">
            Need
            <input name="need" defaultValue="Club / bar flyer" />
          </label>
          <label className="full">
            Notes
            <textarea name="message" rows={4} />
          </label>
          <div className="row-actions full">
            <button className="btn btn--hot" type="submit">
              Save lead
            </button>
            <button className="btn btn--ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProspectDrawer({
  prospect,
  activities,
  templates,
  onClose,
  onChange,
  onNote,
  onMail,
  onCampaign,
}: {
  prospect: Prospect;
  activities: Activity[];
  templates: EmailTemplate[];
  onClose: () => void;
  onChange: (patch: Partial<Prospect>) => Promise<void>;
  onNote: (body: string) => Promise<void>;
  onMail: (templateId: string) => Promise<void>;
  onCampaign: () => Promise<void>;
}) {
  const stageTemplate = useMemo(
    () => templates.find((t) => t.stage === prospect.stage) ?? templates[0],
    [templates, prospect.stage],
  );

  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <p className="studio-kicker">{prospect.source === "book-a-night" ? "Book a night" : "Manual"}</p>
        <h2>{prospect.name}</h2>
        <p className="muted">{prospect.message}</p>
        <form
          className="field-grid"
          style={{ marginTop: "1rem" }}
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            void onChange({
              name: String(form.get("name")),
              email: String(form.get("email")),
              phone: String(form.get("phone")),
              venue: String(form.get("venue")),
              eventDate: String(form.get("eventDate")),
              need: String(form.get("need")),
              stage: String(form.get("stage")) as ProspectStage,
            });
          }}
        >
          <label>
            Name
            <input name="name" defaultValue={prospect.name} />
          </label>
          <label>
            Email
            <input name="email" defaultValue={prospect.email} />
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={prospect.phone} />
          </label>
          <label>
            Venue
            <input name="venue" defaultValue={prospect.venue} />
          </label>
          <label>
            Event date
            <input name="eventDate" defaultValue={prospect.eventDate} />
          </label>
          <label>
            Need
            <input name="need" defaultValue={prospect.need} />
          </label>
          <label className="full">
            Stage
            <select name="stage" defaultValue={prospect.stage}>
              {FUNNEL_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="row-actions full">
            <button className="btn btn--hot" type="submit">
              Save
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => void onCampaign()}>
              Build campaign
            </button>
          </div>
        </form>

        <h3 style={{ margin: "1.2rem 0 0.5rem", fontSize: "1rem" }}>Execute follow-up</h3>
        <p className="muted">
          Opens a ready email for this stage. Logging it moves the paper trail.
        </p>
        <div className="row-actions">
          {stageTemplate ? (
            <button className="btn btn--hot" type="button" onClick={() => void onMail(stageTemplate.id)}>
              Send “{stageTemplate.name}”
            </button>
          ) : null}
        </div>

        <h3 style={{ margin: "1.2rem 0 0.5rem", fontSize: "1rem" }}>Notes</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("note") as HTMLTextAreaElement;
            void onNote(input.value).then(() => {
              input.value = "";
            });
          }}
        >
          <textarea name="note" rows={3} placeholder="Call, Instagram DM, door numbers…" />
          <div className="row-actions">
            <button className="btn btn--ghost" type="submit">
              Add note
            </button>
          </div>
        </form>
        <ul className="feed">
          {activities.map((a) => (
            <li key={a.id}>
              {a.body}
              <time>{new Date(a.at).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
