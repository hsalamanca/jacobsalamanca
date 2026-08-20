import { useEffect, useState } from "react";
import { api, copyText } from "../lib/api";
import type { Campaign, CampaignChannel, Customer, EmailTemplate, Prospect, WorkItem } from "../types";

type Bundle = {
  campaigns: Campaign[];
  templates: EmailTemplate[];
  work: WorkItem[];
  prospects: Prospect[];
  customers: Customer[];
};

export function Marketing() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<"campaigns" | "templates">("campaigns");

  const load = () => api<Bundle>("/api/admin/marketing").then(setBundle);
  useEffect(() => {
    void load();
  }, []);

  if (!bundle) return <p>Loading marketing…</p>;
  const active = bundle.campaigns.find((c) => c.id === activeId) ?? bundle.campaigns[0] ?? null;

  return (
    <>
      <header className="studio-head">
        <div>
          <p className="studio-kicker">Execute</p>
          <h1>Campaign drops you can actually run.</h1>
        </div>
        <div className="row-actions">
          <button
            className={`btn ${tab === "campaigns" ? "btn--hot" : "btn--ghost"}`}
            type="button"
            onClick={() => setTab("campaigns")}
          >
            Campaigns
          </button>
          <button
            className={`btn ${tab === "templates" ? "btn--hot" : "btn--ghost"}`}
            type="button"
            onClick={() => setTab("templates")}
          >
            Follow-up copy
          </button>
        </div>
      </header>

      {tab === "templates" ? (
        <TemplateList templates={bundle.templates} onSave={load} />
      ) : (
        <div className="studio-split">
          <section>
            <div className="row-actions">
              <button
                className="btn btn--hot"
                type="button"
                onClick={async () => {
                  const created = await api<{ campaign: Campaign }>("/api/admin/campaigns", {
                    method: "POST",
                    body: JSON.stringify({ name: "New night drop", status: "draft" }),
                  });
                  setActiveId(created.campaign.id);
                  await load();
                }}
              >
                New campaign
              </button>
            </div>
            {bundle.campaigns.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                className="card"
                onClick={() => setActiveId(campaign.id)}
              >
                <strong>{campaign.name}</strong>
                <em>
                  {campaign.status} · {campaign.eventDate || "no date"}
                </em>
                <div className="muted">
                  {campaign.channels.filter((ch) => ch.done).length}/{campaign.channels.length} channels posted
                </div>
              </button>
            ))}
          </section>
          {active ? (
            <CampaignEditor
              key={active.id}
              campaign={active}
              work={bundle.work}
              prospects={bundle.prospects}
              customers={bundle.customers}
              onSave={async (payload) => {
                await api(`/api/admin/campaigns/${active.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(payload),
                });
                await load();
              }}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

function CampaignEditor({
  campaign,
  work,
  prospects,
  customers,
  onSave,
}: {
  campaign: Campaign;
  work: WorkItem[];
  prospects: Prospect[];
  customers: Customer[];
  onSave: (payload: Partial<Campaign>) => Promise<void>;
}) {
  const [channels, setChannels] = useState<CampaignChannel[]>(campaign.channels);

  const toggle = (id: string) => {
    setChannels((list) => list.map((ch) => (ch.id === id ? { ...ch, done: !ch.done } : ch)));
  };

  const pack = () =>
    [
      campaign.headline,
      campaign.caption,
      campaign.cta,
      ...channels.map((ch) => `${ch.label}: ${ch.copy}`),
    ].join("\n\n");

  return (
    <form
      className="panel field-grid"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        void onSave({
          name: String(form.get("name")),
          status: String(form.get("status")) as Campaign["status"],
          eventDate: String(form.get("eventDate")),
          headline: String(form.get("headline")),
          caption: String(form.get("caption")),
          cta: String(form.get("cta")),
          workId: String(form.get("workId") || "") || undefined,
          prospectId: String(form.get("prospectId") || "") || undefined,
          customerId: String(form.get("customerId") || "") || undefined,
          channels,
        });
      }}
    >
      <label>
        Name
        <input name="name" defaultValue={campaign.name} />
      </label>
      <label>
        Status
        <select name="status" defaultValue={campaign.status}>
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="live">live</option>
          <option value="done">done</option>
        </select>
      </label>
      <label>
        Event date
        <input name="eventDate" defaultValue={campaign.eventDate} />
      </label>
      <label>
        Linked work
        <select name="workId" defaultValue={campaign.workId ?? ""}>
          <option value="">—</option>
          {work.map((w) => (
            <option key={w.id} value={w.id}>
              {w.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Prospect
        <select name="prospectId" defaultValue={campaign.prospectId ?? ""}>
          <option value="">—</option>
          {prospects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.venue}
            </option>
          ))}
        </select>
      </label>
      <label>
        Customer
        <select name="customerId" defaultValue={campaign.customerId ?? ""}>
          <option value="">—</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="full">
        Headline
        <input name="headline" defaultValue={campaign.headline} />
      </label>
      <label className="full">
        Caption
        <textarea name="caption" rows={3} defaultValue={campaign.caption} />
      </label>
      <label className="full">
        CTA
        <input name="cta" defaultValue={campaign.cta} />
      </label>
      <div className="full">
        <p className="studio-kicker">Channels to post</p>
        {channels.map((ch) => (
          <label key={ch.id} className="check">
            <input type="checkbox" checked={ch.done} onChange={() => toggle(ch.id)} />
            <span>
              <strong>{ch.label}</strong>
              <div className="muted">{ch.copy}</div>
            </span>
            <button
              className="linkish"
              type="button"
              onClick={() => void copyText(`${ch.label}\n${ch.copy}`)}
            >
              Copy
            </button>
          </label>
        ))}
      </div>
      <div className="row-actions full">
        <button className="btn btn--hot" type="submit">
          Save campaign
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => void copyText(pack())}
        >
          Copy full drop
        </button>
      </div>
    </form>
  );
}

function TemplateList({
  templates,
  onSave,
}: {
  templates: EmailTemplate[];
  onSave: () => Promise<void>;
}) {
  return (
    <div className="studio-split">
      {templates.map((template) => (
        <form
          key={template.id}
          className="panel field-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            await api(`/api/admin/templates/${template.id}`, {
              method: "PATCH",
              body: JSON.stringify({
                name: form.get("name"),
                subject: form.get("subject"),
                body: form.get("body"),
              }),
            });
            await onSave();
          }}
        >
          <p className="studio-kicker full">{template.stage}</p>
          <label className="full">
            Name
            <input name="name" defaultValue={template.name} />
          </label>
          <label className="full">
            Subject
            <input name="subject" defaultValue={template.subject} />
          </label>
          <label className="full">
            Body
            <textarea name="body" rows={8} defaultValue={template.body} />
          </label>
          <div className="row-actions full">
            <button className="btn btn--ghost" type="submit">
              Save template
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
