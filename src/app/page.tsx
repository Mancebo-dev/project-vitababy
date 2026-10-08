import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { prisma } from "@/infrastructure/db/prisma";

export const revalidate = 0;

// Carregadas apenas quando o browser precisar (below the fold)
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About })),
);
const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => ({
    default: m.Services,
  })),
);
const Pricing = dynamic(() =>
  import("@/components/sections/Pricing").then((m) => ({
    default: m.Pricing,
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

export default async function Home() {
  let services: any[] = [];
  let reviews: any[] = [];

  try {
    services = await prisma.service.findMany({
      where: { active: true },
      include: {
        packages: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    reviews = await prisma.review.findMany({
      where: { isHighlighted: true },
      include: {
        client: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (error) {
    console.error(
      "⚠️ Erro ao buscar dados (tabela pode não existir ainda no build):",
      error,
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Partners />
      <About />
      <Services initialServices={services} />
      <Pricing initialServices={services} />
      <HowItWorks />
      <Testimonials initialReviews={reviews} />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
