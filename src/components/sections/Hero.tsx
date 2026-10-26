"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-[82vh] md:min-h-screen flex items-center overflow-hidden pt-[6.5rem] pb-[3rem] md:pt-[8.5rem] md:pb-[5rem]"
      style={{ contain: "layout style" }}
    >
      {/* Background Video full width */}
      <div className="absolute inset-0 w-full h-full z-0 bg-[#fbf9f5]">
        <video
          src="/assets/video-hero.mp4"
          poster="/assets/hero-img.png"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-[70%_20%]"
        />
        {/* Lateral gradient only for text readability on the left */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-gradient-to-r from-[#fbf9f5] via-[#fbf9f5]/70 to-transparent" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] relative z-10">
        <StaggerContainer
          delay={0.3}
          className="flex flex-col items-start gap-2.5 sm:gap-3.5 max-w-[44rem]"
        >
          {/* Badge */}
          <StaggerItem>
            <div className="flex items-center gap-2 bg-[#f2ede9]/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#e4e2de]/60">
              <Image
                src="/assets/6125dccb877dae7aebd49b272550598deb881168.svg"
                width={12}
                height={12}
                alt="badge icon"
                className="w-3 h-3 object-contain"
              />
              <span className="text-[11px] sm:text-xs font-semibold text-[#444840] tracking-wide uppercase">
                +800 Famílias Atendidas
              </span>
            </div>
          </StaggerItem>

          {/* Title — 2 estilos de fonte e 2 cores fiéis ao Figma */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.75rem] font-heading text-[#411f03] leading-[1.18] tracking-tight mt-0.5 mb-1 text-left animate-fade-in-up flex flex-col">
            <span>Um começo de vida</span>
            <span className="font-heading italic font-normal text-[#d19a7e]">
              tranquilo e amoroso
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#444840] leading-relaxed max-w-[26rem] sm:max-w-[32rem] mb-1 sm:mb-2">
            Assessoria especializada em amamentação, banho humanizado e cuidados
            com o bebê. Apoio dedicado para você e sua família nas fases mais
            importantes.
          </p>

          {/* Actions */}
          <StaggerItem className="w-full">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 w-full mt-2.5 sm:mt-4">
              <Link href="/agendamento" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl px-6 h-11 sm:h-12 bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold shadow-md text-sm sm:text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                  Agendar Assessoria
                  <Image
                    src="/assets/fadd198d26aadd8b0ee816378d8a8139f72021b1.svg"
                    width={9}
                    height={9}
                    alt="arrow"
                  />
                </Button>
              </Link>
              <Link href="#servicos" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl px-6 h-11 sm:h-12 border-2 border-[#411f03] text-[#411f03] font-semibold hover:bg-[#411f03]/10 bg-transparent text-sm sm:text-base transition-transform hover:scale-[1.02]"
                >
                  Ver Serviços
                </Button>
              </Link>
            </div>
          </StaggerItem>

          {/* Rating */}
          <StaggerItem>
            <div className="flex items-center gap-2 mt-1.5 sm:mt-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    key={star}
                    src="/assets/259059d849cd8bc63982bb72948c5259a5fe0521.svg"
                    width={13}
                    height={13}
                    alt="star"
                    loading="lazy"
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-bold text-[#1b1c19]">5.0</span>
                <span className="text-[#444840]">· +150 avaliações</span>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
