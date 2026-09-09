import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[40rem] flex items-center overflow-hidden pb-[4rem] pt-[8.75rem] px-[1.5rem]"
    >
      {/* Background Video full width */}
      <div className="absolute inset-0 w-full h-full z-0 bg-black">
        <video
          src="/assets/video-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[70%_20%]"
        />
        {/* Lateral gradient only for text readability on the left */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-gradient-to-r from-[#fbf9f5] via-[#fbf9f5]/70 to-transparent" />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] relative z-10">
        <div className="flex flex-col items-start gap-[1rem] max-w-[48rem]">
          {/* Badge */}
          <div className="flex items-center gap-[0.5rem] bg-[#f2ede9] px-[1rem] py-[0.5rem] rounded-full">
            <Image
              src="/assets/6125dccb877dae7aebd49b272550598deb881168.svg"
              width={12}
              height={12}
              alt="badge icon"
              loading="lazy"
            />
            <span className="text-[0.75rem] font-semibold text-[#444840] tracking-[0.0375rem] uppercase">
              +300 Famílias Atendidas
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading text-[#411f03] leading-[1.1] mt-[0.5rem] mb-[0.5rem]">
            Um começo de vida <br className="hidden md:block" />
            <span className="text-[#d19a7e] italic font-normal">
              tranquilo e amoroso
            </span>
          </h1>

          {/* Description */}
          <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-[#444840] leading-[1.6] max-w-[32rem] mb-[1rem]">
            Assessoria especializada em amamentação, banho humanizado, primeiros
            socorros para bebês, entre outros. Apoio especializado para você e
            sua família nas fases mais importantes.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-[1rem] w-full mt-[1.5rem]">
            <Button className="rounded-xl px-[2rem] h-[3.5rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold shadow-lg text-[1rem] flex items-center gap-[0.5rem]">
              Agendar Consultoria
              <Image
                src="/assets/fadd198d26aadd8b0ee816378d8a8139f72021b1.svg"
                width={9}
                height={9}
                alt="arrow"
                loading="lazy"
              />
            </Button>
            <Button
              variant="outline"
              className="rounded-xl px-[2rem] h-[3.5rem] border-[0.125rem] border-[#411f03] text-[#411f03] font-semibold hover:bg-[#411f03]/10 bg-transparent text-[1rem]"
            >
              Ver Serviços
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-[0.75rem] mt-[1.5rem]">
            <div className="flex gap-[0.25rem]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src="/assets/259059d849cd8bc63982bb72948c5259a5fe0521.svg"
                  width={15}
                  height={15}
                  alt="star"
                  loading="lazy"
                />
              ))}
            </div>
            <div className="flex items-center gap-[0.5rem]">
              <span className="font-bold text-[#1b1c19] text-[1rem]">5.0</span>
              <span className="text-[#444840] text-[1rem]">
                · +150 avaliações
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
