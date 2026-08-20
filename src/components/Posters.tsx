type PosterProps = {
  className?: string;
};

export function AfterHoursPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-after ${className}`}>
      <div className="poster-after__stripe" />
      <p className="poster-kicker">Warehouse 12 · Techno</p>
      <h3>
        AFTER
        <span>/</span>
        HOURS
      </h3>
      <p className="poster-after__time">04:00</p>
      <ul>
        <li>KIRA VÖL</li>
        <li>NATE CROSS</li>
        <li>ROOM 2: SLEEVE</li>
      </ul>
      <p className="poster-foot">SAT 08.15 · NO PHOTOS AFTER 2</p>
    </article>
  );
}

export function GoldRoomPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-gold ${className}`}>
      <p className="poster-gold__city">Saturday night · Mirror</p>
      <p className="poster-gold__the">The</p>
      <h3>GOLD ROOM</h3>
      <p className="poster-gold__sub">Hip-Hop · R&B · Bottles</p>
      <div className="poster-gold__rule" />
      <p className="poster-gold__guest">GUEST LIST 11PM · DOORS 10</p>
      <p className="poster-foot">DRESS CODE ENFORCED</p>
    </article>
  );
}

export function AzulPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-azul ${className}`}>
      <div className="poster-azul__orb" />
      <p className="poster-kicker">Viernes · Eastside</p>
      <h3>AZUL</h3>
      <p className="poster-azul__line">Salsa · Reggaeton · Dembow</p>
      <p className="poster-azul__live">LIVE PERCUSSION 12:30</p>
      <p className="poster-foot">FRI 08.21 · AZUL</p>
    </article>
  );
}

export function RoofPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-roof ${className}`}>
      <p className="poster-kicker">Palm & Co.</p>
      <h3>
        ROOF
        <em>open</em>
      </h3>
      <p className="poster-roof__hours">Sunset — close</p>
      <p className="poster-roof__note">Spritz, natural wine, late jazz Fridays.</p>
      <p className="poster-foot">THU–SUN · RESERVATIONS</p>
    </article>
  );
}

export function BunkerPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-bunker ${className}`}>
      <p className="poster-bunker__no">04</p>
      <h3>BUNKER</h3>
      <ul>
        <li>01  MARA DEX</li>
        <li>02  ION</li>
        <li>03  HEXA</li>
        <li>04  CLOSED DOOR</li>
      </ul>
      <p className="poster-foot">FRI 09.04 · INDUSTRIAL</p>
    </article>
  );
}

export function PoolPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-pool ${className}`}>
      <p className="poster-kicker">Sunday day party</p>
      <h3>
        NEON
        <span>POOL</span>
      </h3>
      <p className="poster-pool__time">2PM — 10PM</p>
      <p className="poster-pool__tag">House · Balearic · Frozen drinks</p>
      <p className="poster-foot">THE LOFT POOL · TICKETS</p>
    </article>
  );
}

export function HappyHourPoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-hh ${className}`}>
      <p className="poster-kicker">Gold Room Bar</p>
      <h3>
        AFTER
        <span>WORK</span>
      </h3>
      <div className="poster-hh__prices">
        <p>
          <strong>$6</strong> drafts
        </p>
        <p>
          <strong>$8</strong> wells
        </p>
        <p>
          <strong>$10</strong> frozen
        </p>
      </div>
      <p className="poster-foot">MON–THU · 4PM–7PM</p>
    </article>
  );
}

export function NyePoster({ className = "" }: PosterProps) {
  return (
    <article className={`poster poster-nye ${className}`}>
      <p className="poster-kicker">Mirror × Warehouse 12</p>
      <p className="poster-nye__tiny">COUNTDOWN</p>
      <h3>
        NYE
        <span>26</span>
      </h3>
      <p className="poster-nye__rooms">TWO ROOMS · THREE TIERS</p>
      <p className="poster-foot">DEC 31 · DOORS 9PM</p>
    </article>
  );
}

export const posters = {
  afterhours: AfterHoursPoster,
  goldroom: GoldRoomPoster,
  azul: AzulPoster,
  roof: RoofPoster,
  bunker: BunkerPoster,
  pool: PoolPoster,
  happyhour: HappyHourPoster,
  nye: NyePoster,
} as const;

const styleClass: Record<string, string> = {
  afterhours: "poster-after",
  goldroom: "poster-gold",
  azul: "poster-azul",
  roof: "poster-roof",
  bunker: "poster-bunker",
  pool: "poster-pool",
  happyhour: "poster-hh",
  nye: "poster-nye",
};

export function WorkPoster({
  item,
}: {
  item: {
    id: string;
    posterStyle: string;
    title: string;
    venue: string;
    date: string;
    city: string;
    category: string;
  };
}) {
  const Template = posters[item.id as keyof typeof posters];
  if (Template && item.posterStyle === item.id) return <Template />;
  return (
    <article className={`poster ${styleClass[item.posterStyle] ?? "poster-hh"}`}>
      <p className="poster-kicker">
        {item.city} · {item.category}
      </p>
      <h3>{item.title || "UNTITLED"}</h3>
      <p className="poster-foot">
        {item.date} · {item.venue}
      </p>
    </article>
  );
}
