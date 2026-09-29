import { Link } from "react-router-dom";
import { venues } from "../data/site";

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__mark">Salamnca Graphx</p>
      <div className="footer__venues">
        {venues.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div className="footer__row">
        <p>Nightlife graphic design · Printed nights, digital drops</p>
        <span>
          <a href="https://salamncagraphx.com">salamncagraphx.com</a>
          {" · "}
          <a href="mailto:book@salamncagraphx.com">book@salamncagraphx.com</a>
          {" · "}
          <Link to="/admin">Studio</Link>
        </span>
      </div>
    </footer>
  );
}
