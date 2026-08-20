export type Category = "All" | "Club" | "Bar" | "Campaign";
export type WorkCategory = Exclude<Category, "All">;

export type PosterStyle =
  | "afterhours"
  | "goldroom"
  | "azul"
  | "roof"
  | "bunker"
  | "pool"
  | "happyhour"
  | "nye";

export type ProspectStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "booked"
  | "production"
  | "delivered"
  | "lost";

export type CampaignStatus = "draft" | "ready" | "live" | "done";

export type WorkItem = {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  category: WorkCategory;
  tags: string[];
  deliverables: string[];
  result: string;
  brief: string;
  posterStyle: PosterStyle;
  published: boolean;
  customerId?: string;
  sortOrder: number;
};

export type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  venue: string;
  eventDate: string;
  need: string;
  message: string;
  stage: ProspectStage;
  source: "book-a-night" | "manual";
  followUpAt: string;
  customerId?: string;
  campaignId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  venue: string;
  city: string;
  notes: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type Activity = {
  id: string;
  at: string;
  kind: "note" | "stage" | "email" | "campaign" | "system";
  body: string;
  prospectId?: string;
  customerId?: string;
  campaignId?: string;
};

export type CampaignChannel = {
  id: string;
  label: string;
  copy: string;
  done: boolean;
};

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  eventDate: string;
  headline: string;
  caption: string;
  cta: string;
  channels: CampaignChannel[];
  workId?: string;
  prospectId?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
};

export type EmailTemplate = {
  id: string;
  stage: ProspectStage | "repeat";
  name: string;
  subject: string;
  body: string;
};

export type StudioData = {
  work: WorkItem[];
  prospects: Prospect[];
  customers: Customer[];
  campaigns: Campaign[];
  activities: Activity[];
  templates: EmailTemplate[];
};

export const FUNNEL_STAGES: { id: ProspectStage; label: string; hint: string }[] = [
  { id: "new", label: "New", hint: "Came in from Book a night" },
  { id: "contacted", label: "Contacted", hint: "First reply sent" },
  { id: "qualified", label: "Qualified", hint: "Date, room, budget clear" },
  { id: "proposal", label: "Proposal", hint: "Quote / scope out" },
  { id: "booked", label: "Booked", hint: "Won — now a customer" },
  { id: "production", label: "Production", hint: "Designing the drop" },
  { id: "delivered", label: "Delivered", hint: "Files out, night ran" },
  { id: "lost", label: "Lost", hint: "Dead or went elsewhere" },
];
