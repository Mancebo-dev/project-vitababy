import Image from "next/image";
import Link from "next/link";

export function About() {
  return (
    <section id="sobre" className="py-[64px] md:py-[100px] bg-[#fbf9f5]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image/Video Placeholder */}
          <div className="relative w-full max-w-[450px] aspect-square md:aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl bg-black border-8 border-[#f5f3ef] mx-auto lg:mx-0">
            <Image
              src="https://vitababy.com.br/images/rayane.png"
              alt="Rayane Castro"
              fill
              unoptimized
              className="object-cover opacity-90"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-start gap-4">
            <span className="text-[12px] font-semibold text-[#d19a7e] tracking-[0.6px] uppercase">
              SOBRE MIM
            </span>
            <h2 className="text-[32px] md:text-[40px] font-heading text-[#411f03] leading-[1.2]">
              Rayane Castro e a missão da Vitababy
            </h2>

            <div className="flex flex-col gap-4 text-[#444840] text-[16px] md:text-[18px] leading-[28px] mt-2">
              <p>
                Com mais de 9 anos de experiência em cuidados materno-infantis,
                minha missão é acolher e guiar famílias em um dos momentos mais
                transformadores da vida.
              </p>
              <p>
                Na Vitababy, acreditamos que a informação baseada em evidências,
                aliada à empatia e ao respeito pela individualidade de cada
                família, é a chave para uma parentalidade mais leve e segura.
                Nossos serviços são desenhados para proporcionar conforto,
                confiança e suporte em cada etapa dessa jornada.
              </p>
            </div>

            <Link
              href="#contato"
              className="group flex items-center gap-2 text-[#af4d30] font-bold text-[16px] mt-6 border-b-2 border-[#af4d30] pb-1 hover:text-[#af4d30]/80 transition-colors"
            >
              Fale comigo
              <Image
                src="/assets/5d608b56d555ee4071318aa304738e05c98a74cb.svg"
                width={16}
                height={16}
                alt="arrow"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
