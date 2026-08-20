import { useEffect, useState } from "react";
import { WorkPoster } from "../components/Posters";
import { api } from "../lib/api";
import type { Customer, PosterStyle, WorkItem } from "../types";

const styles: PosterStyle[] = [
  "afterhours",
  "goldroom",
  "azul",
  "roof",
  "bunker",
  "pool",
  "happyhour",
  "nye",
];

type Bundle = { work: WorkItem[]; customers: Customer[] };

export function WorkManager() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [activeId, setActiveId] = useState<string | "new" | null>(null);

  const load = () => api<Bundle>("/api/admin/work").then(setBundle);
  useEffect(() => {
    void load();
  }, []);

  if (!bundle) return <p>Loading work…</p>;
  const active =
    activeId === "new"
      ? blankWork()
      : (bundle.work.find((w) => w.id === activeId) ?? null);

  return (
    <>
      <header className="studio-head">
        <div>
          <p className="studio-kicker">Site work</p>
          <h1>What gets shared on the site.</h1>
        </div>
        <button className="btn btn--hot" type="button" onClick={() => setActiveId("new")}>
          New night
        </button>
      </header>
      <div className="work-admin">
        <div>
          {bundle.work
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                className="card"
                onClick={() => setActiveId(item.id)}
              >
                <WorkPoster item={item} />
                <strong style={{ marginTop: 8 }}>{item.title}</strong>
                <em>
                  {item.venue} · {item.published ? "live" : "hidden"}
                </em>
              </button>
            ))}
        </div>
        {active ? (
          <WorkForm
            key={active.id}
            item={active}
            customers={bundle.customers}
            isNew={activeId === "new"}
            onCancel={() => setActiveId(null)}
            onSave={async (payload, isNew) => {
              if (isNew) {
                const created = await api<{ work: WorkItem }>("/api/admin/work", {
                  method: "POST",
                  body: JSON.stringify(payload),
                });
                setActiveId(created.work.id);
              } else {
                await api(`/api/admin/work/${active.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(payload),
                });
              }
              await load();
            }}
            onDelete={
              activeId === "new"
                ? undefined
                : async () => {
                    await api(`/api/admin/work/${active.id}`, { method: "DELETE" });
                    setActiveId(null);
                    await load();
                  }
            }
          />
        ) : (
          <p className="muted">Pick a night to edit, unpublish, or add a new piece to the grid.</p>
        )}
      </div>
    </>
  );
}

function blankWork(): WorkItem {
  return {
    id: "new",
    title: "",
    venue: "",
    city: "",
    date: "",
    category: "Club",
    tags: [],
    deliverables: [],
    result: "",
    brief: "",
    posterStyle: "afterhours",
    published: true,
    sortOrder: 0,
  };
}

function WorkForm({
  item,
  customers,
  isNew,
  onSave,
  onCancel,
  onDelete,
}: {
  item: WorkItem;
  customers: Customer[];
  isNew: boolean;
  onSave: (payload: Record<string, unknown>, isNew: boolean) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}) {
  const [style, setStyle] = useState<PosterStyle>(item.posterStyle);
  const preview: WorkItem = {
    ...item,
    posterStyle: style,
    id: style === item.id ? item.id : `preview-${style}`,
  };

  return (
    <form
      className="panel field-grid"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        void onSave(
          {
            title: form.get("title"),
            venue: form.get("venue"),
            city: form.get("city"),
            date: form.get("date"),
            category: form.get("category"),
            tags: form.get("tags"),
            deliverables: form.get("deliverables"),
            result: form.get("result"),
            brief: form.get("brief"),
            posterStyle: form.get("posterStyle"),
            published: form.get("published") === "on",
            customerId: form.get("customerId"),
            sortOrder: Number(form.get("sortOrder") ?? 0),
          },
          isNew,
        );
      }}
    >
      <div className="full mini">
        <WorkPoster item={preview} />
      </div>
      <label>
        Title
        <input name="title" defaultValue={item.title} required />
      </label>
      <label>
        Venue
        <input name="venue" defaultValue={item.venue} required />
      </label>
      <label>
        City
        <input name="city" defaultValue={item.city} />
      </label>
      <label>
        Date lockup
        <input name="date" defaultValue={item.date} />
      </label>
      <label>
        Category
        <select name="category" defaultValue={item.category}>
          <option>Club</option>
          <option>Bar</option>
          <option>Campaign</option>
        </select>
      </label>
      <label>
        Poster system
        <select
          name="posterStyle"
          value={style}
          onChange={(e) => setStyle(e.target.value as PosterStyle)}
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Customer
        <select name="customerId" defaultValue={item.customerId ?? ""}>
          <option value="">—</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Order
        <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
      </label>
      <label className="full">
        Tags (comma)
        <input name="tags" defaultValue={item.tags.join(", ")} />
      </label>
      <label className="full">
        Brief
        <textarea name="brief" rows={4} defaultValue={item.brief} />
      </label>
      <label className="full">
        Campaign drop (one per line)
        <textarea name="deliverables" rows={4} defaultValue={item.deliverables.join("\n")} />
      </label>
      <label className="full">
        Result
        <input name="result" defaultValue={item.result} />
      </label>
      <label>
        <input name="published" type="checkbox" defaultChecked={item.published} /> Live on site
      </label>
      <div className="row-actions full">
        <button className="btn btn--hot" type="submit">
          {isNew ? "Publish night" : "Save night"}
        </button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>
          Close
        </button>
        {onDelete ? (
          <button className="btn btn--ghost" type="button" onClick={() => void onDelete()}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
