import { Check } from "lucide-react";
import Link from "next/link";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";
import type { ServiceWithPackages } from "./Services";

interface PricingProps {
  initialServices?: ServiceWithPackages[];
}

export function Pricing({ initialServices }: PricingProps) {
  const services = initialServices || [];

  // Filter services that actually have packages to display
  const servicesWithPackages = services.filter(
    (s) => s.packages && s.packages.length > 0,
  );

  if (servicesWithPackages.length === 0) return null;

  return (
    <section id="planos" className="py-[3rem] md:py-[4.5rem] bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="text-center mb-[4rem]">
          <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30] mb-2 block">
            Nossos Planos
          </span>
          <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-heading text-[#411f03] leading-[1.2] max-w-[40rem] mx-auto">
            Escolha o cuidado ideal para sua família
          </h2>
          <p className="text-[1.125rem] text-[#444840] max-w-[35rem] mx-auto mt-4 leading-[1.6]">
            Pacotes pensados para diferentes momentos e necessidades, com a
            qualidade e o carinho que vocês merecem.
          </p>
        </div>

        <div className="flex flex-col gap-[4rem]">
          {servicesWithPackages.map((service, _sIdx) => (
            <div key={service.id} className="w-full">
              <h3 className="text-2xl font-bold text-[#411f03] mb-6 border-b border-[#e4e2de] pb-2">
                {service.name}
              </h3>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem]">
                {service.packages.map((pkg, _pIdx) => (
                  <StaggerItem
                    key={pkg.id}
                    className={`relative flex flex-col bg-white rounded-2xl p-[2rem] border ${
                      pkg.isHighlighted
                        ? "border-[#af4d30] shadow-md scale-[1.02]"
                        : "border-[#e4e2de] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                    }`}
                  >
                    {pkg.isHighlighted && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#af4d30] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                        Mais Escolhido
                      </div>
                    )}

                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-[#411f03] mb-2">
                        {pkg.name}
                      </h4>
                      <p className="text-sm text-[#7d7a75] min-h-[40px]">
                        {pkg.description || `Plano de ${pkg.name}`}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-heading font-bold text-[#411f03]">
                          R${" "}
                          {pkg.price
                            ? pkg.price.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })
                            : "Consulte"}
                        </span>
                      </div>
                      {pkg.billingCycle && (
                        <p className="text-sm text-[#7d7a75] mt-1">
                          {pkg.billingCycle}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      {pkg.features && (
                        <ul className="space-y-3 mb-8">
                          {pkg.features
                            .split("\n")
                            .filter((f) => f.trim())
                            .map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-[#444840]"
                              >
                                <Check className="w-4 h-4 text-[#af4d30] shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>

                    <Link
                      href={`/agendamento?servico=${encodeURIComponent(service.name)}&plano=${encodeURIComponent(pkg.name)}`}
                      className={`w-full text-center py-3 rounded-xl font-semibold transition-colors mt-auto ${
                        pkg.isHighlighted
                          ? "bg-[#af4d30] text-white hover:bg-[#8c3d26]"
                          : "bg-[#f5f3ef] text-[#411f03] hover:bg-[#e4e2de]"
                      }`}
                    >
                      Agendar Assessoria
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
