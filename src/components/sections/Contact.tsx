import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contato" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white border border-border/50 rounded-[48px] p-8 md:p-16 shadow-lg">
          {/* Contact Info */}
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <span className="text-xs font-semibold text-accent tracking-widest uppercase">
                AGENDAR CONSULTORIA
              </span>
              <h2 className="text-4xl md:text-5xl font-heading text-secondary-foreground leading-tight">
                Vamos conversar?
              </h2>
              <p className="text-foreground/80 text-lg">
                Preencha o formulário ao lado ou entre em contato diretamente
                pelos nossos canais para tirar dúvidas ou agendar seu
                atendimento.
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full mt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-secondary-foreground">
                    WhatsApp
                  </span>
                  <span className="text-foreground/80">(73) 99999-9999</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-secondary-foreground">
                    E-mail
                  </span>
                  <span className="text-foreground/80">
                    contato@vitababy.com.br
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-secondary-foreground">
                    Endereço
                  </span>
                  <span className="text-foreground/80">
                    Atendimento em domicílio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col w-full">
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-secondary-foreground"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-secondary-foreground"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Seu e-mail"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-secondary-foreground"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="service"
                  className="text-sm font-semibold text-secondary-foreground"
                >
                  Serviço de interesse
                </label>
                <select
                  id="service"
                  className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="amamentacao">Amamentação</option>
                  <option value="banho">Banho Humanizado</option>
                  <option value="assistencia">Assistência Especializada</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-secondary-foreground"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Conte-nos como podemos ajudar..."
                />
              </div>

              <Button
                type="button"
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg text-lg mt-2"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
