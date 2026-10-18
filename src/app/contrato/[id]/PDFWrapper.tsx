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
import { buildWhatsAppLink } from "@/utils/whatsapp";
import { signContractAction, signContractByProfAction } from "../actions";

export type ContractData = {
  contractId?: string;
  contractNumber: string;
  date: string;
  content: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  serviceName: string;
  serviceDetails?: string;
  serviceDate?: string;
  serviceTime?: string;
  serviceProfessional?: string;
  serviceValue?: string;

  totalValue?: number | null;
  monthlyValue?: number | null;
  dailyValue?: number | null;
  validityDescription?: string | null;
  workRegime?: string | null;

  isSigned?: boolean;
  signedAt?: Date | null;
  clientIp?: string | null;
  imageUsageAccepted?: boolean | null;
  signedByProf?: boolean;
  signedByProfAt?: Date | null;
  pdfUrl?: string | null;
  isAdmin?: boolean;
};

export function PDFWrapper({ data }: { data: ContractData }) {
  const [isSigningClient, setIsSigningClient] = useState(false);
  const [isSigningProf, setIsSigningProf] = useState(false);
  const [imageUsageAccepted, setImageUsageAccepted] = useState<boolean>(
    data.imageUsageAccepted !== undefined && data.imageUsageAccepted !== null
      ? data.imageUsageAccepted
      : true,
  );
  const [successMessage, setSuccessMessage] = useState("");

  const hasService = Boolean(
    data.serviceName &&
      !data.serviceName.startsWith("[") &&
      data.serviceName.trim() !== "",
  );

  const hasFinancialSummary = Boolean(
    (data.totalValue && data.totalValue > 0) ||
      (data.serviceValue &&
        !data.serviceValue.startsWith("[") &&
        data.serviceValue.trim() !== "") ||
      (data.monthlyValue && data.monthlyValue > 0) ||
      (data.dailyValue && data.dailyValue > 0) ||
      (data.validityDescription && data.validityDescription.trim() !== "") ||
      (data.workRegime && data.workRegime.trim() !== ""),
  );

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

  const handleSignClient = async () => {
    if (!data.contractId) return;
    const consentText = imageUsageAccepted
      ? "com USO DE IMAGEM AUTORIZADO"
      : "com USO DE IMAGEM NÃO AUTORIZADO";
    const confirmSign = window.confirm(
      `Confirmar a assinatura digital deste contrato com a Vita Baby (${consentText})?`,
    );
    if (!confirmSign) return;

    setIsSigningClient(true);
    try {
      await signContractAction(data.contractId, imageUsageAccepted);
      setSuccessMessage("Contrato assinado digitalmente com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao assinar contrato.",
      );
    } finally {
      setIsSigningClient(false);
    }
  };

  const handleSignProf = async () => {
    if (!data.contractId) return;
    setIsSigningProf(true);
    try {
      await signContractByProfAction(data.contractId);
      setSuccessMessage("Assinatura da Contratada registrada com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao assinar contrato.",
      );
    } finally {
      setIsSigningProf(false);
    }
  };

  const contractUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/contrato/${data.contractId}`
      : "";

  const whatsappMessage = `Olá, ${data.clientName}! Segue o link para visualização e assinatura digital do seu contrato com a Vita Baby Assessoria:\n\n${contractUrl}\n\nQualquer dúvida, estamos à disposição!`;

  const whatsappUrl = buildWhatsAppLink(data.clientPhone, whatsappMessage);

  return (
    <div className="space-y-6 text-[#444840] w-full flex flex-col items-center">
      {/* Action and Status Bar (Ocultos na Impressão) */}
      <div className="w-full max-w-[210mm] print:hidden space-y-4">
        {/* Status Notification */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {data.isSigned && data.signedByProf ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Assinado por Ambas as Partes
              </span>
            ) : data.signedByProf ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Assinado pela Contratada (Aguardando Cliente)
              </span>
            ) : data.isSigned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                Assinado pelo Cliente (Aguardando Contratada)
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
            {data.contractId && (
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
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-xs font-medium"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>

            {/* Assinar pela Contratada (se for Admin) */}
            {data.isAdmin && !data.signedByProf && data.contractId && (
              <button
                type="button"
                onClick={handleSignProf}
                disabled={isSigningProf}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm transition-colors text-xs font-semibold disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSigningProf ? "Assinando..." : "Assinar pela Contratada"}
              </button>
            )}

            {/* Assinar Digitalmente pelo Cliente */}
            {!data.isSigned && data.contractId && (
              <button
                type="button"
                onClick={handleSignClient}
                disabled={isSigningClient}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-lg shadow-sm transition-colors text-xs font-bold disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSigningClient ? "Processando..." : "Assinar Digitalmente"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contract Document (Folha A4 estilizada) */}
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
                Contrato de Prestação de Serviços de Assessoria Materno-Infantil
              </p>
              <h2 className="text-xl font-bold text-[#ae4d30]">
                Nº {data.contractNumber}
              </h2>
              <p className="text-[11px] text-[#a1a1aa] mt-1">
                Emitido em {data.date}
              </p>
            </header>

            <div className="h-0.5 w-full bg-[#ae4d30] mb-8" />

            {/* Parties Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
                <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-2">
                  Contratada
                </p>
                <p className="font-bold text-[13px] text-slate-900">
                  VITA BABY ASSESSORIA
                </p>
                <p className="text-[11px] text-[#71717a] mt-1 leading-relaxed">
                  Assessoria Especializada Materno-Infantil
                </p>
              </div>
              <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
                <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-2">
                  Contratante
                </p>
                <p className="font-bold text-[13px] text-slate-900">
                  {data.clientName}
                </p>
                <div className="text-[11px] text-[#71717a] mt-1.5 space-y-0.5 leading-relaxed">
                  {data.clientPhone && <p>Telefone: {data.clientPhone}</p>}
                  {data.clientEmail && <p>E-mail: {data.clientEmail}</p>}
                  {data.clientAddress && (
                    <p className="uppercase">Endereço: {data.clientAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Summary & Competency (Valores Total, Mensal, Diária e Validade) */}
            {hasFinancialSummary && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 bg-[#ae4d30]" />
                  <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                    Resumo Financeiro e Competência do Contrato
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#fcfaf7] p-4 rounded-lg border border-[#f0ebe1] text-xs">
                  {/* Valor Total */}
                  {(data.totalValue || data.serviceValue) && (
                    <div>
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Valor Total do Contrato
                      </span>
                      <span className="text-base font-bold text-[#ae4d30]">
                        {formatBRL(data.totalValue) || data.serviceValue}
                      </span>
                    </div>
                  )}

                  {/* Valor Mensal */}
                  {data.monthlyValue && (
                    <div>
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Valor Mensal
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatBRL(data.monthlyValue)}
                      </span>
                    </div>
                  )}

                  {/* Valor da Diária */}
                  {data.dailyValue && (
                    <div>
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Valor da Diária / Plantão
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatBRL(data.dailyValue)}
                      </span>
                    </div>
                  )}

                  {/* Competência / Validade */}
                  {data.validityDescription && (
                    <div className="col-span-2 sm:col-span-3 pt-2 border-t border-[#f0ebe1]">
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Vigência / Competência
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {data.validityDescription}
                      </span>
                    </div>
                  )}

                  {/* Regime de Trabalho */}
                  {data.workRegime && (
                    <div className="col-span-2 sm:col-span-3 pt-1">
                      <span className="text-[#a1a1aa] block text-[10px] uppercase font-semibold">
                        Regime de Atendimento
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {data.workRegime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Objeto do Contrato Section */}
            {hasService && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 bg-[#ae4d30]" />
                  <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                    Objeto do Contrato
                  </h3>
                </div>

                <div className="border border-[#f0ebe1] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-[#a1a1aa] bg-[#fcfaf7] border-b border-[#f0ebe1] uppercase tracking-wider text-[10px]">
                        <th className="font-semibold px-4 py-3 w-1/3">
                          Serviço
                        </th>
                        {(data.serviceDate || data.serviceTime) && (
                          <th className="font-semibold px-4 py-3">
                            Data e Horário
                          </th>
                        )}
                        {data.serviceDetails && (
                          <th className="font-semibold px-4 py-3">Detalhes</th>
                        )}
                        {(data.totalValue || data.serviceValue) && (
                          <th className="font-semibold px-4 py-3 text-right">
                            Valor
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-4 align-top">
                          <p className="font-bold text-[12px] text-slate-900">
                            {data.serviceName}
                          </p>
                          {data.serviceProfessional && (
                            <p className="text-[10px] text-[#71717a] mt-1">
                              Assessora: {data.serviceProfessional}
                            </p>
                          )}
                        </td>

                        {(data.serviceDate || data.serviceTime) && (
                          <td className="px-4 py-4 align-top">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fcfaf7] border border-[#f0ebe1] rounded-md text-[11px] font-medium">
                              {data.serviceDate}
                              {data.serviceTime && (
                                <span className="text-[#ae4d30]">
                                  {data.serviceTime}
                                </span>
                              )}
                            </div>
                          </td>
                        )}

                        {data.serviceDetails && (
                          <td className="px-4 py-4 align-top text-[#71717a] leading-relaxed">
                            {data.serviceDetails}
                          </td>
                        )}

                        {(data.totalValue || data.serviceValue) && (
                          <td className="px-4 py-4 align-top text-right font-bold text-[#444840]">
                            {formatBRL(data.totalValue) || data.serviceValue}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Termos e Cláusulas */}
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
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized contract html
                  dangerouslySetInnerHTML={{
                    __html:
                      data.content ||
                      "<p>Nenhum termo cadastrado no modelo.</p>",
                  }}
                />
              </div>
            </div>

            {/* Registro / Seleção da Cláusula de Uso de Imagem */}
            {data.isSigned ? (
              <div className="mb-8 p-4 bg-[#fcfaf7] border border-[#f0ebe1] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block sm:inline">
                    Cláusula de Uso de Imagem e Voz:
                  </span>
                  <span className="text-slate-500 text-[11px] ml-0 sm:ml-2">
                    (Divulgação institucional e redes sociais da Vita Baby)
                  </span>
                </div>
                {data.imageUsageAccepted ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Autorizado pelo
                    Cliente
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    Não autorizado pelo Cliente
                  </span>
                )}
              </div>
            ) : data.contractId ? (
              <div className="mb-8 p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs print:hidden">
                <p className="font-bold text-amber-900 mb-1">
                  Autorização de Uso de Imagem e Voz
                </p>
                <p className="text-amber-800 mb-3 text-[11px] leading-relaxed">
                  Você autoriza a Vita Baby a utilizar fotos e vídeos dos
                  atendimentos para fins de divulgação e portfólio em materiais
                  institucionais e redes sociais?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="imageConsent"
                      checked={imageUsageAccepted === true}
                      onChange={() => setImageUsageAccepted(true)}
                      className="text-[#ae4d30] focus:ring-[#ae4d30]"
                    />
                    Sim, autorizo o uso de imagem e voz
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="imageConsent"
                      checked={imageUsageAccepted === false}
                      onChange={() => setImageUsageAccepted(false)}
                      className="text-[#ae4d30] focus:ring-[#ae4d30]"
                    />
                    Não autorizo o uso de imagem
                  </label>
                </div>
              </div>
            ) : null}

            {/* Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-8 border-t border-[#f0ebe1] break-inside-avoid">
              <div>
                <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-6">
                  Assinatura do(a) Contratante
                </h4>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-[12px] font-bold text-slate-900">
                    {data.clientName}
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-1">
                    {data.isSigned && data.signedAt ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" /> Assinado
                        digitalmente em{" "}
                        {new Date(data.signedAt).toLocaleString("pt-BR")}
                      </span>
                    ) : (
                      "Pendente de assinatura"
                    )}
                  </p>
                  {data.isSigned && data.clientIp && (
                    <p className="text-[9px] text-[#a1a1aa] mt-0.5">
                      Registro de IP: {data.clientIp}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-6">
                  Pela Contratada
                </h4>
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-[12px] font-bold text-slate-900">
                    VITA BABY ASSESSORIA
                  </p>
                  <p className="text-[10px] text-[#71717a] mt-1">
                    {data.signedByProf ? (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 inline" /> Assinado
                        digitalmente pela Contratada
                        {data.signedByProfAt &&
                          ` em ${new Date(data.signedByProfAt).toLocaleString("pt-BR")}`}
                      </span>
                    ) : (
                      "Assinatura autorizada"
                    )}
                  </p>
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

      {/* Estilos dedicados para impressão A4 */}
      <style jsx global>{`
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
