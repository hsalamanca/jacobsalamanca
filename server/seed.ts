import type {
  Campaign,
  Customer,
  EmailTemplate,
  StudioData,
  WorkItem,
} from "../src/types";
import { work as siteWork } from "../src/data/site";

function now() {
  return new Date().toISOString();
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function seedWork(): WorkItem[] {
  return siteWork.map((item, index) => ({
    ...item,
    posterStyle: item.id as WorkItem["posterStyle"],
    published: true,
    customerId: `cust-${slug(item.venue)}`,
    sortOrder: index,
  }));
}

export function seedCustomers(work: WorkItem[]): Customer[] {
  const seen = new Map<string, Customer>();
  for (const item of work) {
    const id = item.customerId ?? `cust-${slug(item.venue)}`;
    if (seen.has(id)) continue;
    seen.set(id, {
      id,
      name: item.venue,
      email: `bookings@${slug(item.venue)}.com`,
      phone: "",
      venue: item.venue,
      city: item.city,
      notes: `Existing account from published work (${item.title}).`,
      status: "active",
      createdAt: now(),
    });
  }
  return [...seen.values()];
}

export function seedTemplates(): EmailTemplate[] {
  return [
    {
      id: "tpl-new",
      stage: "new",
      name: "First reply",
      subject: "Got it — {{venue}} / {{eventDate}}",
      body: `{{name}} —\n\nGot the brief for {{venue}}. I'll come back with whether this should be a flyer only or a full campaign drop (stories, feed, door, promoter pack).\n\nIf you have last-time door numbers or a competitor that night, send them.\n\n— Jacob`,
    },
    {
      id: "tpl-contacted",
      stage: "contacted",
      name: "Need three things",
      subject: "Three things so I can price {{venue}}",
      body: `{{name}} —\n\nTo lock the drop for {{eventDate}}:\n1. Music / crowd\n2. What has to be live (flyer, stories, ads, print)\n3. When files need to hit your phone\n\nReply here and I'll send the proposal.\n\n— Jacob`,
    },
    {
      id: "tpl-qualified",
      stage: "qualified",
      name: "Proposal",
      subject: "Proposal — {{venue}} {{eventDate}}",
      body: `{{name}} —\n\nFor {{venue}} on {{eventDate}}, I'd run this as: {{need}}.\n\nTypical drop: hero flyer, story set, feed post, and a promoter pack so nobody is posting a different night.\n\nSay the word and I'll put it on the board.\n\n— Jacob`,
    },
    {
      id: "tpl-proposal",
      stage: "proposal",
      name: "Nudge",
      subject: "Still want {{venue}} on {{eventDate}}?",
      body: `{{name}} —\n\nChecking if {{venue}} is still on for {{eventDate}}. I can start as soon as you confirm.\n\n— Jacob`,
    },
    {
      id: "tpl-booked",
      stage: "booked",
      name: "You're on the board",
      subject: "Booked — {{venue}} is in production",
      body: `{{name}} —\n\n{{venue}} is booked. I'll send first looks, then the full drop (print + stories + feed) before you need to post.\n\n— Jacob`,
    },
    {
      id: "tpl-production",
      stage: "production",
      name: "Files incoming",
      subject: "Drop ready to review — {{venue}}",
      body: `{{name}} —\n\nFirst look for {{venue}} is ready. Reply with lineup changes or I'll pack the full campaign files.\n\n— Jacob`,
    },
    {
      id: "tpl-delivered",
      stage: "delivered",
      name: "Recap / next Saturday",
      subject: "How did {{venue}} do — and next date?",
      body: `{{name}} —\n\nHope {{eventDate}} hit. If you want the same system next week, send the date and I'll keep the look and swap the lineup.\n\n— Jacob`,
    },
    {
      id: "tpl-lost",
      stage: "lost",
      name: "Later",
      subject: "Whenever the next night lands",
      body: `{{name}} —\n\nAll good if {{eventDate}} moved. When the next night is real, send it through Book a night and I'll pick it up.\n\n— Jacob`,
    },
    {
      id: "tpl-repeat",
      stage: "repeat",
      name: "Repeat night",
      subject: "Want me on the next {{venue}} night?",
      body: `{{name}} —\n\nYou've got a look that already works. Send the next date and I'll run the campaign system again — new lineup, same recognition.\n\n— Jacob`,
    },
  ];
}

function defaultChannels(name: string): Campaign["channels"] {
  return [
    { id: "ch-story", label: "IG story sequence", copy: `Tonight. ${name}. Screenshot and bring a friend.`, done: false },
    { id: "ch-feed", label: "Feed post", copy: `${name} — the room, the lineup, the reason to leave the house.`, done: false },
    { id: "ch-guest", label: "Guest list graphic", copy: `Guest list for ${name}. Name at the door.`, done: false },
    { id: "ch-promo", label: "DJ / promoter pack", copy: `Shareables for the lineup. Same art, their handle.`, done: false },
    { id: "ch-print", label: "Print / wheatpaste", copy: `Street poster. Big type. Date unmissable.`, done: false },
    { id: "ch-recap", label: "Recap template", copy: `Morning-after story. Packed room. Next date teed up.`, done: false },
  ];
}

export function seedCampaigns(work: WorkItem[]): Campaign[] {
  const featured = work.find((w) => w.id === "pool") ?? work[0];
  if (!featured) return [];
  return [
    {
      id: "camp-neon-pool",
      name: `${featured.title} campaign`,
      status: "live",
      eventDate: featured.date,
      headline: "The pool is louder than the weather.",
      caption: "Sunday day party. Tickets in bio. Don't screenshot this at 1pm and expect a wristband.",
      cta: "Get tickets",
      channels: defaultChannels(featured.title).map((c, i) => ({
        ...c,
        done: i < 2,
      })),
      workId: featured.id,
      customerId: featured.customerId,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

export function emptyStudio(): StudioData {
  const work = seedWork();
  return {
    work,
    prospects: [],
    customers: seedCustomers(work),
    campaigns: seedCampaigns(work),
    activities: [
      {
        id: "act-seed",
        at: now(),
        kind: "system",
        body: "Studio opened. Published nights loaded as customers. New Book a night briefs land in New.",
      },
    ],
    templates: seedTemplates(),
  };
}

export function fillTemplate(
  template: EmailTemplate,
  prospect: {
    name: string;
    venue: string;
    eventDate: string;
    need: string;
    email: string;
  },
) {
  const map: Record<string, string> = {
    name: prospect.name,
    venue: prospect.venue,
    eventDate: prospect.eventDate || "the date",
    need: prospect.need,
    email: prospect.email,
  };
  const inject = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => map[key] ?? "");
  return {
    to: prospect.email,
    subject: inject(template.subject),
    body: inject(template.body),
  };
}

export { defaultChannels };
