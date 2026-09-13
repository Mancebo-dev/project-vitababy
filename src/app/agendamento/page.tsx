import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/agendamento/BookingWizard";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata: Metadata = {
  title: "Agendamento de Consultoria | Vita Baby",
  description:
    "Agende sua consultoria em amamentação, banho humanizado ou assistência pós-parto com as especialistas da Vita Baby.",
};

export default function AgendamentoPage() {
  return (
    <main className="flex flex-col bg-[#fbf9f5]">
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-[1.5rem] lg:p-[4rem]">
        <div className="w-full max-w-[1000px] flex flex-col min-h-0 max-h-full">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-[#af4d30] font-semibold">
                Carregando fluxo de agendamento...
              </div>
            }
          >
            <WizardDataLoader />
          </Suspense>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  );
}

// Separate component to do the async fetching so Suspense catches it
import { prisma } from "@/infrastructure/db/prisma";

async function WizardDataLoader() {
  const [dbServices, professionals, availableSlots] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      include: {
        packages: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.professional.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
    prisma.scheduleSlot.findMany({
      where: {
        isBooked: false,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
  ]);

  const services = dbServices.map((s) => {
    const validPrices = s.packages
      .map((p) => p.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    const validDurations = s.packages
      .map((p) => p.duration)
      .filter((d): d is number => typeof d === "number" && d > 0);

    return {
      ...s,
      price: validPrices.length > 0 ? Math.min(...validPrices) : 0,
      duration: validDurations.length > 0 ? Math.min(...validDurations) : 60,
    };
  });

  return (
    <BookingWizard
      services={services}
      professionals={professionals}
      availableSlots={availableSlots}
    />
  );
}
