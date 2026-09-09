import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      text: `"A consultoria de amamentação salvou nossa jornada. A Rayane foi extremamente paciente, técnica e acolhedora num momento de muita fragilidade nossa. Gratidão eterna!"`,
      name: "Mariana Silva",
      role: "Mãe do João (2 meses)",
      avatar: "M",
    },
    {
      text: `"O banho humanizado foi uma experiência mágica. Me sinto muito mais segura agora. Recomendo para todas as mamães."`,
      name: "Letícia Almeida",
      role: "Mãe da Laura (1 mês)",
      avatar: "L",
    },
    {
      text: `"A tranquilidade e a postura da educadora nos preparou para a chegada da nossa pequena de forma muito mais segura. O parto humanizado é realmente um presente."`,
      name: "Camila Oliveira",
      role: "Mãe da Sofia (15 dias)",
      avatar: "C",
    },
  ];

  return (
    <section id="depoimentos" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">
            DEPOIMENTOS
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-secondary-foreground">
            O que as famílias dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-border/50 rounded-[48px] p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-accent fill-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground/80 italic leading-relaxed mb-8">
                  {testimonial.text}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-secondary-foreground">
                    {testimonial.name}
                  </span>
                  <span className="text-sm text-foreground/70">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
