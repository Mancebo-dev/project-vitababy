import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function Services() {
  const baseServices = [
    {
      title: "Assistência Especializada",
      options: "1 opção",
      description:
        "Pacote de cuidados básicos, realizado de acordo com a necessidade da família.",
      price: null,
      icon: (
        <Image
          src="/assets/825b3088019920de508671e802e75260d01592df.svg"
          width={24}
          height={24}
          alt="Ícone Assistência"
          loading="lazy"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20",
    },
    {
      title: "Amamentação",
      options: "2 opções",
      description:
        "Apoio completo para estabelecer e manter o aleitamento materno com confiança e bem-estar.",
      price: "a partir de R$ 350",
      icon: (
        <Image
          src="/assets/46c592fdfb9c662b651317aeee2ba4b73bd5e2d7.svg"
          width={24}
          height={24}
          alt="Ícone Amamentação"
          loading="lazy"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#d19a7e]/20",
    },
    {
      title: "Banho Humanizado",
      options: "6 opções",
      description:
        "Técnica de banho terapêutico que remete ao ambiente uterino, promovendo calma, vínculo e bem-estar.",
      price: "a partir de R$ 120",
      icon: (
        <Image
          src="/assets/104e86cb37a567122753226d314286dead80a322.svg"
          width={24}
          height={24}
          alt="Ícone Banho Humanizado"
          loading="lazy"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20",
    },
  ];

  const services = [...baseServices, ...baseServices];

  return (
    <section
      id="servicos"
      className="py-[2rem] md:py-[3rem] bg-[#f5f3ef] min-h-[100vh] flex flex-col justify-center"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <StaggerContainer className="flex flex-col items-center text-center gap-[1rem]">
          <StaggerItem>
            <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30]">
              Nossos Serviços
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-heading text-[#411f03] leading-[1.2]">
              Cuidado humanizado e especializado
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-[1.125rem] text-[#444840] max-w-[35rem] leading-[1.6]">
              Soluções completas e acolhedoras para tornar sua jornada materna
              mais leve e confiante.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem] mt-[3rem] w-full">
          {services.map((service, index) => (
            <StaggerItem
              key={`${service.title}-${index}`}
              className="flex flex-col items-start bg-white border border-[#e4e2de] rounded-2xl p-[2rem] shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-[3rem] h-[3rem] rounded-full flex items-center justify-center mb-[1.5rem] ${service.iconBg}`}
              >
                {service.icon}
              </div>

              <div className="flex items-center gap-[0.75rem] mb-[1rem] w-full">
                <h3 className="text-[1.125rem] font-bold text-[#411f03]">
                  {service.title}
                </h3>
                <span className="bg-[#d19a7e]/20 text-[#d19a7e] text-[0.75rem] font-semibold px-[0.75rem] py-[0.25rem] rounded-full whitespace-nowrap ml-auto">
                  {service.options}
                </span>
              </div>

              <p className="text-[#444840] leading-[1.5rem] text-[0.9375rem] mb-[2rem] flex-1">
                {service.description}
              </p>

              <div className="w-full pt-[1.25rem] border-t border-[#e4e2de] flex items-center justify-between mt-auto">
                <span className="text-[#af4d30] font-bold text-[0.9375rem]">
                  {service.price || "Consulte opções"}
                </span>
                <Link
                  href={`/agendamento?servico=${encodeURIComponent(service.title)}`}
                  className="text-[0.8125rem] font-semibold text-[#411f03] hover:text-[#af4d30] flex items-center gap-1 transition-colors group"
                >
                  Agendar{" "}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
