"use client";

import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Printer,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  signEmployeeContractByCompanyAction,
  signEmployeeContractWithTokenAction,
} from "@/app/admin/funcionarios/actions";
import { buildWhatsAppLink } from "@/utils/whatsapp";

export type EmployeeContractViewData = {
  contractId: string;
  signToken?: string;
  contractNumber: string;
  date: string;
  title: string;
  content: string;

  employeeName: string;
  employeeCpfCnpj?: string;
  employeeRg?: string;
  employeeEmail?: string;
  employeePhone?: string;
  employeeAddress?: string;

  serviceType?: string;
  serviceDescription?: string;
  contractType?: string;
  billingCycle?: string;
  amount?: number | null;
  paymentMethod?: string;
  paymentDetails?: string;
  workRegime?: string;
  startDate?: string;
  validityDescription?: string;

  signedByEmployee: boolean;
  signedAt?: Date | null;
  employeeIp?: string | null;
  signedByCompany: boolean;
  signedByCompanyAt?: Date | null;
  isAdmin?: boolean;
};

function formatBillingCycle(cycle?: string | null) {
  switch (cycle) {
    case "SALARY":
      return "Salário Mensal";
    case "MONTHLY":
      return "Mensal";
    case "BIWEEKLY":
      return "Quinzenal";
    case "WEEKLY":
      return "Semanal";
    case "DAILY":
      return "Por Diária / Plantão";
    case "PER_SERVICE":
      return "Por Serviço / Demanda";
    default:
      return cycle || "Mensal";
  }
}

function formatContractType(type?: string | null) {
  switch (type) {
    case "CLT":
      return "CLT / Vínculo Empregatício";
    case "PJ":
      return "Prestador de Serviços (PJ)";
    case "MEI":
      return "MEI";
    case "AUTONOMO":
      return "Profissional Autônomo";
    case "DIARISTA":
      return "Diarista / Plantonista";
    case "TEMPORARIO":
      return "Contrato Temporário";
    default:
      return type || "Prestação de Serviços";
  }
}

export function EmployeePDFWrapper({
  data,
}: {
  data: EmployeeContractViewData;
}) {
  const [isSigningEmployee, setIsSigningEmployee] = useState(false);
  const [isSigningCompany, setIsSigningCompany] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const formatBRL = (val?: number | null) => {
    if (!val || val <= 0) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignEmployee = async () => {
    if (!data.signToken) return;
    const confirmed = window.confirm(
      "Confirmar a assinatura digital deste contrato com a Vita Baby Assessoria?",
    );
    if (!confirmed) return;

    setIsSigningEmployee(true);
    try {
      await signEmployeeContractWithTokenAction(data.signToken);
      setSuccessMessage("Contrato assinado digitalmente com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1400);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao assinar contrato.",
      );
    } finally {
      setIsSigningEmployee(false);
    }
  };

  const handleSignCompany = async () => {
    setIsSigningCompany(true);
    try {
      await signEmployeeContractByCompanyAction(data.contractId);
      setSuccessMessage(
        "Assinatura da Vita Baby Assessoria registrada com sucesso!",
      );
      setTimeout(() => {
        window.location.reload();
      }, 1400);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao assinar contrato.",
      );
    } finally {
      setIsSigningCompany(false);
    }
  };

  const contractUrl =
    typeof window !== "undefined"
      ? data.signToken && !data.signedByEmployee
        ? `${window.location.origin}/assinar-funcionario/${data.signToken}`
        : `${window.location.origin}/contrato-funcionario/${data.contractId}`
      : "";

  const whatsappMessage = `Olá, ${data.employeeName}! Segue o link para visualização e assinatura digital do seu contrato com a Vita Baby Assessoria:\n\n${contractUrl}`;
  const whatsappUrl = buildWhatsAppLink(data.employeePhone, whatsappMessage);

  return (
    <div className="space-y-6 text-[#444840] w-full flex flex-col items-center">
      {/* Barra de Ações (Oculta na Impressão) */}
      <div className="w-full max-w-[210mm] print:hidden space-y-4">
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {data.signedByEmployee && data.signedByCompany ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Assinado por Ambas as Partes
              </span>
            ) : data.signedByCompany ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Assinado pela Vita Baby (Aguardando Funcionário)
              </span>
            ) : data.signedByEmployee ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                Assinado pelo Funcionário (Aguardando Vita Baby)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-slate-500" />
                Aguardando Assinatura
              </span>
            )}
            <span className="text-xs text-slate-500">
              Contrato Nº {data.contractNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {data.employeePhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar no WhatsApp
              </a>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-xs font-medium cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>

            {data.isAdmin && !data.signedByCompany && (
              <button
                type="button"
                onClick={handleSignCompany}
                disabled={isSigningCompany}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm transition-colors text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSigningCompany
                  ? "Assinando..."
                  : "Assinar pela Vita Baby (Rayane)"}
              </button>
            )}

            {!data.signedByEmployee && data.signToken && (
              <button
                type="button"
                onClick={handleSignEmployee}
                disabled={isSigningEmployee}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-lg shadow-sm transition-colors text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSigningEmployee ? "Processando..." : "Assinar Digitalmente"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Folha A4 */}
      <div className="w-full overflow-x-auto pb-6 flex justify-center">
        <div className="bg-white shadow-xl border border-slate-200 rounded-sm mx-auto print:shadow-none print:border-none print:bg-transparent print:m-0 w-full max-w-[210mm] min-w-[280px]">
          <div
            id="contrato-folha"
            className="p-6 sm:p-12 md:p-14 w-full min-h-[297mm] mx-auto bg-white text-[#444840] relative"
          >
            {/* Header */}
            <header className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="relative w-36 h-12 mb-3">
                <Image
                  src="/assets/logo-vita-baby.png"
                  alt="Vita Baby"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-bold mb-1">
                {data.title ||
                  "Contrato de Prestação de Serviços e Colaboração Profissional"}
              </p>
              <h2 className="text-xl font-bold text-[#ae4d30]">
                Nº {data.contractNumber}
              </h2>
              <p className="text-[11px] text-[#a1a1aa] mt-1">
                Emitido em {data.date}
              </p>
            </header>

            <div className="h-0.5 w-full bg-[#ae4d30] mb-8" />

            {/* Partes: Contratante (Vita Baby) vs Contratado (Funcionário/Prestador) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
                <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-2">
                  Contratante
                </p>
                <p className="font-bold text-[13px] text-slate-900">
                  VITA BABY ASSESSORIA
                </p>
                <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">
                  Representada por Rayane Castro
                </p>
                <p className="text-[11px] text-[#71717a] leading-relaxed">
                  Assessoria Materno-Infantil
                </p>
              </div>

              <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
                <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-2">
                  Contratado(a) / Prestador(a)
                </p>
                <p className="font-bold text-[13px] text-slate-900">
                  {data.employeeName}
                </p>
                <div className="text-[11px] text-[#71717a] mt-1.5 space-y-0.5 leading-relaxed">
                  {data.employeeCpfCnpj && (
                    <p>CPF/CNPJ: {data.employeeCpfCnpj}</p>
                  )}
                  {data.employeeRg && <p>RG: {data.employeeRg}</p>}
                  {data.employeePhone && <p>Telefone: {data.employeePhone}</p>}
                  {data.employeeEmail && <p>E-mail: {data.employeeEmail}</p>}
                  {data.employeeAddress && (
                    <p className="uppercase">
                      Endereço: {data.employeeAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo de Remuneração, Serviço e Condições */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-[#ae4d30]" />
                <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                  Resumo da Contratação, Remuneração e Pagamento
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fcfaf7] p-4 rounded-lg border border-[#f0ebe1] text-xs">
                {data.serviceType && (
                  <div>
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Cargo / Serviço
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {data.serviceType}
                    </span>
                  </div>
                )}

                {data.contractType && (
                  <div>
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Modalidade
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {formatContractType(data.contractType)}
                    </span>
                  </div>
                )}

                {data.amount !== null &&
                  data.amount !== undefined &&
                  data.amount > 0 && (
                    <div>
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Valor ({formatBillingCycle(data.billingCycle)})
                      </span>
                      <span className="text-base font-bold text-[#ae4d30]">
                        {formatBRL(data.amount)}
                      </span>
                    </div>
                  )}

                {data.paymentMethod && (
                  <div>
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Método de Pagamento
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {data.paymentMethod}
                    </span>
                  </div>
                )}

                {data.startDate && (
                  <div>
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Data de Início
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {data.startDate}
                    </span>
                  </div>
                )}

                {data.validityDescription && (
                  <div>
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Vigência
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {data.validityDescription}
                    </span>
                  </div>
                )}

                {data.workRegime && (
                  <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#f0ebe1]">
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Jornada / Regime de Trabalho
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {data.workRegime}
                    </span>
                  </div>
                )}

                {data.paymentDetails && (
                  <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#f0ebe1]">
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Dados Bancários / PIX / Vencimento
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {data.paymentDetails}
                    </span>
                  </div>
                )}

                {data.serviceDescription && (
                  <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#f0ebe1]">
                    <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                      Escopo do Serviço
                    </span>
                    <span className="text-xs text-slate-700">
                      {data.serviceDescription}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cláusulas e Condições */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 bg-[#ae4d30]" />
                <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                  Cláusulas e Condições
                </h3>
              </div>

              <div className="w-full bg-[#fcfaf7] p-5 sm:p-7 rounded-lg border border-[#f0ebe1] text-[12px] text-[#444840] leading-relaxed">
                <div
                  className="prose prose-sm max-w-none w-full prose-p:my-2 prose-headings:text-[13px] prose-headings:font-bold prose-headings:mb-1 prose-headings:mt-4 prose-headings:uppercase prose-headings:text-[#444840]"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: contract html content
                  dangerouslySetInnerHTML={{
                    __html:
                      data.content ||
                      "<p>Nenhum termo cadastrado no contrato.</p>",
                  }}
                />
              </div>
            </div>

            {/* Assinaturas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-8 border-t border-[#f0ebe1] break-inside-avoid">
              <div>
                <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-6">
                  Pela Contratante (Vita Baby Assessoria)
                </h4>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-[12px] font-bold text-slate-900">
                    VITA BABY ASSESSORIA — RAYANE CASTRO
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-1">
                    {data.signedByCompany ? (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 inline" /> Assinado
                        digitalmente pela Contratante
                        {data.signedByCompanyAt &&
                          ` em ${new Date(data.signedByCompanyAt).toLocaleString("pt-BR")}`}
                      </span>
                    ) : (
                      "Assinatura autorizada"
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-6">
                  Assinatura do(a) Contratado(a) / Prestador(a)
                </h4>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-[12px] font-bold text-slate-900">
                    {data.employeeName}
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-1">
                    {data.signedByEmployee && data.signedAt ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" /> Assinado
                        digitalmente em{" "}
                        {new Date(data.signedAt).toLocaleString("pt-BR")}
                      </span>
                    ) : (
                      "Pendente de assinatura"
                    )}
                  </p>
                  {data.signedByEmployee && data.employeeIp && (
                    <p className="text-[9px] text-[#a1a1aa] mt-0.5">
                      Registro de IP: {data.employeeIp}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 flex justify-between items-center text-[10px] text-[#a1a1aa] border-t border-[#f0ebe1] pt-4">
              <p>VITA BABY ASSESSORIA · Contrato Nº {data.contractNumber}</p>
              <p className="font-bold text-[#ae4d30]">
                Documento de Assinatura Eletrônica
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          .print\\:hidden {
            display: none !important;
          }
          #contrato-folha {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
