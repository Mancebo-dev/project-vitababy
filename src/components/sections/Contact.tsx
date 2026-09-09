import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contato" className="py-[64px] md:py-[100px] bg-[#f5f3ef]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white border border-[#e4e2de] rounded-[48px] p-8 md:p-16 shadow-lg">
          {/* Contact Info */}
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-2">
              <span className="text-[12px] font-semibold text-[#d19a7e] tracking-[0.6px] uppercase">
                AGENDAR CONSULTORIA
              </span>
              <h2 className="text-[32px] md:text-[40px] font-heading text-[#411f03] leading-[1.2]">
                Vamos conversar?
              </h2>
              <p className="text-[#444840] text-[16px] leading-[24px] mt-2">
                Preencha o formulário ao lado ou entre em contato diretamente
                pelos nossos canais para tirar dúvidas ou agendar seu
                atendimento.
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full mt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <span className="text-[18px]">📱</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#411f03]">WhatsApp</span>
                  <span className="text-[#444840] text-[15px]">
                    (73) 99999-9999
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <span className="text-[18px]">✉️</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#411f03]">E-mail</span>
                  <span className="text-[#444840] text-[15px]">
                    contato@vitababy.com.br
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fbf9f5] flex items-center justify-center shrink-0 border border-[#e4e2de]">
                  <span className="text-[18px]">📍</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#411f03]">Endereço</span>
                  <span className="text-[#444840] text-[15px]">
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
                  className="text-[14px] font-semibold text-[#411f03]"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-2xl px-4 py-3 outline-none focus:border-[#d19a7e] transition-colors text-[15px]"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[14px] font-semibold text-[#411f03]"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-2xl px-4 py-3 outline-none focus:border-[#d19a7e] transition-colors text-[15px]"
                    placeholder="Seu e-mail"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-[14px] font-semibold text-[#411f03]"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-2xl px-4 py-3 outline-none focus:border-[#d19a7e] transition-colors text-[15px]"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="service"
                  className="text-[14px] font-semibold text-[#411f03]"
                >
                  Serviço de interesse
                </label>
                <select
                  id="service"
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-2xl px-4 py-3 outline-none focus:border-[#d19a7e] transition-colors appearance-none text-[15px] text-[#444840]"
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
                  className="text-[14px] font-semibold text-[#411f03]"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-2xl px-4 py-3 outline-none focus:border-[#d19a7e] transition-colors resize-none text-[15px]"
                  placeholder="Conte-nos como podemos ajudar..."
                />
              </div>

              <Button
                type="button"
                className="w-full rounded-full h-[56px] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-bold shadow-lg text-[16px] mt-2"
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
