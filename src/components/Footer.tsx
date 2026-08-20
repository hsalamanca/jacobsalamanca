import { Link } from "react-router-dom";
import { venues } from "../data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__venues">
        {venues.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <div className="footer__row">
        <p>Jacob Salamanca · Nightlife graphic design</p>
        <span>
          <a href="mailto:book@jacobsalamanca.com">book@jacobsalamanca.com</a>
          {" · "}
          <Link to="/admin">Studio</Link>
        </span>
      </div>
    </footer>
  );
}
