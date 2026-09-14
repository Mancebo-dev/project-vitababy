import Image from "next/image";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

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
    <section
      id="depoimentos"
      className="py-[2rem] md:py-[3rem] bg-[#fbf9f5] min-h-[100vh] flex flex-col justify-center"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <StaggerContainer className="flex flex-col items-start gap-[1rem] mb-[3rem]">
          <StaggerItem>
            <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30]">
              Depoimentos
            </span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-heading text-[#411f03] leading-[1.2]">
              Histórias de amor e dedicação
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">
          {testimonials.map((testimonial) => (
            <StaggerItem
              key={testimonial.name}
              className="bg-white border border-[#e4e2de] rounded-2xl p-[2rem] shadow-sm flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex gap-[0.25rem] mb-[1.5rem]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                      key={star}
                      src="/assets/259059d849cd8bc63982bb72948c5259a5fe0521.svg"
                      width={15}
                      height={15}
                      alt="star"
                      loading="lazy"
                      style={{ width: "auto", height: "auto" }}
                    />
                  ))}
                </div>
                <p className="text-[#444840] text-[0.9375rem] italic leading-[1.5rem] mb-[2rem]">
                  {testimonial.text}
                </p>
              </div>

              <div className="flex items-center gap-[1rem]">
                <div className="w-[3rem] h-[3rem] rounded-full bg-[#f2ede9] text-[#411f03] flex items-center justify-center font-bold text-[1.125rem]">
                  {testimonial.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#411f03]">
                    {testimonial.name}
                  </span>
                  <span className="text-[0.875rem] text-[#444840]">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
