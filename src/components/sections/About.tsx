import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function About() {
  return (
    <section id="sobre" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image/Video Placeholder */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl bg-black border-8 border-background">
            {/* The design specifies a black box or video placeholder. We'll add an image just in case */}
            <Image
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Mãe e bebê"
              fill
              unoptimized
              className="object-cover opacity-80 mix-blend-luminosity"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-start gap-6">
            <span className="text-xs font-semibold text-accent tracking-widest uppercase">
              SOBRE MIM
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-secondary-foreground leading-tight">
              Rayane Castro e a missão da Vitababy
            </h2>

            <div className="flex flex-col gap-4 text-foreground/80 text-lg leading-relaxed">
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
              className="group flex items-center gap-2 text-primary font-bold text-lg mt-4 border-b-2 border-primary pb-1 hover:text-primary/80 hover:border-primary/80 transition-colors"
            >
              Fale comigo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
