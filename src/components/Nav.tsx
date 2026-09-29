import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <a className="nav__logo" href="#top">
        <span>SG</span>
        Salamnca Graphx
      </a>
      <nav className="nav__links" aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
        <a className="nav__cta" href="#book">
          Book a night
        </a>
      </nav>
      <button
        className="nav__menu"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div className="nav__drawer" id="mobile-nav">
          <a href="#work" onClick={close}>
            Work
          </a>
          <a href="#services" onClick={close}>
            Services
          </a>
          <a href="#process" onClick={close}>
            Process
          </a>
          <a href="#about" onClick={close}>
            About
          </a>
          <a href="#book" onClick={close}>
            Book a night
          </a>
        </div>
      ) : null}
    </header>
  );
}
