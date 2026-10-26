import Image from "next/image";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function About() {
  return (
    <section
      id="sobre"
      className="bg-[#fbf9f5] pt-16 md:pt-20 lg:pt-24 pb-0 flex flex-col justify-end min-h-[85vh] lg:min-h-screen scroll-mt-20 overflow-hidden relative"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] flex-1 flex flex-col justify-end">
        <StaggerContainer className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-end">
          {/* Image */}
          <StaggerItem className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] lg:h-[640px] xl:h-[700px] 2xl:h-[750px] mx-auto lg:mx-0 order-2 lg:order-1 flex items-end justify-center lg:justify-start self-end">
            <Image
              src="/assets/rayane-about.png"
              alt="Rayane Castro"
              fill
              unoptimized
              loading="lazy"
              className="object-contain object-bottom translate-y-[2px]"
            />
          </StaggerItem>

          {/* Text Content */}
          <div className="flex flex-col justify-center items-start gap-4 order-1 lg:order-2 lg:self-center py-8 lg:py-16">
            <StaggerItem>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-[#411f03] leading-tight tracking-tight">
                Rayane Castro: cuidado com ciência, acolhimento e
                profissionalismo.
              </h2>
            </StaggerItem>

            <StaggerItem className="flex flex-col gap-3 text-[#444840] text-sm sm:text-base leading-relaxed">
              <p>
                Com mais de 9 anos de experiência na enfermagem, sou
                especializada em cuidados humanizados para bebês e famílias.
                Ofereço assessoria em amamentação, banho humanizado e
                capacitação em primeiros socorros.
              </p>
              <p>
                Minha missão é proporcionar segurança, vínculo e bem-estar para
                cada família, com um olhar técnico e acolhedor que transforma a
                jornada materna.
              </p>
            </StaggerItem>

            <StaggerItem>
              <Link
                href="#contato"
                className="group inline-flex items-center gap-2 text-[#af4d30] font-bold text-sm sm:text-base mt-2 border-b-2 border-[#af4d30] pb-1 hover:text-[#af4d30]/80 transition-colors"
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
