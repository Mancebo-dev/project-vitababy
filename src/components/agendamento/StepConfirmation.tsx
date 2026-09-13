"use client";

import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Loader2,
  MessageCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type {
  BookingFormData,
  ExtendedProfessional,
  ExtendedService,
} from "./types";

interface StepConfirmationProps {
  services: ExtendedService[];
  professionals: ExtendedProfessional[];
  formData: BookingFormData;
  onBack: () => void;
  onReset: () => void;
}

export function StepConfirmation({
  services,
  professionals,
  formData,
  onBack,
  onReset,
}: StepConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");

  const selectedServices = services.filter((s) =>
    formData.serviceIds.includes(s.id),
  );
  const professional = professionals.find(
    (p) => p.id === formData.professionalId,
  );

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);

    try {
      const { submitBookingAction } = await import("@/app/agendamento/actions");
      const result = await submitBookingAction(formData);

      if (!result.success) {
        alert(result.error || "Ocorreu um erro ao processar sua solicitação.");
        setIsSubmitting(false);
        return;
      }

      const generatedProtocol = `VB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setProtocol(generatedProtocol);
      setIsSubmitted(true);
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (isSubmitted) {
    const whatsappMessage = encodeURIComponent(
      `Olá, Rayane! Acabei de enviar minha solicitação de agendamento na Vitababy (Protocolo: ${protocol}).\nServiços: ${selectedServices.map((s) => s.name).join(", ")}\nNome: ${formData.clientName}`,
    );

    return (
      <div className="bg-white border border-[#e4e2de] rounded-3xl p-[2rem] md:p-[3rem] shadow-lg text-center flex flex-col items-center gap-[1.5rem] max-w-[42rem] mx-auto animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-[#5f6f52]/15 text-[#5f6f52] flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="bg-[#f2ede9] text-[#af4d30] text-[0.75rem] font-bold px-[0.75rem] py-[0.25rem] rounded-full uppercase tracking-wider">
            Protocolo: {protocol}
          </span>
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-heading font-bold text-[#411f03] mt-[0.75rem]">
            Solicitação Enviada com Sucesso!
          </h2>
          <p className="text-[#444840] text-[1rem] leading-[1.6] mt-[0.5rem] max-w-[32rem]">
            Obrigada pela confiança, <strong>{formData.clientName}</strong>. A
            sua solicitação foi registrada com o status{" "}
            <span className="text-[#af4d30] font-semibold">
              Pendente de Confirmação
            </span>
            .
          </p>
        </div>

        {/* Card explicativo dos próximos passos */}
        <div className="bg-[#fbf9f5] border border-[#f0eee9] rounded-2xl p-[1.5rem] text-left w-full flex flex-col gap-[1rem]">
          <h4 className="font-heading font-bold text-[#411f03] text-[1rem]">
            O que acontece agora?
          </h4>
          <ul className="flex flex-col gap-[0.75rem] text-[0.875rem] text-[#444840]">
            <li className="flex items-start gap-[0.5rem]">
              <span className="w-5 h-5 rounded-full bg-[#af4d30] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>Confirmação de Agenda:</strong> Nossa equipe entrará em
                contato via WhatsApp no número{" "}
                <strong>{formData.clientPhone}</strong> em até 2 horas úteis
                para confirmar o melhor horário e endereço.
              </span>
            </li>
            <li className="flex items-start gap-[0.5rem]">
              <span className="w-5 h-5 rounded-full bg-[#af4d30] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>Área do Cliente Criada:</strong> Você já pode acessar a
                Área do Cliente com seu e-mail (
                <strong>{formData.clientEmail}</strong>) e a senha cadastrada
                para visualizar seu histórico e contrato.
              </span>
            </li>
            <li className="flex items-start gap-[0.5rem]">
              <span className="w-5 h-5 rounded-full bg-[#af4d30] text-white text-[0.75rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>Pagamento Seguro:</strong> O pagamento só é realizado
                após o aceite e validação dos dados de agendamento.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-[1rem] w-full pt-[0.5rem]">
          <a
            href={`https://wa.me/5561999999999?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-[0.875rem] px-[1.5rem] bg-[#25D366] hover:bg-[#20b859] text-white font-semibold rounded-full flex items-center justify-center gap-[0.5rem] shadow-sm transition-colors text-[0.9375rem]"
          >
            <MessageCircle className="w-5 h-5" /> Falar no WhatsApp Agora
          </a>

          <Link
            href="/"
            onClick={onReset}
            className="flex-1 py-[0.875rem] px-[1.5rem] border border-[#411f03] text-[#411f03] hover:bg-[#411f03]/5 font-semibold rounded-full flex items-center justify-center transition-colors text-[0.9375rem]"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[1rem] max-h-full">
      <div className="shrink-0 text-center md:text-left mb-2">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-heading font-bold text-[#411f03]">
          Revise os dados da sua solicitação
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-2 flex flex-col gap-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
          {/* Resumo do Atendimento */}
          <div className="bg-white border border-[#e4e2de] rounded-2xl p-[1.5rem] shadow-sm flex flex-col gap-[1.25rem]">
            <div className="flex items-center gap-[0.5rem] border-b border-[#f2ede9] pb-[0.75rem]">
              <Clock className="w-5 h-5 text-[#af4d30]" />
              <h3 className="font-heading font-bold text-[#411f03] text-[1.125rem]">
                Detalhes do Atendimento
              </h3>
            </div>

            <div className="flex flex-col gap-[0.75rem] text-[0.875rem]">
              <div className="flex flex-col gap-[0.5rem]">
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  Serviço(s)
                </span>
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="border-b border-[#f0eee9] pb-[0.5rem] last:border-0 last:pb-0"
                  >
                    <p className="font-heading font-bold text-[#411f03] text-[1.0625rem]">
                      {service.name}
                    </p>
                    <p className="text-[#444840] text-[0.8125rem]">
                      Duração estimada: {service.duration} minutos • Valor:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(service.price || 0)}
                    </p>
                  </div>
                ))}
                {selectedServices.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-[#e4e2de]">
                    <p className="font-bold text-[#af4d30] text-[1rem]">
                      Total Estimado:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        selectedServices.reduce(
                          (acc, curr) => acc + Number(curr.price),
                          0,
                        ),
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  Profissional
                </span>
                <p className="font-bold text-[#411f03]">{professional?.name}</p>
                <p className="text-[#7d7a75] text-[0.8125rem]">
                  {professional?.role ||
                    professional?.specialty ||
                    "Assessora Especialista"}
                  {professional?.crnOrCoren
                    ? ` (${professional.crnOrCoren})`
                    : ""}
                </p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold mb-1">
                  Datas e Horários Preferenciais
                </span>
                <div className="flex flex-col gap-[0.375rem]">
                  {formData.dates.map((pref, i) => (
                    <div
                      key={pref.date}
                      className="flex items-center justify-between bg-[#fbf9f5] px-[0.75rem] py-[0.5rem] rounded-lg border border-[#f0eee9]"
                    >
                      <span className="font-medium text-[#411f03]">
                        {i === 0 ? "1ª Opção:" : `${i + 1}ª Opção:`}{" "}
                        {formatDateDisplay(pref.date)}
                      </span>
                      <span className="text-[#af4d30] font-bold">
                        {pref.time}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumo da Contratante */}
          <div className="bg-white border border-[#e4e2de] rounded-2xl p-[1.5rem] shadow-sm flex flex-col gap-[1.25rem]">
            <div className="flex items-center gap-[0.5rem] border-b border-[#f2ede9] pb-[0.75rem]">
              <User className="w-5 h-5 text-[#af4d30]" />
              <h3 className="font-heading font-bold text-[#411f03] text-[1.125rem]">
                Dados da Contratante
              </h3>
            </div>

            <div className="flex flex-col gap-[0.75rem] text-[0.875rem]">
              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  Nome Completo
                </span>
                <p className="font-semibold text-[#411f03]">
                  {formData.clientName}
                </p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  E-mail
                </span>
                <p className="text-[#444840]">{formData.clientEmail}</p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  CPF
                </span>
                <p className="text-[#444840]">{formData.clientCpf}</p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  WhatsApp
                </span>
                <p className="text-[#444840] font-medium">
                  {formData.clientPhone}
                </p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  Endereço
                </span>
                <p className="text-[#444840]">
                  {formData.clientAddress} (CEP: {formData.clientZipCode})
                </p>
              </div>

              <div>
                <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                  Área do Cliente
                </span>
                <p className="text-[#5f6f52] font-semibold flex items-center gap-[0.25rem]">
                  <ShieldCheck className="w-4 h-4" /> Conta e senha configuradas
                </p>
              </div>

              {formData.additionalInfo && (
                <div>
                  <span className="text-[#7d7a75] block text-[0.75rem] uppercase font-semibold">
                    Observações
                  </span>
                  <p className="text-[#444840] text-[0.8125rem] bg-[#fbf9f5] p-[0.75rem] rounded-lg border border-[#f0eee9] whitespace-pre-wrap">
                    {formData.additionalInfo}
                  </p>
                </div>
              )}

              {formData.requiresCompanion && (
                <div>
                  <p className="text-[#5f6f52] font-semibold flex items-center gap-[0.25rem] text-[0.875rem]">
                    <CheckCircle2 className="w-4 h-4" /> Acompanhante Solicitado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Box de Política e Status */}
        <div className="p-[1.25rem] bg-[#fdf9f7] border border-[#f3ded6] rounded-2xl flex items-start gap-[0.75rem] text-[#af4d30] text-[0.875rem]">
          <FileText className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-heading text-[0.9375rem] mb-1">
              Como funciona a confirmação?
            </strong>
            <span className="text-[#444840] leading-[1.5] block">
              Ao clicar no botão abaixo, a sua solicitação será enviada para a
              especialista. O agendamento permanecerá em status{" "}
              <strong>Pendente</strong> até a confirmação de rota e
              compatibilidade de horários. Você não precisará pagar nada neste
              momento.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-[1.5rem] shrink-0 border-t border-[#e4e2de] mt-[1rem]">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Alterar Dados
        </button>

        <button
          type="button"
          onClick={handleSubmitBooking}
          disabled={isSubmitting}
          className="rounded-full px-[2.5rem] h-[3.5rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold shadow-lg text-[1rem] flex items-center gap-[0.5rem] transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando Solicitação...
            </>
          ) : (
            "Enviar Solicitação de Agendamento"
          )}
        </button>
      </div>
    </div>
  );
}
