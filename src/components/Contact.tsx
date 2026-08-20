import { type FormEvent, useState } from "react";
import { api } from "../lib/api";

const needs = [
  "Club / bar flyer",
  "Full event campaign",
  "Weekly night system",
  "Venue branding",
  "Something else",
];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      await api("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          venue: data.get("venue"),
          date: data.get("date"),
          need: data.get("need"),
          message: data.get("message"),
        }),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the brief.");
    }
  };

  return (
    <section className="section contact" id="book">
      <header className="section__head">
        <p className="eyebrow">Book a night</p>
        <h2>Need a flyer before Friday?</h2>
        <p className="section__intro">
          Send the date, the room, and the music. I'll tell you what the drop
          should include — flyer only, or the full campaign.
        </p>
      </header>
      {sent ? (
        <p className="contact__thanks">
          Brief received. It is on the board — you'll get a reply on how this
          night should be built.
        </p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Venue / brand
            <input name="venue" type="text" required />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Event date
            <input name="date" type="text" placeholder="Sat 08.29" />
          </label>
          <label>
            What you need
            <select name="need" defaultValue={needs[0]}>
              {needs.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="form__full">
            The night
            <textarea
              name="message"
              rows={5}
              placeholder="Music, crowd, last-time door numbers if you have them, and when you need files."
              required
            />
          </label>
          {error ? <p className="form__full" style={{ color: "var(--hot)" }}>{error}</p> : null}
          <button className="btn btn--hot" type="submit">
            Send the brief
          </button>
        </form>
      )}
    </section>
  );
}
