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
        />
      ),
      iconBg: "bg-[#5f6f52]/20",
    },
  ];

  // Figma design shows 6 cards (duplicated for visual)
  const services = [...baseServices, ...baseServices];

  return (
    <section id="servicos" className="py-[64px] md:py-[100px] bg-[#f5f3ef]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="text-[12px] font-semibold text-[#d19a7e] tracking-[0.6px] uppercase">
            O QUE OFERECEMOS
          </span>
          <h2 className="text-[32px] md:text-[40px] font-heading text-[#411f03]">
            Serviços especializados
          </h2>
          <p className="text-[#444840] text-[16px] max-w-[672px] mt-2">
            Cada família é única. Nossas assessorias são personalizadas e
            baseadas em evidências científicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="flex flex-col items-start bg-white border border-[#e4e2de] rounded-[48px] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${service.iconBg}`}
              >
                {service.icon}
              </div>

              <div className="flex items-center gap-3 mb-4 w-full">
                <h3 className="text-[18px] font-bold text-[#411f03]">
                  {service.title}
                </h3>
                <span className="bg-[#d19a7e]/20 text-[#d19a7e] text-[12px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-auto">
                  {service.options}
                </span>
              </div>

              <p className="text-[#444840] leading-[24px] text-[15px] mb-8 flex-1">
                {service.description}
              </p>

              {service.price && (
                <div className="w-full pt-6 border-t border-[#e4e2de]">
                  <span className="text-[#d19a7e] font-bold text-[14px]">
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
