import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Contact() {
  return (
    <section
      id="contato"
      className="py-[2rem] md:py-[3rem] bg-[#f5f3ef] min-h-[100vh] flex flex-col justify-center"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4rem] bg-white border border-[#e4e2de] rounded-2xl p-[2rem] md:p-[4rem] shadow-lg">
          {/* Contact Info */}
          <div className="flex flex-col items-start gap-[2rem]">
            <div className="flex flex-col items-start gap-[0.5rem]">
              <span className="text-[clamp(0.75rem,1vw,1rem)] font-semibold text-[#d19a7e] tracking-[0.0375rem] uppercase">
                AGENDAR CONSULTORIA
              </span>
              <h2 className="text-[clamp(2rem,3vw,3rem)] font-heading text-[#411f03] leading-[1.2]">
                Vamos conversar?
              </h2>
              <p className="text-[#444840] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.6] mt-[0.5rem]">
                Preencha o formulário ao lado ou entre em contato diretamente
                pelos nossos canais para tirar dúvidas ou agendar seu
                atendimento.
              </p>
            </div>

            <div className="flex flex-col gap-[1.5rem] w-full mt-[1rem]">
              <div className="flex items-start gap-[1.5rem]">
                <div className="w-[3rem] h-[3rem] rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <Image
                    src="/assets/9e1bfaf7fa976bd77bf774edd751cdee7ee3a0d1.svg"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[1.25rem] font-semibold text-[#411f03]">
                    WhatsApp
                  </span>
                  <span className="text-[#444840] text-[0.9375rem]">
                    (73) 99999-9999
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-[1.5rem]">
                <div className="w-[3rem] h-[3rem] rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <Image
                    src="/assets/c7fa13903db9fc77032fcaf0f1758dadccdbb838.svg"
                    alt="Email"
                    width={20}
                    height={16}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[1.25rem] font-semibold text-[#411f03]">
                    E-mail
                  </span>
                  <span className="text-[#444840] text-[0.9375rem]">
                    contato@vitababy.com.br
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-[1.5rem]">
                <div className="w-[3rem] h-[3rem] rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <Image
                    src="/assets/e53de8f49243c0b6bf42535cff56291aa1476a6d.svg"
                    alt="Localização"
                    width={16}
                    height={20}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[1.25rem] font-semibold text-[#411f03]">
                    Endereço
                  </span>
                  <span className="text-[#444840] text-[0.9375rem]">
                    Atendimento em domicílio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col w-full">
            <form className="flex flex-col gap-[1.5rem]">
              <div className="flex flex-col gap-[0.5rem]">
                <label
                  htmlFor="name"
                  className="text-[0.875rem] font-semibold text-[#411f03]"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-[1rem] px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
                <div className="flex flex-col gap-[0.5rem]">
                  <label
                    htmlFor="email"
                    className="text-[0.875rem] font-semibold text-[#411f03]"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                    placeholder="Seu e-mail"
                  />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                  <label
                    htmlFor="phone"
                    className="text-[0.875rem] font-semibold text-[#411f03]"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <span className="text-[0.875rem] font-semibold text-[#444840]">
                  Qual serviço você procura?
                </span>
                <div className="relative w-full">
                  <Select>
                    <SelectTrigger className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[1.25rem] outline-none focus:ring-1 focus:ring-[#d19a7e] transition-colors text-[0.9375rem] text-[#444840] shadow-none">
                      <SelectValue placeholder="Selecione uma opção..." />
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      className="bg-white border-[#e4e2de] rounded-lg shadow-xl"
                    >
                      <SelectItem
                        value="amamentacao"
                        className="cursor-pointer hover:bg-[#f5f3ef] focus:bg-[#f5f3ef] py-[0.75rem]"
                      >
                        Amamentação
                      </SelectItem>
                      <SelectItem
                        value="banho"
                        className="cursor-pointer hover:bg-[#f5f3ef] focus:bg-[#f5f3ef] py-[0.75rem]"
                      >
                        Banho Humanizado
                      </SelectItem>
                      <SelectItem
                        value="socorros"
                        className="cursor-pointer hover:bg-[#f5f3ef] focus:bg-[#f5f3ef] py-[0.75rem]"
                      >
                        Primeiros Socorros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <label
                  htmlFor="message"
                  className="text-[0.875rem] font-semibold text-[#411f03]"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors resize-none text-[0.9375rem]"
                  placeholder="Conte-nos como podemos ajudar..."
                />
              </div>

              <Button
                type="button"
                className="w-full rounded-xl h-[3.5rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-bold shadow-lg text-[1rem] mt-[0.5rem]"
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
