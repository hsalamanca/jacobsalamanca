import { Hono } from "hono";
import { fillTemplate } from "./seed";
import { defaultChannels } from "./seed";
import {
  clearSession,
  createSession,
  passwordOk,
  readSession,
  setSession,
} from "./auth";
import { readStudio, writeStudio } from "./store";
import type {
  Campaign,
  CampaignStatus,
  Customer,
  Prospect,
  ProspectStage,
  WorkItem,
} from "../src/types";

const app = new Hono().basePath("/api");

app.use(async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  if (!pathname.startsWith("/api/admin/")) {
    await next();
    return;
  }
  const open = ["/api/admin/login", "/api/admin/logout", "/api/admin/session"];
  if (open.includes(pathname)) {
    await next();
    return;
  }
  if (!requireAdmin(c)) return c.json({ error: "unauthorized" }, 401);
  await next();
});

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function now() {
  return new Date().toISOString();
}

function requireAdmin(c: Parameters<typeof readSession>[0]) {
  return readSession(c);
}

app.get("/work", async (c) => {
  const data = await readStudio();
  const work = data.work
    .filter((item) => item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return c.json({ work });
});

app.post("/leads", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return c.json({ error: "Invalid brief" }, 400);
  }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const venue = String(body.venue ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !email || !venue || !message) {
    return c.json({ error: "Name, email, venue, and the night are required." }, 400);
  }

  const stamp = now();
  const prospect: Prospect = {
    id: id("lead"),
    name,
    email,
    phone: String(body.phone ?? "").trim(),
    venue,
    eventDate: String(body.date ?? body.eventDate ?? "").trim(),
    need: String(body.need ?? "Club / bar flyer").trim(),
    message,
    stage: "new",
    source: "book-a-night",
    followUpAt: stamp,
    createdAt: stamp,
    updatedAt: stamp,
  };

  await writeStudio((data) => {
    data.prospects.unshift(prospect);
    data.activities.unshift({
      id: id("act"),
      at: stamp,
      kind: "system",
      body: `New brief from ${name} · ${venue} · ${prospect.need}`,
      prospectId: prospect.id,
    });
  });

  return c.json({ ok: true, id: prospect.id });
});

app.post("/admin/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const password = String(body?.password ?? "");
  if (!passwordOk(password)) {
    return c.json({ error: "Wrong password." }, 401);
  }
  setSession(c, createSession());
  return c.json({ ok: true });
});

app.post("/admin/logout", (c) => {
  clearSession(c);
  return c.json({ ok: true });
});

app.get("/admin/session", (c) => {
  return c.json({ ok: requireAdmin(c) });
});

app.get("/admin/overview", async (c) => {
  const data = await readStudio();
  const open = data.prospects.filter((p) => p.stage !== "lost" && p.stage !== "delivered");
  const byStage = Object.fromEntries(
    ["new", "contacted", "qualified", "proposal", "booked", "production", "delivered", "lost"].map(
      (stage) => [stage, data.prospects.filter((p) => p.stage === stage).length],
    ),
  );
  return c.json({
    prospects: data.prospects.length,
    open: open.length,
    newLeads: byStage.new ?? 0,
    customers: data.customers.filter((x) => x.status === "active").length,
    publishedWork: data.work.filter((w) => w.published).length,
    liveCampaigns: data.campaigns.filter((x) => x.status === "live" || x.status === "ready").length,
    byStage,
    recent: data.activities.slice(0, 8),
    inbox: data.prospects.filter((p) => p.stage === "new").slice(0, 6),
  });
});

app.get("/admin/prospects", async (c) => {
  const data = await readStudio();
  return c.json({
    prospects: data.prospects,
    activities: data.activities,
    templates: data.templates,
    customers: data.customers,
  });
});

app.post("/admin/prospects", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const stamp = now();
  const prospect: Prospect = {
    id: id("lead"),
    name: String(body.name ?? "Untitled").trim(),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    venue: String(body.venue ?? "").trim(),
    eventDate: String(body.eventDate ?? "").trim(),
    need: String(body.need ?? "Club / bar flyer").trim(),
    message: String(body.message ?? "").trim(),
    stage: "new",
    source: "manual",
    followUpAt: stamp,
    createdAt: stamp,
    updatedAt: stamp,
  };
  await writeStudio((data) => {
    data.prospects.unshift(prospect);
    data.activities.unshift({
      id: id("act"),
      at: stamp,
      kind: "system",
      body: `Manual lead added: ${prospect.name}`,
      prospectId: prospect.id,
    });
  });
  return c.json({ prospect });
});

app.patch("/admin/prospects/:id", async (c) => {
  const prospectId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const stamp = now();
  let converted: Customer | undefined;

  const data = await writeStudio((studio) => {
    const prospect = studio.prospects.find((p) => p.id === prospectId);
    if (!prospect) return;
    const prev = prospect.stage;
    const fields: (keyof Prospect)[] = [
      "name",
      "email",
      "phone",
      "venue",
      "eventDate",
      "need",
      "message",
      "followUpAt",
    ];
    for (const field of fields) {
      if (body[field] !== undefined) {
        (prospect[field] as string) = String(body[field]);
      }
    }
    if (body.stage && body.stage !== prospect.stage) {
      prospect.stage = body.stage as ProspectStage;
      studio.activities.unshift({
        id: id("act"),
        at: stamp,
        kind: "stage",
        body: `Stage ${prev} → ${prospect.stage}`,
        prospectId,
      });
    }
    if (
      (prospect.stage === "booked" ||
        prospect.stage === "production" ||
        prospect.stage === "delivered") &&
      !prospect.customerId
    ) {
      const customer: Customer = {
        id: id("cust"),
        name: prospect.name,
        email: prospect.email,
        phone: prospect.phone,
        venue: prospect.venue,
        city: "",
        notes: `Converted from Book a night (${prospect.need}).`,
        status: "active",
        createdAt: stamp,
      };
      studio.customers.unshift(customer);
      prospect.customerId = customer.id;
      converted = customer;
      studio.activities.unshift({
        id: id("act"),
        at: stamp,
        kind: "system",
        body: `Converted ${prospect.name} to customer`,
        prospectId,
        customerId: customer.id,
      });
    }
    prospect.updatedAt = stamp;
  });

  const prospect = data.prospects.find((p) => p.id === prospectId);
  if (!prospect) return c.json({ error: "Not found" }, 404);
  return c.json({ prospect, customer: converted });
});

app.post("/admin/prospects/:id/note", async (c) => {
  const prospectId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const text = String(body.body ?? "").trim();
  if (!text) return c.json({ error: "Note required" }, 400);
  const stamp = now();
  await writeStudio((data) => {
    data.activities.unshift({
      id: id("act"),
      at: stamp,
      kind: "note",
      body: text,
      prospectId,
    });
  });
  return c.json({ ok: true });
});

app.post("/admin/prospects/:id/email", async (c) => {
  const prospectId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const data = await readStudio();
  const prospect = data.prospects.find((p) => p.id === prospectId);
  if (!prospect) return c.json({ error: "Not found" }, 404);
  const template =
    data.templates.find((t) => t.id === body.templateId) ??
    data.templates.find((t) => t.stage === prospect.stage);
  if (!template) return c.json({ error: "No template" }, 404);
  const mail = fillTemplate(template, prospect);
  const stamp = now();
  await writeStudio((studio) => {
    studio.activities.unshift({
      id: id("act"),
      at: stamp,
      kind: "email",
      body: `Prepared “${template.name}” to ${prospect.email}`,
      prospectId,
    });
  });
  return c.json({ mail, template });
});

app.get("/admin/customers", async (c) => {
  const data = await readStudio();
  return c.json({
    customers: data.customers,
    work: data.work,
    prospects: data.prospects,
    campaigns: data.campaigns,
    activities: data.activities.filter((a) => a.customerId),
  });
});

app.post("/admin/customers", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const stamp = now();
  const customer: Customer = {
    id: id("cust"),
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    venue: String(body.venue ?? "").trim(),
    city: String(body.city ?? "").trim(),
    notes: String(body.notes ?? "").trim(),
    status: "active",
    createdAt: stamp,
  };
  if (!customer.name) return c.json({ error: "Name required" }, 400);
  await writeStudio((data) => {
    data.customers.unshift(customer);
  });
  return c.json({ customer });
});

app.patch("/admin/customers/:id", async (c) => {
  const customerId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const data = await writeStudio((studio) => {
    const customer = studio.customers.find((x) => x.id === customerId);
    if (!customer) return;
    for (const field of ["name", "email", "phone", "venue", "city", "notes", "status"] as const) {
      if (body[field] !== undefined) customer[field] = String(body[field]) as never;
    }
  });
  const customer = data.customers.find((x) => x.id === customerId);
  if (!customer) return c.json({ error: "Not found" }, 404);
  return c.json({ customer });
});

app.get("/admin/work", async (c) => {
  const data = await readStudio();
  return c.json({ work: data.work, customers: data.customers });
});

app.post("/admin/work", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const item: WorkItem = {
    id: id("work"),
    title: String(body.title ?? "Untitled night").trim(),
    venue: String(body.venue ?? "").trim(),
    city: String(body.city ?? "").trim(),
    date: String(body.date ?? "").trim(),
    category: (body.category as WorkItem["category"]) || "Club",
    tags: Array.isArray(body.tags)
      ? body.tags.map(String)
      : String(body.tags ?? "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
    deliverables: Array.isArray(body.deliverables)
      ? body.deliverables.map(String)
      : String(body.deliverables ?? "")
          .split("\n")
          .map((t: string) => t.trim())
          .filter(Boolean),
    result: String(body.result ?? "").trim(),
    brief: String(body.brief ?? "").trim(),
    posterStyle: body.posterStyle || "afterhours",
    published: Boolean(body.published),
    customerId: body.customerId || undefined,
    sortOrder: Number(body.sortOrder ?? 99),
  };
  await writeStudio((data) => {
    data.work.unshift(item);
  });
  return c.json({ work: item });
});

app.patch("/admin/work/:id", async (c) => {
  const workId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const data = await writeStudio((studio) => {
    const item = studio.work.find((w) => w.id === workId);
    if (!item) return;
    if (body.title !== undefined) item.title = String(body.title);
    if (body.venue !== undefined) item.venue = String(body.venue);
    if (body.city !== undefined) item.city = String(body.city);
    if (body.date !== undefined) item.date = String(body.date);
    if (body.category !== undefined) item.category = body.category;
    if (body.result !== undefined) item.result = String(body.result);
    if (body.brief !== undefined) item.brief = String(body.brief);
    if (body.posterStyle !== undefined) item.posterStyle = body.posterStyle;
    if (body.published !== undefined) item.published = Boolean(body.published);
    if (body.customerId !== undefined) item.customerId = body.customerId || undefined;
    if (body.sortOrder !== undefined) item.sortOrder = Number(body.sortOrder);
    if (body.tags !== undefined) {
      item.tags = Array.isArray(body.tags)
        ? body.tags.map(String)
        : String(body.tags)
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean);
    }
    if (body.deliverables !== undefined) {
      item.deliverables = Array.isArray(body.deliverables)
        ? body.deliverables.map(String)
        : String(body.deliverables)
            .split("\n")
            .map((t: string) => t.trim())
            .filter(Boolean);
    }
  });
  const item = data.work.find((w) => w.id === workId);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ work: item });
});

app.delete("/admin/work/:id", async (c) => {
  const workId = c.req.param("id");
  await writeStudio((data) => {
    data.work = data.work.filter((w) => w.id !== workId);
  });
  return c.json({ ok: true });
});

app.get("/admin/marketing", async (c) => {
  const data = await readStudio();
  return c.json({
    campaigns: data.campaigns,
    templates: data.templates,
    work: data.work,
    prospects: data.prospects,
    customers: data.customers,
  });
});

app.post("/admin/campaigns", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const stamp = now();
  const name = String(body.name ?? "Untitled campaign").trim();
  const campaign: Campaign = {
    id: id("camp"),
    name,
    status: (body.status as CampaignStatus) || "draft",
    eventDate: String(body.eventDate ?? "").trim(),
    headline: String(body.headline ?? "").trim(),
    caption: String(body.caption ?? "").trim(),
    cta: String(body.cta ?? "Book / tickets").trim(),
    channels: Array.isArray(body.channels) ? body.channels : defaultChannels(name),
    workId: body.workId || undefined,
    prospectId: body.prospectId || undefined,
    customerId: body.customerId || undefined,
    createdAt: stamp,
    updatedAt: stamp,
  };
  await writeStudio((data) => {
    data.campaigns.unshift(campaign);
    data.activities.unshift({
      id: id("act"),
      at: stamp,
      kind: "campaign",
      body: `Campaign created: ${campaign.name}`,
      campaignId: campaign.id,
      prospectId: campaign.prospectId,
      customerId: campaign.customerId,
    });
  });
  return c.json({ campaign });
});

app.patch("/admin/campaigns/:id", async (c) => {
  const campaignId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const stamp = now();
  const data = await writeStudio((studio) => {
    const campaign = studio.campaigns.find((x) => x.id === campaignId);
    if (!campaign) return;
    for (const field of ["name", "eventDate", "headline", "caption", "cta", "status"] as const) {
      if (body[field] !== undefined) campaign[field] = String(body[field]) as never;
    }
    if (body.workId !== undefined) campaign.workId = body.workId || undefined;
    if (body.prospectId !== undefined) campaign.prospectId = body.prospectId || undefined;
    if (body.customerId !== undefined) campaign.customerId = body.customerId || undefined;
    if (Array.isArray(body.channels)) campaign.channels = body.channels;
    campaign.updatedAt = stamp;
  });
  const campaign = data.campaigns.find((x) => x.id === campaignId);
  if (!campaign) return c.json({ error: "Not found" }, 404);
  return c.json({ campaign });
});

app.patch("/admin/templates/:id", async (c) => {
  const templateId = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const data = await writeStudio((studio) => {
    const template = studio.templates.find((t) => t.id === templateId);
    if (!template) return;
    if (body.name !== undefined) template.name = String(body.name);
    if (body.subject !== undefined) template.subject = String(body.subject);
    if (body.body !== undefined) template.body = String(body.body);
  });
  const template = data.templates.find((t) => t.id === templateId);
  if (!template) return c.json({ error: "Not found" }, 404);
  return c.json({ template });
});

export default app;
