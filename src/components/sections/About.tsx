import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function About() {
  return (
    <section
      id="sobre"
      className="bg-[#fbf9f5] min-h-[100vh] flex flex-col scroll-mt-[5rem] overflow-hidden relative"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] flex-1 flex flex-col">
        <StaggerContainer className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[2.5rem] lg:gap-[4rem]">
          {/* Image */}
          <StaggerItem className="relative w-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] xl:min-h-full mx-auto lg:mx-0 order-2 lg:order-1 flex items-end">
            <Image
              src="/assets/rayane-about.png"
              alt="Rayane Castro"
              fill
              unoptimized
              loading="lazy"
              className="object-contain object-bottom scale-[0.9] lg:scale-100 translate-y-[1rem] lg:translate-y-[2rem] origin-bottom"
            />
          </StaggerItem>

          {/* Text Content */}
          <div className="flex flex-col justify-center items-start gap-[1rem] order-1 lg:order-2 pt-[4rem] lg:py-[4rem]">
            <StaggerItem>
              <span className="text-[clamp(0.75rem,1vw,1rem)] font-semibold text-[#d19a7e] tracking-[0.0375rem] uppercase">
                SOBRE MIM
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-[clamp(2rem,3vw,3rem)] font-heading text-[#411f03] leading-[1.2]">
                Rayane Castro e a missão da Vitababy
              </h2>
            </StaggerItem>

            <StaggerItem className="flex flex-col gap-[1rem] text-[#444840] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.6] mt-[0.5rem]">
              <p>
                Com mais de 9 anos de experiência em cuidados materno-infantis,
                minha missão é acolher e guiar famílias em um dos momentos mais
                transformadores da vida.
              </p>
              <p>
                Na Vitababy, acreditamos que a informação baseada em evidências,
                aliada à empatia e ao respeito pela individualidade de cada
                família, é a chave para uma parentalidade mais leve e segura.
                Nossos serviços são desenhados para proporcionar conforto,
                confiança e suporte em cada etapa dessa jornada.
              </p>
            </StaggerItem>

            <StaggerItem>
              <Link
                href="#contato"
                className="group flex items-center gap-[0.5rem] text-[#af4d30] font-bold text-[1rem] mt-[1.5rem] border-b-[0.125rem] border-[#af4d30] pb-[0.25rem] hover:text-[#af4d30]/80 transition-colors"
              >
                Fale comigo
                <Image
                  src="/assets/5d608b56d555ee4071318aa304738e05c98a74cb.svg"
                  width={16}
                  height={16}
                  alt="arrow"
                  loading="lazy"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
