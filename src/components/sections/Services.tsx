import Image from "next/image";

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
        <div className="flex flex-col items-center text-center gap-[0.5rem] mb-[3rem]">
          <span className="text-[clamp(0.75rem,1vw,1rem)] font-semibold text-[#d19a7e] tracking-[0.0375rem] uppercase">
            O QUE OFERECEMOS
          </span>
          <h2 className="text-[clamp(2rem,3vw,3rem)] font-heading text-[#411f03]">
            Serviços especializados
          </h2>
          <p className="text-[#444840] text-[clamp(1rem,1.5vw,1.25rem)] max-w-[42rem] mt-[0.5rem]">
            Cada família é única. Nossas assessorias são personalizadas e
            baseadas em evidências científicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]">
          {services.map((service, index) => (
            <div
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

              {service.price && (
                <div className="w-full pt-[1.5rem] border-t border-[#e4e2de]">
                  <span className="text-[#d19a7e] font-bold text-[0.875rem]">
                    {service.price}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
