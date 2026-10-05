"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Professional = {
  id: string;
  name: string;
};

type Event = {
  title: string;
  type: string;
  date: Date;
  startTime: string | null;
  endTime: string | null;
  color?: string;
  professionalId?: string;
};

export function DownloadScheduleReportButton({
  professionals,
  events,
}: {
  professionals: Professional[];
  events: Event[];
}) {
  const [open, setOpen] = useState(false);

  const handleDownload = (profId?: string, profName?: string) => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const monthName = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

    doc.setFontSize(18);
    const title = profName
      ? `Relatório de Agendamentos - ${profName}`
      : `Relatório Geral de Agendamentos`;
    doc.text(title, 14, 22);

    doc.setFontSize(12);
    doc.text(`Gerado em: ${format(currentDate, "dd/MM/yyyy")}`, 14, 30);

    // Filter events
    const filteredEvents = events.filter((e) => {
      // If a specific professional is selected, filter by it.
      // Note: we might not have professionalId directly on all events if they are PlannerItems
      // But bookings have professional color or we could pass professionalId down.
      if (profId) {
        return e.professionalId === profId;
      }
      return true; // if general
    });

    // Sort by date then time
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      const timeA = a.startTime || "00:00";
      const timeB = b.startTime || "00:00";
      return timeA.localeCompare(timeB);
    });

    const tableData = filteredEvents.map((e) => [
      format(new Date(e.date), "dd/MM/yyyy"),
      e.startTime ? `${e.startTime} - ${e.endTime}` : "Dia todo",
      e.title,
      e.type === "BOOKING" ? "Consulta" : "Evento",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["Data", "Horário", "Descrição", "Tipo"]],
      body: tableData,
    });

    doc.save(
      `agenda-${profName ? profName.toLowerCase().replace(/\s+/g, "-") : "geral"}-${format(currentDate, "MM-yyyy")}.pdf`,
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-slate-700 h-10 px-4 rounded-full"
        >
          <Download className="w-4 h-4" />
          Baixar Agenda (PDF)
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload()}>
          Visão Geral (Todas)
        </DropdownMenuItem>
        {professionals.map((prof) => (
          <DropdownMenuItem
            key={prof.id}
            onClick={() => handleDownload(prof.id, prof.name)}
          >
            {prof.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
