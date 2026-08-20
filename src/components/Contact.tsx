import { type FormEvent, useState } from "react";

const needs = [
  "Club / bar flyer",
  "Full event campaign",
  "Weekly night system",
  "Venue branding",
  "Something else",
];

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const venue = String(data.get("venue") ?? "");
    const date = String(data.get("date") ?? "");
    const need = String(data.get("need") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Night booking — ${venue || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nVenue / brand: ${venue}\nEvent date: ${date}\nNeed: ${need}\n\n${message}`,
    );
    window.location.href = `mailto:book@jacobsalamanca.com?subject=${subject}&body=${body}`;
    setSent(true);
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
          Your mail client should be open. If it isn't, write{" "}
          <a href="mailto:book@jacobsalamanca.com">book@jacobsalamanca.com</a>
          .
        </p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label>
            Venue / brand
            <input name="venue" type="text" required />
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
          <button className="btn btn--hot" type="submit">
            Send the brief
          </button>
        </form>
      )}
    </section>
  );
}
