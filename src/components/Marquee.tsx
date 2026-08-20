const items = [
  "Club flyers",
  "Bar campaigns",
  "Story packs",
  "Guest-list graphics",
  "Ticketed nights",
  "DJ residencies",
  "Happy hour",
  "Day parties",
  "NYE",
  "Venue branding",
];

export function Marquee() {
  const line = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {line.map((item, i) => (
          <span key={`${item}-${i}`}>
            {item}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
