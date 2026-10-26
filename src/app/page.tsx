import type { Client, Review, Service, ServicePackage } from "@prisma/client";
import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { prisma } from "@/infrastructure/db/prisma";

export const revalidate = 0;

type ServiceWithPackages = Service & { packages: ServicePackage[] };
type ReviewWithClient = Review & { client: Client };

// Carregadas apenas quando o browser precisar (below the fold)
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About })),
);
const ServicesAndPricing = dynamic(() =>
  import("@/components/sections/ServicesAndPricing").then((m) => ({
    default: m.ServicesAndPricing,
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
const FloatingWhatsAppButton = dynamic(() =>
  import("@/components/ui/FloatingWhatsAppButton").then((m) => ({
    default: m.FloatingWhatsAppButton,
  })),
);

export default async function Home() {
  let services: ServiceWithPackages[] = [];
  let reviews: ReviewWithClient[] = [];

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
      <ServicesAndPricing initialServices={services} />
      <HowItWorks />
      <Testimonials initialReviews={reviews} />
      <Contact />
      <Footer />
      <BackToTop />
      <FloatingWhatsAppButton />
    </main>
  );
}
