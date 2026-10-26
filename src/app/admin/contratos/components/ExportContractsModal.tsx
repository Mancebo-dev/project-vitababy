"use client";

import {
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { Download, FileArchive, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { getContracts } from "../actions";

type ContractItem = Awaited<ReturnType<typeof getContracts>>[number];

const MONTH_NAMES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, " ");
  const tempDiv = document.createElement("div");
  const formattedHtml = html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*[/]?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n");
  tempDiv.innerHTML = formattedHtml;
  return (tempDiv.textContent || tempDiv.innerText || "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatBRL(val?: number | null) {
  if (!val || val <= 0) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

export function ExportContractsModal({
  contracts,
}: {
  contracts: ContractItem[];
}) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progressText, setProgressText] = useState("");

  // Default to current month start and next month end (e.g. out-nov)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const defaultStart = new Date(currentYear, currentMonth, 1);
  const defaultEnd = new Date(currentYear, currentMonth + 2, 0); // End of next month

  const [startDateStr, setStartDateStr] = useState(
    format(defaultStart, "yyyy-MM-dd"),
  );
  const [endDateStr, setEndDateStr] = useState(
    format(defaultEnd, "yyyy-MM-dd"),
  );
  const [filterStatus, setFilterStatus] = useState<string>("ALL"); // ALL, SIGNED, PENDING

  const filteredContracts = useMemo(() => {
    try {
      const start = startOfDay(parseISO(startDateStr));
      const end = endOfDay(parseISO(endDateStr));

      return contracts.filter((c) => {
        const contractDate = new Date(c.createdAt);
        const matchesDate = isWithinInterval(contractDate, { start, end });
        if (!matchesDate) return false;

        if (filterStatus === "SIGNED") {
          return c.signedByClient;
        }
        if (filterStatus === "PENDING") {
          return !c.signedByClient;
        }
        return true;
      });
    } catch {
      return [];
    }
  }, [contracts, startDateStr, endDateStr, filterStatus]);

  // Generate folder / zip name based on date interval
  const periodLabel = useMemo(() => {
    try {
      const s = parseISO(startDateStr);
      const e = parseISO(endDateStr);
      const sMonth = MONTH_NAMES[s.getMonth()];
      const eMonth = MONTH_NAMES[e.getMonth()];

      if (sMonth === eMonth && s.getFullYear() === e.getFullYear()) {
        return `${sMonth}-${s.getFullYear()}`;
      }
      return `${sMonth}-${eMonth}`;
    } catch {
      return "periodo";
    }
  }, [startDateStr, endDateStr]);

  const generateContractPdf = (
    contract: ContractItem,
    // biome-ignore lint/suspicious/noExplicitAny: dynamic jsPDF import
    JsPDFClass: any,
    // biome-ignore lint/suspicious/noExplicitAny: dynamic autoTable import
    autoTableFn: any,
  ): ArrayBuffer => {
    const doc = new JsPDFClass({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Header Title
    doc.setFillColor(252, 250, 247);
    doc.rect(margin, y, contentWidth, 24, "F");
    doc.setDrawColor(240, 235, 225);
    doc.rect(margin, y, contentWidth, 24, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(174, 77, 48); // #ae4d30
    doc.text("VITA BABY ASSESSORIA MATERNO-INFANTIL", margin + 6, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(
      `Contrato de Prestação de Serviços · Nº ${contract.id.slice(-6).toUpperCase()}`,
      margin + 6,
      y + 14,
    );
    doc.text(
      `Emitido em ${new Date(contract.createdAt).toLocaleDateString("pt-BR")}`,
      margin + 6,
      y + 19,
    );

    y += 28;

    // Parties Information
    const client =
      contract.client || contract.booking?.client || contract.schedule?.client;
    const clientName = client?.name || "Cliente não informado";
    const clientCpf = client?.cpf ? `CPF: ${client.cpf}` : "";
    const clientPhone = client?.phone ? `Tel: ${client.phone}` : "";
    const clientAddress = [
      client?.street,
      client?.number,
      client?.neighborhood,
      client?.city,
      client?.state,
    ]
      .filter(Boolean)
      .join(", ");

    autoTableFn(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["CONTRATADA", "CONTRATANTE"]],
      body: [
        [
          "VITA BABY ASSESSORIA\nAssessoria Especializada Materno-Infantil\nAtendimento Profissional Domiciliar",
          `${clientName}\n${[clientCpf, clientPhone].filter(Boolean).join(" · ")}\n${clientAddress ? `Endereço: ${clientAddress}` : ""}`,
        ],
      ],
      headStyles: {
        fillColor: [174, 77, 48],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [50, 50, 50],
        cellPadding: 3,
      },
      theme: "grid",
    });

    const finalYParties =
      (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable
        ?.finalY || y + 30;
    y = finalYParties + 6;

    // Objeto do Contrato (Somente se preenchido)
    const serviceName =
      contract.serviceName ||
      contract.booking?.packages?.map((p) => p.name).join(" + ") ||
      contract.schedule?.title ||
      "";
    const serviceDetails =
      contract.serviceDetails ||
      contract.booking?.packages
        ?.map((p) => p.service?.name)
        .filter(Boolean)
        .join(" + ") ||
      "";

    const hasService = Boolean(
      serviceName && !serviceName.startsWith("[") && serviceName.trim() !== "",
    );

    if (hasService) {
      autoTableFn(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["OBJETO DO CONTRATO", "DETALHES / ESPECIFICAÇÃO", "VALOR"]],
        body: [
          [serviceName, serviceDetails || "-", formatBRL(contract.totalValue)],
        ],
        headStyles: {
          fillColor: [70, 75, 85],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5,
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [50, 50, 50],
          cellPadding: 3,
        },
        theme: "grid",
      });

      const finalYService =
        (doc as unknown as { lastAutoTable?: { finalY?: number } })
          .lastAutoTable?.finalY || y + 20;
      y = finalYService + 6;
    }

    // Resumo Financeiro e Competência (se houver valores adicionais)
    const hasFinancialSummary = Boolean(
      contract.monthlyValue ||
        contract.dailyValue ||
        contract.validityDescription ||
        contract.workRegime,
    );

    if (hasFinancialSummary) {
      const summaryRows = [];
      if (contract.monthlyValue) {
        summaryRows.push(["Valor Mensal", formatBRL(contract.monthlyValue)]);
      }
      if (contract.dailyValue) {
        summaryRows.push(["Valor da Diária", formatBRL(contract.dailyValue)]);
      }
      if (contract.validityDescription) {
        summaryRows.push([
          "Vigência / Competência",
          contract.validityDescription,
        ]);
      }
      if (contract.workRegime) {
        summaryRows.push(["Regime de Atendimento", contract.workRegime]);
      }

      autoTableFn(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["RESUMO FINANCEIRO & VIGÊNCIA", "VALOR / CONDIÇÃO"]],
        body: summaryRows,
        headStyles: {
          fillColor: [120, 125, 135],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5,
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 2.5,
        },
        theme: "striped",
      });

      const finalYFin =
        (doc as unknown as { lastAutoTable?: { finalY?: number } })
          .lastAutoTable?.finalY || y + 20;
      y = finalYFin + 6;
    }

    // Cláusulas e Termos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(174, 77, 48);
    doc.text("CLÁUSULAS E CONDIÇÕES GERAIS", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);

    const plainContent = htmlToPlainText(contract.content);
    const contentLines = doc.splitTextToSize(plainContent, contentWidth);

    for (const line of contentLines) {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = 16;
      }
      doc.text(line, margin, y);
      y += 3.8;
    }

    y += 6;
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 16;
    }

    // Cláusula de Uso de Imagem
    doc.setDrawColor(240, 235, 225);
    doc.setFillColor(252, 250, 247);
    doc.rect(margin, y, contentWidth, 10, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Cláusula de Uso de Imagem e Voz:", margin + 4, y + 6.5);

    if (contract.imageUsageAccepted) {
      doc.setTextColor(16, 120, 70); // Green
      doc.text("AUTORIZADO PELO CLIENTE", margin + 65, y + 6.5);
    } else {
      doc.setTextColor(100, 100, 100);
      doc.text("NÃO AUTORIZADO PELO CLIENTE", margin + 65, y + 6.5);
    }

    y += 16;
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 16;
    }

    // Assinaturas
    autoTableFn(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ASSINATURA DO CONTRATANTE", "PELA CONTRATADA"]],
      body: [
        [
          `${clientName}\n${
            contract.signedByClient && contract.signedAt
              ? `Assinado digitalmente em ${new Date(contract.signedAt).toLocaleString("pt-BR")}\nRegistro de IP: ${contract.clientIp || "Registrado"}`
              : "Pendente de Assinatura"
          }`,
          `VITA BABY ASSESSORIA\n${
            contract.signedByProf
              ? `Assinado digitalmente pela Contratada${contract.signedByProfAt ? ` em ${new Date(contract.signedByProfAt).toLocaleString("pt-BR")}` : ""}`
              : "Assinatura autorizada"
          }`,
        ],
      ],
      headStyles: {
        fillColor: [240, 235, 225],
        textColor: [80, 80, 80],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [50, 50, 50],
        cellPadding: 4,
      },
      theme: "grid",
    });

    // Page numbers in footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Vita Baby Assessoria · Contrato Nº ${contract.id.slice(-6).toUpperCase()} · Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: "center" },
      );
    }

    return doc.output("arraybuffer");
  };

  const handleExportZip = async () => {
    if (filteredContracts.length === 0) {
      alert("Nenhum contrato encontrado para o período selecionado.");
      return;
    }

    setIsExporting(true);
    setProgressText("Preparando exportação...");

    try {
      const [
        { default: JsPDFClass },
        { default: autoTableFn },
        { default: JSZipClass },
      ] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
        import("jszip"),
      ]);

      const zip = new JSZipClass();
      const folderName = `Contratos ${periodLabel}`;
      const folder = zip.folder(folderName) || zip;

      for (let i = 0; i < filteredContracts.length; i++) {
        const contract = filteredContracts[i];
        const client =
          contract.client ||
          contract.booking?.client ||
          contract.schedule?.client;
        const sanitizedClient = (client?.name || "Cliente")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_");

        setProgressText(
          `Gerando PDF ${i + 1} de ${filteredContracts.length} (${sanitizedClient})...`,
        );

        // Small delay to keep UI responsive
        await new Promise((resolve) => setTimeout(resolve, 20));

        const pdfBuffer = generateContractPdf(
          contract,
          JsPDFClass,
          autoTableFn,
        );
        const fileName = `Contrato_${contract.id.slice(-6).toUpperCase()}_${sanitizedClient}.pdf`;
        folder.file(fileName, pdfBuffer);
      }

      setProgressText("Compactando arquivo ZIP...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Trigger download
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Contratos ${periodLabel}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setOpen(false);
    } catch (error) {
      console.error("Erro ao exportar contratos:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao exportar os contratos em PDF.",
      );
    } finally {
      setIsExporting(false);
      setProgressText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer min-h-[40px]">
        <FileArchive className="w-4 h-4 text-[#ae4d30]" />
        <span className="hidden sm:inline">Exportar PDFs por Período</span>
        <span className="sm:hidden">Exportar</span>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Exportar Contratos em PDF (.ZIP)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            Selecione o intervalo de datas desejado. Os contratos serão
            convertidos individualmente em PDF e empacotados em um arquivo ZIP
            nomeado pelo período (ex:{" "}
            <span className="font-semibold text-slate-900">
              Contratos {periodLabel}
            </span>
            ).
          </p>

          {/* Filtro de Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label
                htmlFor="export-contracts-start"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Data Inicial
              </label>
              <input
                id="export-contracts-start"
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="export-contracts-end"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Data Final
              </label>
              <input
                id="export-contracts-end"
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Filtro de Status de Assinatura */}
          <div>
            <label
              htmlFor="export-contracts-status"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Filtro por Assinatura
            </label>
            <select
              id="export-contracts-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white cursor-pointer"
            >
              <option value="ALL">Todos os contratos no período</option>
              <option value="SIGNED">
                Somente contratos assinados pelo cliente
              </option>
              <option value="PENDING">
                Somente contratos pendentes de assinatura
              </option>
            </select>
          </div>

          {/* Resumo do Período */}
          <div className="p-3.5 bg-[#fcfaf7] border border-[#f0ebe1] rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">
                {filteredContracts.length}{" "}
                {filteredContracts.length === 1
                  ? "contrato encontrado"
                  : "contratos encontrados"}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pasta de destino:{" "}
                <span className="font-semibold text-[#ae4d30]">
                  Contratos {periodLabel}
                </span>
              </p>
            </div>
            <span className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-full font-bold text-slate-600">
              Formato ZIP
            </span>
          </div>

          {/* Progresso durante a exportação */}
          {isExporting && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2.5 text-xs text-blue-800">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span>{progressText}</span>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isExporting}
              className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 bg-white border rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleExportZip}
              disabled={isExporting || filteredContracts.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Gerando ZIP...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Baixar Pasta ZIP (
                  {filteredContracts.length})
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
