import { Baby, Droplets, Heart } from "lucide-react";

export function Services() {
  const services = [
    {
      title: "Assistência Especializada",
      options: "1 opção",
      description:
        "Pacote de cuidados básicos, realizado de acordo com a necessidade da família.",
      price: null,
      icon: <Heart className="w-6 h-6 text-primary" />,
      iconBg: "bg-primary/20",
    },
    {
      title: "Amamentação",
      options: "2 opções",
      description:
        "Apoio completo para estabelecer e manter o aleitamento materno com confiança e bem-estar.",
      price: "a partir de R$ 350",
      icon: <Baby className="w-6 h-6 text-accent" />,
      iconBg: "bg-accent/30",
    },
    {
      title: "Banho Humanizado",
      options: "6 opções",
      description:
        "Técnica de banho terapêutico que remete ao ambiente uterino, promovendo calma, vínculo e bem-estar.",
      price: "a partir de R$ 120",
      icon: <Droplets className="w-6 h-6 text-primary" />,
      iconBg: "bg-primary/20",
    },
  ];

  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">
            O QUE OFERECEMOS
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-secondary-foreground">
            Serviços especializados
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl">
            Cada família é única. Nossas assessorias são personalizadas e
            baseadas em evidências científicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-start bg-white border border-border/50 rounded-[48px] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${service.iconBg}`}
              >
                {service.icon}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-secondary-foreground">
                  {service.title}
                </h3>
                <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {service.options}
                </span>
              </div>

              <p className="text-foreground/80 leading-relaxed mb-8 flex-1">
                {service.description}
              </p>

              {service.price && (
                <div className="w-full pt-6 border-t border-border/50">
                  <span className="text-accent font-bold">{service.price}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
