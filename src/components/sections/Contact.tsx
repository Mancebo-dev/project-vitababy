"use client";

import Image from "next/image";
import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

export function Contact() {
  const [state, formAction, pending] = useActionState(submitContactForm, null);
  return (
    <section
      id="contato"
      className="py-[2rem] md:py-[3rem] bg-[#f5f3ef] min-h-[100vh] flex flex-col justify-center scroll-mt-[5rem]"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4rem] bg-white border border-[#e4e2de] rounded-2xl p-[2rem] md:p-[4rem] shadow-lg">
          {/* Informações de Contato */}
          <StaggerContainer className="flex flex-col gap-[2.5rem]">
            <div className="flex flex-col gap-[1rem]">
              <StaggerItem>
                <span className="uppercase tracking-widest text-[0.875rem] font-bold text-[#af4d30]">
                  Fale Conosco
                </span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="text-[clamp(2rem,3vw,2.5rem)] font-heading text-[#411f03] leading-[1.2]">
                  Como podemos ajudar?
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="text-[1.125rem] text-[#444840] leading-[1.6]">
                  Entre em contato conosco para tirar dúvidas, agendar um
                  serviço ou saber mais sobre como podemos ajudar.
                </p>
              </StaggerItem>
            </div>

            <div className="flex flex-col gap-[1.5rem] w-full mt-[1rem]">
              <StaggerItem className="flex items-start gap-[1.5rem]">
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
              </StaggerItem>

              <StaggerItem className="flex items-start gap-[1.5rem]">
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
              </StaggerItem>

              <StaggerItem className="flex items-start gap-[1.5rem]">
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
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* Contact Form */}
          <div className="flex flex-col w-full">
            <form action={formAction} className="flex flex-col gap-[1.5rem]">
              {state?.success && (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-200">
                  {state.success}
                </div>
              )}
              {state?.error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
                  {state.error}
                </div>
              )}

              <div className="flex flex-col gap-[0.5rem]">
                <label
                  htmlFor="name"
                  className="text-[0.875rem] font-semibold text-[#411f03]"
                >
                  Nome completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
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
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                    placeholder="Seu e-mail"
                  />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                  <label
                    htmlFor="phone"
                    className="text-[0.875rem] font-semibold text-[#411f03]"
                  >
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <label
                  htmlFor="service"
                  className="text-[0.875rem] font-semibold text-[#411f03]"
                >
                  Qual serviço você procura?
                </label>
                <input
                  type="text"
                  id="service"
                  name="service"
                  className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] outline-none focus:border-[#d19a7e] transition-colors text-[0.9375rem]"
                  placeholder="Ex: Consultoria de Sono, Amamentação..."
                />
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#411f03] font-semibold text-[0.875rem] mb-[0.5rem]"
                  >
                    Como podemos te ajudar? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-[#fbf9f5] border border-[#e4e2de] rounded-xl px-[1rem] py-[0.75rem] text-[#444840] focus:outline-none focus:border-[#d19a7e] focus:ring-1 focus:ring-[#d19a7e] transition-all resize-none"
                    placeholder="Descreva brevemente o que você precisa..."
                  ></textarea>
                </div>

                <div className="flex flex-row items-start gap-[0.5rem]">
                  <input
                    type="checkbox"
                    id="lgpd"
                    required
                    className="mt-[0.25rem] w-4 h-4 accent-[#af4d30]"
                  />
                  <label
                    htmlFor="lgpd"
                    className="text-[#444840] text-[0.75rem] leading-[1.4]"
                  >
                    Eu concordo que meus dados sejam coletados e tratados para
                    receber o contato da Vita Baby, de acordo com a{" "}
                    <a
                      href="/politica-de-privacidade"
                      className="text-[#af4d30] hover:underline font-semibold"
                      target="_blank"
                      rel="noopener"
                    >
                      Política de Privacidade
                    </a>
                    .
                  </label>
                </div>

                <Button
                  disabled={pending}
                  className="w-full rounded-xl h-[3.5rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold shadow-lg text-[1rem]"
                >
                  {pending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
