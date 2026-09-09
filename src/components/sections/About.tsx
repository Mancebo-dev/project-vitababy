import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function About() {
  return (
    <section
      id="sobre"
      className="py-[2rem] md:py-[3rem] bg-[#fbf9f5] min-h-[100vh] flex flex-col justify-center scroll-mt-[5rem]"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-[2.5rem] lg:gap-[4rem] items-center">
          {/* Video Player */}
          <StaggerItem className="relative w-full max-w-[28.125rem] aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-black border-[0.5rem] border-[#f5f3ef] mx-auto lg:mx-0 group cursor-pointer">
            <Image
              src="https://vitababy.com.br/images/rayane.png"
              alt="Rayane Castro"
              fill
              unoptimized
              loading="lazy"
              className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[4rem] h-[4rem] bg-[#d19a7e] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-[1.5rem] h-[1.5rem] text-white ml-[0.25rem]" />
              </div>
            </div>
          </StaggerItem>

          {/* Text Content */}
          <div className="flex flex-col items-start gap-[1rem]">
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
