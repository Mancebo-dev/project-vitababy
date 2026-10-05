"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Transaction = {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
  status: string;
  method: string | null;
  type: string;
};

export function DownloadFinanceReportButton({
  transactions,
  currentDate,
}: {
  transactions: Transaction[];
  currentDate: Date;
}) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const monthName = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

    doc.setFontSize(18);
    doc.text(`Relatório Financeiro - ${monthName}`, 14, 22);

    let totalIncome = 0;
    let totalExpense = 0;

    const tableData = transactions.map((t) => {
      if (t.status === "PAID") {
        if (t.type === "INCOME") totalIncome += t.amount;
        if (t.type === "EXPENSE") totalExpense += t.amount;
      }
      return [
        format(new Date(t.date), "dd/MM/yyyy"),
        t.description || "Pagamento de Serviço",
        t.method || "-",
        t.status === "PAID" ? "Pago" : "Pendente",
        t.type === "INCOME" ? "Entrada" : "Saída",
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(t.amount),
      ];
    });

    autoTable(doc, {
      startY: 30,
      head: [["Data", "Descrição", "Método", "Status", "Tipo", "Valor"]],
      body: tableData,
    });

    const balance = totalIncome - totalExpense;

    const finalY = (doc as any).lastAutoTable.finalY || 30;

    doc.setFontSize(12);
    doc.text(
      `Total Entradas: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalIncome)}`,
      14,
      finalY + 10,
    );
    doc.text(
      `Total Saídas: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpense)}`,
      14,
      finalY + 18,
    );
    doc.text(
      `Balanço Final: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(balance)}`,
      14,
      finalY + 26,
    );

    doc.save(`relatorio-financeiro-${format(currentDate, "MM-yyyy")}.pdf`);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="gap-2 text-slate-700 h-10 px-4 rounded-full"
    >
      <Download className="w-4 h-4" />
      Baixar Relatório PDF
    </Button>
  );
}
