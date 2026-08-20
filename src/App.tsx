import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Process } from "./components/Process";
import { Services } from "./components/Services";
import { Work } from "./components/Work";

export default function App() {
  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
