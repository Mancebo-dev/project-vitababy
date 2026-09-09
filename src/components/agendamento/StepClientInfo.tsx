"use client";

import {
  AlertCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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

    if (!formData.clientPassword || formData.clientPassword.length < 6) {
      setErrorMessage(
        "A senha para a Área do Cliente deve ter no mínimo 6 caracteres.",
      );
      return;
    }

    if (formData.clientPassword !== formData.clientPasswordConfirm) {
      setErrorMessage(
        "A confirmação de senha não confere com a senha digitada.",
      );
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage("É necessário aceitar os termos de uso para continuar.");
      return;
    }

    onNext();
  };

  return (
    <div className="flex flex-col gap-[2rem]">
      <div>
        <span className="text-[#af4d30] font-semibold text-[0.875rem] uppercase tracking-wider">
          Passo 4 de 5
        </span>
        <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-heading font-bold text-[#411f03] mt-[0.25rem]">
          Seus dados e acesso à Área do Cliente
        </h2>
        <p className="text-[#444840] text-[0.9375rem] mt-[0.25rem]">
          Informe os dados de quem receberá o atendimento. Com a sua senha, você
          poderá acompanhar o status do agendamento, consultar contratos e
          orientações.
        </p>
      </div>

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
              Contato rápido para confirmação com a especialista
            </span>
          </div>
        </div>

        {/* Senha e Confirmação de Senha */}
        <div className="p-[1.25rem] bg-[#fbf9f5] border border-[#f0eee9] rounded-xl flex flex-col gap-[1rem]">
          <div className="flex items-center gap-[0.5rem] text-[#411f03]">
            <Lock className="w-4 h-4 text-[#af4d30]" />
            <span className="font-heading font-bold text-[0.9375rem]">
              Crie uma Senha para sua Área do Cliente
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.25rem]">
            <div>
              <label
                htmlFor="clientPassword"
                className="block text-[0.8125rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                Senha de Acesso *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="clientPassword"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.clientPassword}
                  onChange={(e) =>
                    onChangeField("clientPassword", e.target.value)
                  }
                  className="w-full pl-[1rem] pr-[2.75rem] py-[0.625rem] border border-[#e4e2de] rounded-xl text-[0.875rem] bg-white focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[0.875rem] top-1/2 -translate-y-1/2 text-[#7d7a75] hover:text-[#411f03]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="clientPasswordConfirm"
                className="block text-[0.8125rem] font-semibold text-[#411f03] mb-[0.375rem]"
              >
                Confirme a Senha *
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  id="clientPasswordConfirm"
                  placeholder="Repita a senha criada"
                  value={formData.clientPasswordConfirm}
                  onChange={(e) =>
                    onChangeField("clientPasswordConfirm", e.target.value)
                  }
                  className="w-full pl-[1rem] pr-[2.75rem] py-[0.625rem] border border-[#e4e2de] rounded-xl text-[0.875rem] bg-white focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-[0.875rem] top-1/2 -translate-y-1/2 text-[#7d7a75] hover:text-[#411f03]"
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
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

      <div className="flex items-center justify-between mt-[1rem]">
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
