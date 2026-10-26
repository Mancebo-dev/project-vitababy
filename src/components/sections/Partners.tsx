import type { Partner } from "@prisma/client";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { prisma } from "@/infrastructure/db/prisma";
import { PartnersCarousel } from "./PartnersCarousel";

export async function Partners() {
  let partners: Partner[] = [];
  try {
    partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Erro ao buscar parceiros:", error);
  }

  // Se não houver parceiros cadastrados ainda, não quebra a página
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 lg:py-28 min-h-[70vh] lg:min-h-[85vh] bg-white border-y border-[#e4e2de] overflow-hidden flex flex-col justify-center">
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] mb-8 text-center">
        <StaggerContainer className="flex flex-col items-center">
          <StaggerItem>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-[#411f03] leading-tight tracking-tight">
              Nossos Parceiros e Publicações
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xs sm:text-sm md:text-base text-[#5c5954] max-w-xl mx-auto mt-2 leading-relaxed">
              Conheça nossas parcerias, publicações informativas, cartazes e
              ações especiais voltadas para a saúde materno-infantil.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>

      <PartnersCarousel partners={partners} />
    </section>
  );
}
