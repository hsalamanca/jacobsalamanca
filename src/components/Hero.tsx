import { AfterHoursPoster, AzulPoster, GoldRoomPoster } from "./Posters";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <p className="eyebrow">Graphic design · Nightlife marketing</p>
        <h1>
          Flyers that
          <br />
          fill the room.
        </h1>
        <p className="lede">
          Jacob Salamanca designs for clubs, bars, and promoters who need people
          at the door — not just a pretty square on Instagram. Campaigns built
          for Saturday night.
        </p>
        <div className="hero__actions">
          <a className="btn btn--hot" href="#book">
            Book this week
          </a>
          <a className="btn btn--ghost" href="#work">
            See the nights
          </a>
        </div>
        <dl className="hero__stats">
          <div>
            <dt>Events designed</dt>
            <dd>180+</dd>
          </div>
          <div>
            <dt>Venues</dt>
            <dd>40+</dd>
          </div>
          <div>
            <dt>Typical turnaround</dt>
            <dd>48 hrs</dd>
          </div>
        </dl>
      </div>
      <div className="hero__stack" aria-hidden="true">
        <div className="hero__card hero__card--a">
          <AfterHoursPoster />
        </div>
        <div className="hero__card hero__card--b">
          <GoldRoomPoster />
        </div>
        <div className="hero__card hero__card--c">
          <AzulPoster />
        </div>
      </div>
    </section>
  );
}
