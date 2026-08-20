export type Category = "All" | "Club" | "Bar" | "Campaign";

export type WorkItem = {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  category: Exclude<Category, "All">;
  tags: string[];
  deliverables: string[];
  result: string;
  brief: string;
};

export const work: WorkItem[] = [
  {
    id: "afterhours",
    title: "After / Hours",
    venue: "Warehouse 12",
    city: "Downtown",
    date: "Sat 08.15",
    category: "Club",
    tags: ["Techno", "Print + digital", "Lineup poster"],
    deliverables: ["A3 street poster", "IG story set (6)", "Feed square", "Door signage"],
    result: "Sold out by 1:40am. Recurring monthly series.",
    brief: "A 4AM warehouse series needed a look that felt illegal in a good way — industrial, loud, and instantly recognizable on a telephone pole.",
  },
  {
    id: "goldroom",
    title: "The Gold Room",
    venue: "Mirror",
    city: "Midtown",
    date: "Sat 08.22",
    category: "Club",
    tags: ["Hip-hop", "Guest list", "Bottle service"],
    deliverables: ["Main flyer", "Guest-list story", "Table booking card", "Recap template"],
    result: "Table bookings up 28% vs. the previous Saturday.",
    brief: "Saturday hip-hop with a velvet-rope energy. The flyer had to sell status as much as the music.",
  },
  {
    id: "azul",
    title: "Azul",
    venue: "Azul",
    city: "Eastside",
    date: "Fri 08.21",
    category: "Club",
    tags: ["Latin night", "Reggaeton", "Campaign"],
    deliverables: ["Bilingual flyer", "Story sequence", "Reel cover", "Promo pack for DJs"],
    result: "Highest Friday door of the summer.",
    brief: "A weekly Latin night that had gotten visually tired. We rebuilt the identity so every Friday feels like an event, not a habit.",
  },
  {
    id: "roof",
    title: "Roof",
    venue: "Palm & Co.",
    city: "Rooftop",
    date: "Thu–Sun",
    category: "Bar",
    tags: ["Cocktails", "Golden hour", "Seasonal"],
    deliverables: ["Season poster", "Happy-hour menu", "Stories", "Reservation card"],
    result: "Weeknight covers filled without discounting the room.",
    brief: "Sunset-to-close rooftop. The work had to feel expensive on a phone screen and on a host stand.",
  },
  {
    id: "bunker",
    title: "Bunker 04",
    venue: "Bunker",
    city: "Industrial",
    date: "Fri 09.04",
    category: "Club",
    tags: ["Underground", "DJ lineup", "Series"],
    deliverables: ["Numbered poster series", "Lineup lockup", "Wristband graphic", "Stories"],
    result: "Resident night now the venue's most followed series.",
    brief: "A numbered underground series. Collectable, brutal, and built to stack on a wall over the year.",
  },
  {
    id: "pool",
    title: "Neon Pool",
    venue: "The Loft Pool",
    city: "West",
    date: "Sun 08.16",
    category: "Campaign",
    tags: ["Day party", "Summer", "Full campaign"],
    deliverables: ["Hero flyer", "Ticket graphic", "Influencer pack", "Day-of signage"],
    result: "1,200 tickets moved in 9 days.",
    brief: "A Sunday day party competing with every other pool in the city. The campaign had to look hotter than the weather.",
  },
  {
    id: "happyhour",
    title: "After Work",
    venue: "Gold Room Bar",
    city: "Financial",
    date: "Mon–Thu",
    category: "Bar",
    tags: ["Happy hour", "Menu", "Repeat traffic"],
    deliverables: ["Window poster", "Menu insert", "Story templates", "Staff lockup"],
    result: "4–7pm occupancy doubled in three weeks.",
    brief: "A bar that was dead until 10. The job was not a pretty poster — it was a reason to leave the office.",
  },
  {
    id: "nye",
    title: "NYE 26",
    venue: "Mirror × Warehouse 12",
    city: "Citywide",
    date: "Dec 31",
    category: "Campaign",
    tags: ["New Year", "Ticketed", "Multi-venue"],
    deliverables: ["Hero key art", "Tiered ticket graphics", "Story ads", "Street wheatpaste"],
    result: "Early-bird tier sold in 36 hours.",
    brief: "Two rooms, one night, three ticket tiers. The campaign had to look like the biggest night in the city — because it needed to be.",
  },
];

export const venues = [
  "Warehouse 12",
  "Mirror",
  "Azul",
  "Palm & Co.",
  "Bunker",
  "The Loft",
  "Gold Room Bar",
  "Velvet",
];

export const services = [
  {
    num: "01",
    title: "Club & bar flyers",
    copy: "The piece people screenshot, share, and actually show up for. Print, digital, and the ugly formats venues actually use — stories, guest-list links, door posters.",
  },
  {
    num: "02",
    title: "Event campaign systems",
    copy: "One night, many assets. Hero flyer plus stories, feed, ads, recap templates, and promoter packs so the whole team is posting the same night.",
  },
  {
    num: "03",
    title: "Nightlife branding",
    copy: "Weekly residencies, venue identities, and series that still look expensive after the 40th Saturday. Logos, color, type, and a system promoters can run.",
  },
  {
    num: "04",
    title: "Social that sells the door",
    copy: "Not content for content. Story sequences, countdown frames, lineup drops, and recap kits built to move tickets and tables.",
  },
  {
    num: "05",
    title: "Menus, signage, the room",
    copy: "Happy hour boards, bottle menus, door signs, wristbands. The graphic that lives in the space, not just on a phone.",
  },
];

export const processSteps = [
  {
    num: "01",
    title: "The brief, not the vibe",
    copy: "Who needs to be in the room, what they respond to, and what the door did last time. Music, price, neighborhood, and the real competition that night.",
  },
  {
    num: "02",
    title: "A look that owns the night",
    copy: "Concepts built like posters, not templates. Type, color, and composition that cut through a saturated feed and a dark street.",
  },
  {
    num: "03",
    title: "The full drop",
    copy: "Print files, story sizes, feed, ads, and a promoter kit. Everything named, sized, and ready the afternoon you need to post.",
  },
  {
    num: "04",
    title: "Run it again",
    copy: "Weekly nights get a system, not a one-off. Recap templates and a look that compounds recognition every Saturday.",
  },
];
