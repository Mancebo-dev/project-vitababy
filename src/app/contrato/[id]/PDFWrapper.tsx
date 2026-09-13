"use client";

import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export type ContractData = {
  contractId?: string;
  contractNumber: string;
  date: string;
  content: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceName: string;
  serviceDetails: string;
  serviceDate: string;
  serviceTime: string;
  serviceProfessional: string;
  serviceValue: string;
  isSigned?: boolean;
  signedAt?: Date | null;
  clientIp?: string | null;
  pdfUrl?: string | null;
};

export function PDFWrapper({ data }: { data: ContractData }) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleDownload = async () => {
    if (typeof window === "undefined" || !printRef.current) return null;

    setIsGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = printRef.current;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `contrato-${data.contractNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      return pdfBlob;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF. Tente usar a opção de Imprimir.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadClick = async () => {
    if (data.pdfUrl) {
      window.open(data.pdfUrl, "_blank");
      return;
    }
    const html2pdf = (await import("html2pdf.js")).default;
    const element = printRef.current;
    if (element) {
      html2pdf()
        .set({
          margin: 10,
          filename: `contrato-${data.contractNumber}.pdf`,
        })
        .from(element)
        .save();
    }
  };

  const handleSign = async () => {
    if (!data.contractId) return;
    setIsSigning(true);
    try {
      // 1. Generate PDF blob from current DOM
      const pdfBlob = await handleDownload();
      if (!pdfBlob) throw new Error("Falha ao gerar o PDF");

      // 2. Upload to server
      const formData = new FormData();
      formData.append("file", pdfBlob, `contrato.pdf`);
      formData.append("contractId", data.contractId);

      const res = await fetch("/api/contracts/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Falha no upload");

      alert("Contrato assinado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao assinar contrato. Tente novamente.");
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-[#444840] w-full flex flex-col items-center">
      {/* Action Bar (Not printed) */}
      <div className="w-full max-w-[210mm] flex justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4" /> Imprimir
        </button>
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? "Gerando..." : "Baixar PDF"}
        </button>
        {!data.isSigned && data.contractId && (
          <button
            type="button"
            onClick={handleSign}
            disabled={isSigning || isGenerating}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {isSigning ? "Assinando..." : "Assinar Digitalmente"}
          </button>
        )}
      </div>

      {/* Contract Document (Folha A4) */}
      <div className="bg-white shadow-xl border border-slate-200 rounded-xs mx-auto print:shadow-none print:border-none print:bg-transparent w-full max-w-[210mm]">
        <div
          ref={printRef}
          className="p-8 sm:p-14 w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-[#444840] relative"
        >
          {/* Header */}
          <header className="flex flex-col items-center justify-center mb-8 text-center">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby"
              width={140}
              height={45}
              className="mb-4"
            />
            <p className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-bold mb-2">
              Contrato de Prestação de Serviços
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
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
              <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-3">
                Contratada
              </p>
              <p className="font-bold text-[14px]">VITA BABY ASSESSORIA</p>
              <p className="text-[12px] text-[#71717a] mt-1">
                Assessoria Materno-Infantil
              </p>
            </div>
            <div className="bg-[#fcfaf7] p-5 rounded-lg border border-[#f0ebe1]">
              <p className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-3">
                Contratante
              </p>
              <p className="font-bold text-[14px]">{data.clientName}</p>
              <div className="text-[11px] text-[#71717a] mt-2 space-y-0.5 leading-relaxed">
                <p>Tel: {data.clientPhone}</p>
                <p>{data.clientEmail}</p>
                <p className="uppercase">{data.clientAddress}</p>
              </div>
            </div>
          </div>

          {/* Objeto do Contrato Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#ae4d30]" />
              <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                Objeto do Contrato
              </h3>
            </div>

            <div className="border border-[#f0ebe1] rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-[#a1a1aa] border-b border-[#f0ebe1] uppercase tracking-wider">
                    <th className="font-semibold px-4 py-3 w-1/3">Serviço</th>
                    <th className="font-semibold px-4 py-3 w-1/4">
                      Data e Horário
                    </th>
                    <th className="font-semibold px-4 py-3">Detalhes</th>
                    <th className="font-semibold px-4 py-3 text-right">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-4 align-top">
                      <p className="text-[9px] text-[#a1a1aa] mb-1">01</p>
                      <p className="font-bold text-[12px]">
                        {data.serviceName}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fcfaf7] border border-[#f0ebe1] rounded-full font-medium mb-2">
                        {data.serviceDate}{" "}
                        <span className="text-[#ae4d30]">
                          {data.serviceTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#ae4d30]" />
                        <span className="text-[#71717a]">
                          {data.serviceProfessional}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-[#71717a] leading-relaxed">
                      {data.serviceDetails}
                    </td>
                    <td className="px-4 py-4 align-top text-right font-medium text-[#444840]">
                      {data.serviceValue}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Termos e Condições Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#ae4d30]" />
              <h3 className="text-[11px] font-bold text-[#ae4d30] uppercase tracking-widest">
                Termos e Condições
              </h3>
            </div>

            <div className="w-full bg-[#fcfaf7] p-6 sm:p-8 rounded-lg border border-[#f0ebe1] text-[12px] text-[#444840] leading-relaxed">
              <div
                className="prose prose-sm max-w-none w-full prose-p:my-2 prose-headings:text-[13px] prose-headings:font-bold prose-headings:mb-1 prose-headings:mt-4 prose-headings:uppercase prose-headings:text-[#444840] [&_*]:max-w-none [&_div]:w-full [&>div]:p-0"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized contract template content
                dangerouslySetInnerHTML={{
                  __html:
                    data.content || "<p>Nenhum termo cadastrado no modelo.</p>",
                }}
              />
            </div>
          </div>

          {/* Image Authorization Section */}
          <div className="mb-12">
            <div className="border border-[#d19a7e] rounded-lg p-6 bg-white relative overflow-hidden">
              <h3 className="text-[10px] font-bold text-[#ae4d30] uppercase tracking-wider mb-4">
                Autorização de Uso de Imagem (Opcional)
              </h3>
              <p className="text-[12px] text-[#71717a] leading-relaxed mb-4">
                Com relação à utilização da imagem do bebê e da família para
                fins educativos e institucionais (incluindo redes sociais e
                materiais de divulgação), sempre com responsabilidade e respeito
                à família, fica estabelecido que a referida utilização:
              </p>
              <p className="text-[12px] font-bold text-[#444840]">
                ( ) ESTÁ EXPRESSAMENTE AUTORIZADA
                <br />( ) NÃO ESTÁ AUTORIZADA
              </p>
              <p className="text-[11px] text-[#71717a] mt-4">
                Esta autorização pode ser revogada a qualquer momento mediante
                comunicação escrita.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-[#f0ebe1]">
            <div>
              <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-12">
                Assinatura do(a) Contratante
              </h4>
              <div className="border-t border-[#444840] pt-2">
                <p className="text-[12px] font-medium text-[#71717a]">
                  {data.clientName}
                </p>
                <p className="text-[10px] text-[#a1a1aa] mt-1">
                  Assinado em:{" "}
                  {data.isSigned && data.signedAt
                    ? new Date(data.signedAt).toLocaleString("pt-BR")
                    : "—"}
                </p>
                {data.isSigned && data.clientIp && (
                  <p className="text-[9px] text-[#a1a1aa] mt-0.5">
                    IP: {data.clientIp}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-12">
                Pela Contratada
              </h4>
              <div className="border-t border-[#444840] pt-2">
                <p className="text-[12px] font-medium text-[#71717a]">
                  VITA BABY ASSESSORIA
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Page Number and Doc ID */}
          <div className="mt-20 flex justify-between items-center text-[10px] text-[#a1a1aa]">
            <p>VITA BABY ASSESSORIA · Contrato Nº {data.contractNumber}</p>
            <p className="font-bold text-[#ae4d30]">Página 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
