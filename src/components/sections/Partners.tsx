import Image from "next/image";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { prisma } from "@/infrastructure/db/prisma";

export async function Partners() {
  let partners: any[] = [];
  try {
    partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Erro ao buscar parceiros:", error);
  }

  if (partners.length === 0) return null;

  return (
    <section className="py-[3rem] md:py-[4.5rem] bg-white border-y border-[#e4e2de]">
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="text-center mb-[3rem]">
          <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30] mb-2 block">
            Rede de Confiança
          </span>
          <h2 className="text-[clamp(1.75rem,2.5vw,2rem)] font-heading text-[#411f03] leading-[1.2]">
            Nossos Parceiros e Convênios
          </h2>
        </div>

        <StaggerContainer className="flex flex-wrap justify-center items-center gap-[2rem] md:gap-[4rem]">
          {partners.map((partner, idx) => {
            const Wrapper = partner.link ? "a" : "div";
            return (
              <StaggerItem key={partner.id || idx}>
                <Wrapper
                  href={partner.link || undefined}
                  target={partner.link ? "_blank" : undefined}
                  rel={partner.link ? "noopener noreferrer" : undefined}
                  className={`relative w-[120px] h-[60px] md:w-[160px] md:h-[80px] grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 ${
                    partner.link ? "cursor-pointer" : ""
                  }`}
                >
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </Wrapper>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
