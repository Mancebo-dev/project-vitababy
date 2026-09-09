import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-start gap-6 max-w-xl">
            {/* Badge */}
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-xs font-semibold text-secondary-foreground tracking-wider uppercase">
                +300 Famílias Atendidas
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-heading text-secondary-foreground leading-tight">
              Um começo de vida <br className="hidden md:block" />
              <span className="text-accent italic font-normal">
                tranquilo e amoroso
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-foreground/80 leading-relaxed">
              Assessoria especializada em amamentação, banho humanizado,
              primeiros socorros para bebês, entre outros. Apoio especializado
              para você e sua família nas fases mais importantes.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 w-full sm:w-auto">
              <Button className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg text-base w-full sm:w-auto flex items-center gap-2">
                Agendar Consultoria
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 border-2 border-secondary-foreground text-secondary-foreground font-semibold hover:bg-secondary text-base w-full sm:w-auto"
              >
                Ver Serviços
              </Button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 text-accent fill-accent"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <span className="font-bold text-foreground">5.0</span>
                <span className="text-foreground/70">· +150 avaliações</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-[32px] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Rayane Castro - Profissional de Consultoria Materna"
              fill
              unoptimized
              className="object-cover object-top"
            />
            {/* Gradient Overlay for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
