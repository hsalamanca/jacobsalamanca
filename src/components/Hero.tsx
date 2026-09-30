import { Link } from "react-router-dom";
import { AfterHoursPoster } from "./Posters";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__sheet">
        <p className="eyebrow">Nightlife graphic design</p>
        <h1>
          <em>Salamnca</em>
          <span>Graphx</span>
        </h1>
        <p className="hero__banner">Flyers that fill the room.</p>
        <p className="lede">
          A studio for clubs, bars, and promoters. The work is built to be
          shared, recognized, and walked into — print, stories, and the door.
        </p>
        <div className="hero__actions">
          <a className="btn btn--ticket" href="#book">
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
            <dt>Turnaround</dt>
            <dd>48 hrs</dd>
          </div>
        </dl>
      </div>
      <div className="hero__art">
        <Link className="hero__art-link" to="/after-hours">
          <div className="paper paper--hero">
            <AfterHoursPoster />
          </div>
          <p className="hero__art-cap">
            <span>01</span> After / Hours · Warehouse 12
          </p>
        </Link>
      </div>
    </section>
  );
}
