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
      className="py-16 md:py-24 lg:py-28 min-h-[85vh] lg:min-h-screen bg-white scroll-mt-20 flex flex-col justify-center"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <StaggerContainer className="flex flex-col items-center text-center gap-2 mb-10 md:mb-14">
          <StaggerItem>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-[#411f03] leading-tight tracking-tight">
              Como funciona o nosso atendimento
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xs sm:text-sm md:text-base text-[#5c5954] max-w-xl mx-auto mt-1 leading-relaxed">
              Um processo simples, acolhedor e seguro desde o primeiro contato
              até o acompanhamento diário.
            </p>
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#fbf9f5] border-[6px] border-white flex items-center justify-center shadow-md mb-4 group-hover:scale-105 group-hover:border-[#f2ede9] transition-all duration-300">
                <span className="text-2xl sm:text-3xl font-heading font-bold text-[#d19a7e]">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#411f03] mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#444840] leading-relaxed">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
