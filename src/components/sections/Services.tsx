import type { Prisma } from "@prisma/client";
import {
  Award,
  ChevronRight,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  SunMedium,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export type ServiceWithPackages = Prisma.ServiceGetPayload<{
  include: { packages: true };
}>;

interface ServicesProps {
  initialServices?: ServiceWithPackages[];
}

function getServiceVisuals(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("amamenta")) {
    return {
      icon: (
        <Image
          src="/assets/46c592fdfb9c662b651317aeee2ba4b73bd5e2d7.svg"
          width={24}
          height={24}
          alt="Ícone Amamentação"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
    };
  }

  if (lower.includes("banho")) {
    return {
      icon: (
        <Image
          src="/assets/104e86cb37a567122753226d314286dead80a322.svg"
          width={24}
          height={24}
          alt="Ícone Banho Humanizado"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20 text-[#5f6f52]",
    };
  }

  if (lower.includes("socorro") || lower.includes("emergênc")) {
    return {
      icon: <HeartPulse className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#ae4d30]/15 text-[#ae4d30]",
    };
  }

  if (lower.includes("pós-parto") || lower.includes("assistência")) {
    return {
      icon: (
        <Image
          src="/assets/825b3088019920de508671e802e75260d01592df.svg"
          width={24}
          height={24}
          alt="Ícone Assistência Especializada"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20 text-[#5f6f52]",
    };
  }

  if (
    lower.includes("lóbulo") ||
    lower.includes("furinho") ||
    lower.includes("brinco")
  ) {
    return {
      icon: <Sparkles className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
    };
  }

  if (lower.includes("laser") || lower.includes("cicatriza")) {
    return {
      icon: <SunMedium className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#ae4d30]/15 text-[#ae4d30]",
    };
  }

  if (lower.includes("integral") || lower.includes("premium")) {
    return {
      icon: <Award className="w-6 h-6 text-[#411f03]" />,
      iconBg: "bg-[#411f03]/10 text-[#411f03]",
    };
  }

  return {
    icon: <HeartHandshake className="w-6 h-6 text-[#ae4d30]" />,
    iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
  };
}

function formatPriceAndOptions(service: ServiceWithPackages) {
  const pkgs = service.packages || [];
  const count = pkgs.length;
  const options =
    count === 1 ? "1 opção" : count > 1 ? `${count} opções` : "Sob consulta";

  const validPrices = pkgs
    .map((p) => p.price)
    .filter((pr): pr is number => typeof pr === "number" && pr > 0);

  let price = "Consulte opções";
  if (validPrices.length > 0) {
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    if (minPrice === maxPrice || validPrices.length === 1) {
      price = `R$ ${minPrice.toLocaleString("pt-BR")}`;
    } else {
      price = `a partir de R$ ${minPrice.toLocaleString("pt-BR")}`;
    }
  }

  return { options, price };
}

export function Services({ initialServices }: ServicesProps) {
  // If database services are supplied and not empty, use them
  const servicesToRender =
    initialServices && initialServices.length > 0
      ? initialServices.map((service) => {
          const { icon, iconBg } = getServiceVisuals(service.name);
          const { options, price } = formatPriceAndOptions(service);
          return {
            id: service.id,
            title: service.name,
            options,
            description:
              service.description ||
              "Cuidado especializado e humanizado para mãe e bebê.",
            price,
            icon,
            iconBg,
          };
        })
      : [
          {
            id: "amamentacao",
            title: "Consultoria em Amamentação",
            options: "2 opções",
            description:
              "Apoio completo para estabelecer e manter o aleitamento materno com confiança, conforto e bem-estar para mãe e bebê.",
            price: "a partir de R$ 350",
            icon: (
              <Image
                src="/assets/46c592fdfb9c662b651317aeee2ba4b73bd5e2d7.svg"
                width={24}
                height={24}
                alt="Ícone Amamentação"
                loading="lazy"
                className="w-6 h-6 object-contain"
                style={{ width: 24, height: 24 }}
              />
            ),
            iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
          },
          {
            id: "banho",
            title: "Banho Humanizado do Bebê",
            options: "6 opções",
            description:
              "Técnica de banho terapêutico que recria as sensações do ambiente intrauterino, promovendo calma, vínculo e relaxamento.",
            price: "a partir de R$ 120",
            icon: (
              <Image
                src="/assets/104e86cb37a567122753226d314286dead80a322.svg"
                width={24}
                height={24}
                alt="Ícone Banho Humanizado"
                loading="lazy"
                className="w-6 h-6 object-contain"
                style={{ width: 24, height: 24 }}
              />
            ),
            iconBg: "bg-[#5f6f52]/20 text-[#5f6f52]",
          },
          {
            id: "socorros",
            title: "Primeiros Socorros para Bebês",
            options: "2 opções",
            description:
              "Treinamento prático e teórico domiciliar para pais e cuidadores agirem com segurança e rapidez em situações de emergência.",
            price: "a partir de R$ 200",
            icon: <HeartPulse className="w-6 h-6 text-[#ae4d30]" />,
            iconBg: "bg-[#ae4d30]/15 text-[#ae4d30]",
          },
        ];

  return (
    <section
      id="servicos"
      className="py-[3rem] md:py-[4.5rem] bg-[#f5f3ef] min-h-[100vh] flex flex-col justify-center"
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
              mais leve, segura e confiante.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem] mt-[3rem] w-full">
          {servicesToRender.map((service, index) => (
            <StaggerItem
              key={`${service.id}-${index}`}
              className="flex flex-col items-start bg-white border border-[#e4e2de] rounded-2xl p-[2rem] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
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
                <span className="bg-[#d19a7e]/20 text-[#af4d30] text-[0.75rem] font-semibold px-[0.75rem] py-[0.25rem] rounded-full whitespace-nowrap ml-auto">
                  {service.options}
                </span>
              </div>

              <p className="text-[#444840] leading-[1.5rem] text-[0.9375rem] mb-[2rem] flex-1">
                {service.description}
              </p>

              <div className="w-full pt-[1.25rem] border-t border-[#e4e2de] flex items-center justify-between mt-auto">
                <span className="text-[#af4d30] font-bold text-[0.9375rem]">
                  {service.price}
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
