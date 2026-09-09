import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
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
    <main className="flex min-h-screen flex-col bg-[#fbf9f5]">
      <div className="w-full pt-[2.5rem] px-[1.5rem] lg:px-[7.5rem] max-w-[1000px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para o site
        </Link>
      </div>

      <section className="pt-[2.5rem] pb-[5rem] px-[1.5rem] lg:px-[7.5rem] w-full">
        <div className="max-w-[1000px] mx-auto mb-[2.5rem] text-center">
          <span className="text-[#af4d30] font-bold text-[0.875rem] uppercase tracking-widest">
            Vitababy Assessoria
          </span>
          <h1 className="text-[clamp(2.25rem,4vw,3.25rem)] font-heading font-bold text-[#411f03] leading-[1.15] mt-[0.5rem] mb-[0.75rem]">
            Agende seu Atendimento
          </h1>
          <p className="text-[#444840] text-[1.0625rem] max-w-[36rem] mx-auto leading-[1.6]">
            Escolha o serviço, a profissional de sua preferência e até 3 opções
            de datas e horários. Cuidado humanizado e acolhedor para a sua
            família.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="w-full h-96 flex items-center justify-center text-[#af4d30] font-semibold">
              Carregando fluxo de agendamento...
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
