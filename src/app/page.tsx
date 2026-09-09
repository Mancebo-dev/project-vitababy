import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";

// Carregadas apenas quando o browser precisar (below the fold)
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About })),
);
const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => ({
    default: m.Services,
  })),
);
const HowItWorks = dynamic(() =>
  import("@/components/sections/HowItWorks").then((m) => ({
    default: m.HowItWorks,
  })),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/Testimonials").then((m) => ({
    default: m.Testimonials,
  })),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact })),
);
const BackToTop = dynamic(() =>
  import("@/components/ui/BackToTop").then((m) => ({ default: m.BackToTop })),
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
