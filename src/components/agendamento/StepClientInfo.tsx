"use client";

import {
  AlertCircle,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { BookingFormData } from "./types";

interface StepClientInfoProps {
  formData: BookingFormData;
  onChangeField: <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K],
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepClientInfo({
  formData,
  onChangeField,
  onNext,
  onBack,
}: StepClientInfoProps) {
  const [errorMessage, setErrorMessage] = useState("");

  // Máscara de telefone
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    onChangeField("clientPhone", formatted);
  };

  const handleCpfChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3)}`;
    }
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    }
    if (raw.length > 9) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
    }
    onChangeField("clientCpf", formatted);
  };

  const handleZipCodeChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 8);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    onChangeField("clientZipCode", formatted);
  };

  const handleValidateAndNext = () => {
    setErrorMessage("");

    if (!formData.clientName.trim()) {
      setErrorMessage("Por favor, preencha o seu nome completo.");
      return;
    }

    if (!formData.clientEmail.trim() || !formData.clientEmail.includes("@")) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      return;
    }

    const rawPhone = formData.clientPhone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      setErrorMessage("Por favor, informe um WhatsApp válido com DDD.");
      return;
    }

    const rawCpf = formData.clientCpf.replace(/\D/g, "");
    if (rawCpf.length !== 11) {
      setErrorMessage("Por favor, informe um CPF válido com 11 dígitos.");
      return;
    }

    if (
      !formData.clientZipCode ||
      formData.clientZipCode.replace(/\D/g, "").length < 8
    ) {
      setErrorMessage("Por favor, informe um CEP válido.");
      return;
    }

    if (!formData.clientAddress.trim()) {
      setErrorMessage("Por favor, informe o seu endereço completo.");
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage("É necessário aceitar os termos de uso para continuar.");
      return;
    }

    onNext();
  };

  return (
    <div className="flex flex-col gap-[1rem] max-h-full">
      <div className="shrink-0 text-center md:text-left mb-2">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-heading font-bold text-[#411f03]">
          Seus dados e informações adicionais
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-2 flex flex-col gap-[2rem]">
        {errorMessage && (
          <div className="p-[1rem] bg-[#fdf2f0] border border-[#f5c6cb] rounded-xl flex items-center gap-[0.75rem] text-[#af4d30] text-[0.875rem]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-white border border-[#e4e2de] rounded-2xl p-[1.75rem] shadow-sm flex flex-col gap-[1.5rem]">
          {/* Nome Completo */}
          <div>
            <label
              htmlFor="clientName"
              className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
            >
              Nome Completo da Contratante *
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="clientName"
                placeholder="Ex: Mariana Silveira"
                value={formData.clientName}
                onChange={(e) => onChangeField("clientName", e.target.value)}
                className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
              />
            </div>
          </div>

          {/* E-mail e WhatsApp em grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.25rem]">
            <div>
              <label
                htmlFor="clientEmail"
                className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                E-mail *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="clientEmail"
                  placeholder="seu.email@exemplo.com"
                  value={formData.clientEmail}
                  onChange={(e) => onChangeField("clientEmail", e.target.value)}
                  className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
              </div>
              <span className="text-[0.75rem] text-[#7d7a75] mt-1 block">
                Para onde enviaremos o resumo e confirmação
              </span>
            </div>

            <div>
              <label
                htmlFor="clientPhone"
                className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                WhatsApp / Telefone *
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  id="clientPhone"
                  placeholder="(61) 99999-9999"
                  value={formData.clientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
              </div>
              <span className="text-[0.75rem] text-[#7d7a75] mt-1 block">
                Contato rápido para confirmação
              </span>
            </div>

            <div>
              <label
                htmlFor="clientCpf"
                className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                CPF *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="clientCpf"
                  placeholder="000.000.000-00"
                  value={formData.clientCpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
              </div>
              <span className="text-[0.75rem] text-[#7d7a75] mt-1 block">
                Será utilizado como sua senha de acesso à Área do Cliente
              </span>
            </div>
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
            <div className="md:col-span-1">
              <label
                htmlFor="clientZipCode"
                className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                CEP *
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="clientZipCode"
                  placeholder="00000-000"
                  value={formData.clientZipCode}
                  onChange={(e) => handleZipCodeChange(e.target.value)}
                  className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="clientAddress"
                className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                Endereço Completo *
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#a8a5a0] absolute left-[1rem] top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="clientAddress"
                  placeholder="Rua, Número, Bairro, Complemento"
                  value={formData.clientAddress}
                  onChange={(e) =>
                    onChangeField("clientAddress", e.target.value)
                  }
                  className="w-full pl-[2.75rem] pr-[1rem] py-[0.75rem] border border-[#e4e2de] rounded-xl text-[0.9375rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Caixa de Texto para Informações Adicionais */}
          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.375rem]"
            >
              Informações Adicionais ou Observações (Opcional)
            </label>
            <textarea
              id="additionalInfo"
              rows={4}
              placeholder="Conte-nos o que for relevante para o atendimento: idade ou data prevista de nascimento do bebê, se já nasceu, principais dificuldades na amamentação, alergias ou dúvidas específicas..."
              value={formData.additionalInfo}
              onChange={(e) => onChangeField("additionalInfo", e.target.value)}
              className="w-full p-[1rem] border border-[#e4e2de] rounded-xl text-[0.875rem] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none resize-y"
            />
          </div>

          {/* Checkbox para Acompanhante */}
          <label className="flex items-start gap-[0.625rem] cursor-pointer pt-[0.5rem] border-t border-[#f0eee9]">
            <input
              type="checkbox"
              checked={formData.requiresCompanion}
              onChange={(e) =>
                onChangeField("requiresCompanion", e.target.checked)
              }
              className="mt-1 w-4 h-4 text-[#af4d30] rounded border-[#e4e2de] focus:ring-[#af4d30]"
            />
            <div className="flex flex-col">
              <span className="text-[0.875rem] font-semibold text-[#411f03]">
                Solicitar Acompanhante
              </span>
              <span className="text-[0.8125rem] text-[#444840] leading-[1.5]">
                Marque esta opção se desejar a presença de um acompanhante
                durante o atendimento (presencial ou domiciliar).
              </span>
            </div>
          </label>

          {/* Aceite de termos */}
          <label className="flex items-start gap-[0.625rem] cursor-pointer pt-[0.5rem]">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => onChangeField("acceptTerms", e.target.checked)}
              className="mt-1 w-4 h-4 text-[#af4d30] rounded border-[#e4e2de] focus:ring-[#af4d30]"
            />
            <span className="text-[0.8125rem] text-[#444840] leading-[1.5]">
              Concordo com os{" "}
              <Link
                href="/termos-de-uso"
                target="_blank"
                className="text-[#af4d30] underline font-medium hover:text-[#411f03]"
              >
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link
                href="/politica-de-privacidade"
                target="_blank"
                className="text-[#af4d30] underline font-medium hover:text-[#411f03]"
              >
                Política de Privacidade
              </Link>{" "}
              da Vitababy.
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-[1.5rem] shrink-0 border-t border-[#e4e2de] mt-[1rem]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Datas
        </button>

        <button
          type="button"
          onClick={handleValidateAndNext}
          className="rounded-full px-[2rem] h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold shadow-md text-[0.9375rem] transition-all"
        >
          Revisar e Confirmar Solicitação
        </button>
      </div>
    </div>
  );
}
