import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

const steps = [
  {
    number: "1",
    title: "Agende sua assessoria",
    description:
      "Escolha o serviço ideal para o seu momento e selecione o melhor horário para o nosso encontro, seja online ou presencial.",
    icon: "/assets/fadd198d26aadd8b0ee816378d8a8139f72021b1.svg",
  },
  {
    number: "2",
    title: "Converse com a especialista",
    description:
      "Uma consulta personalizada e acolhedora, onde entenderemos suas reais necessidades e os desafios da sua família.",
    icon: "/assets/5d608b56d555ee4071318aa304738e05c98a74cb.svg",
  },
  {
    number: "3",
    title: "Plano personalizado",
    description:
      "Saia do atendimento com um plano de ação claro, baseado em evidências científicas e focado no bem-estar do bebê e da mãe.",
    icon: "/assets/6125dccb877dae7aebd49b272550598deb881168.svg",
  },
  {
    number: "4",
    title: "Acompanhamento",
    description:
      "Suporte contínuo para garantir que as orientações sejam aplicadas com sucesso e segurança no dia a dia.",
    icon: "/assets/9e1bfaf7fa976bd77bf774edd751cdee7ee3a0d1.svg", // whatsapp icon
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-[5rem] lg:py-[7.5rem] bg-white scroll-mt-[5rem]"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <StaggerContainer className="flex flex-col items-center text-center gap-[1rem] mb-[4rem]">
          <StaggerItem>
            <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30]">
              Passo a Passo
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-heading text-[#411f03] leading-[1.2]">
              Como funciona o nosso atendimento
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2rem] relative">
          {/* Decorative Line for Desktop */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-[0.125rem] bg-[#e4e2de] z-0" />

          {steps.map((step) => (
            <StaggerItem
              key={step.number}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-[7rem] h-[7rem] rounded-full bg-[#fbf9f5] border-[0.5rem] border-white flex items-center justify-center shadow-lg mb-[1.5rem] group-hover:scale-110 group-hover:border-[#f2ede9] transition-all duration-300">
                <span className="text-[2.5rem] font-heading font-bold text-[#d19a7e]">
                  {step.number}
                </span>
              </div>
              <h3 className="text-[1.25rem] font-bold text-[#411f03] mb-[1rem]">
                {step.title}
              </h3>
              <p className="text-[#444840] leading-[1.6]">{step.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
