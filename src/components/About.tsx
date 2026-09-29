export function About() {
  return (
    <section className="section about" id="about">
      <div className="about__grid">
        <div>
          <p className="eyebrow">The studio</p>
          <h2>A studio that understands the door.</h2>
          <p>
            Salamnca Graphx is a graphic design studio working almost exclusively
            with nightlife — clubs, bars, day parties, and the promoters who
            run them. The work sits between poster culture and performance
            marketing: it has to look like a night worth leaving the house
            for, and it has to convert.
          </p>
          <p>
            That means thinking about guest lists, bottle minimums, competing
            rooms, and the fact that most people decide in a story, not a
            website. Pretty is the baseline. Packed is the brief.
          </p>
        </div>
        <aside className="about__card">
          <p className="about__card-kicker">Best for</p>
          <ul>
            <li>Weekly club nights that need a recognizable look</li>
            <li>Bars trying to own happy hour or a rooftop season</li>
            <li>Ticketed events that need a campaign, not one JPEG</li>
            <li>Promoters who post every week and are tired of Canva</li>
          </ul>
          <p className="about__turn">
            Rush nights: 24–48 hours when the date is already printed on the
            calendar.
          </p>
        </aside>
      </div>
    </section>
  );
}
