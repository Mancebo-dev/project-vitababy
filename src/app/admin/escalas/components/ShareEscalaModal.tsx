"use client";

import {
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Calendar,
  CalendarDays,
  Clock,
  Download,
  MessageSquare,
  Share2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ScheduleProps = {
  id: string;
  month: string;
  title: string | null;
  client: { name: string; phone?: string | null };
  shifts: {
    id: string;
    date: Date;
    startTime?: string | null;
    endTime?: string | null;
    status: string;
    professional: { name: string; color: string | null; phone?: string | null };
  }[];
};

export function ShareEscalaModal({ schedule }: { schedule: ScheduleProps }) {
  const [open, setOpen] = useState(false);

  // Group shifts by professional
  const profMap = new Map<
    string,
    {
      name: string;
      phone?: string | null;
      shifts: typeof schedule.shifts;
    }
  >();

  for (const shift of schedule.shifts) {
    const profName = shift.professional.name;
    if (!profMap.has(profName)) {
      profMap.set(profName, {
        name: profName,
        phone: shift.professional.phone,
        shifts: [],
      });
    }
    profMap.get(profName)?.shifts.push(shift);
  }

  const professionals = Array.from(profMap.values());

  // Normalize date helper
  const getNormalizedDate = (d: Date) => {
    const raw = new Date(d);
    return new Date(raw.getTime() + raw.getTimezoneOffset() * 60000);
  };

  // Filter shifts for this week (next 7 days)
  const today = startOfDay(new Date());
  const inSevenDays = addDays(today, 7);
  const weekShifts = schedule.shifts.filter((s) => {
    const d = getNormalizedDate(s.date);
    return isWithinInterval(d, { start: today, end: inSevenDays });
  });

  // Filter shifts for today
  const todayShifts = schedule.shifts.filter((s) => {
    const d = getNormalizedDate(s.date);
    return isSameDay(d, today);
  });

  // Generate PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();

    // Header Vita Baby
    doc.setFillColor(175, 77, 48); // #af4d30
    doc.rect(0, 0, 210, 24, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("VITA BABY - ESCALA DE ATENDIMENTO", 14, 15);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${schedule.client.name}`, 14, 32);
    doc.text(`Período/Mês: ${schedule.title || schedule.month}`, 14, 38);
    doc.text(
      `Emitido em: ${format(currentDate, "dd/MM/yyyy 'às' HH:mm")}`,
      14,
      44,
    );

    const sortedShifts = [...schedule.shifts].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const tableData = sortedShifts.map((s) => {
      const d = getNormalizedDate(s.date);
      const diaSemana = format(d, "EEEE", { locale: ptBR });
      const diaSemanaCapitalized =
        diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
      const dataStr = format(d, "dd/MM/yyyy");
      const horarioStr = s.startTime
        ? `${s.startTime} às ${s.endTime || "A definir"}`
        : "Plantão (Dia todo)";

      return [
        dataStr,
        diaSemanaCapitalized,
        horarioStr,
        s.professional.name,
        s.status === "SCHEDULED" ? "Agendado" : s.status,
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [
        ["Data", "Dia da Semana", "Horário / Turno", "Assessora", "Status"],
      ],
      body: tableData,
      headStyles: {
        fillColor: [175, 77, 48],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3.5,
      },
      alternateRowStyles: {
        fillColor: [248, 247, 245],
      },
    });

    const filename = `escala-${schedule.client.name.toLowerCase().replace(/\s+/g, "-")}-${schedule.month}.pdf`;
    doc.save(filename);
  };

  // WhatsApp helper
  const openWhatsApp = (phone: string | null | undefined, text: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
    let url = "";
    if (cleanPhone) {
      const finalPhone = cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`;
      url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`;
    } else {
      url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    }
    window.open(url, "_blank");
  };

  const getShiftTextLine = (s: (typeof schedule.shifts)[0]) => {
    const d = getNormalizedDate(s.date);
    const dateFormatted = format(d, "dd/MM (EEEE)", { locale: ptBR });
    const timeFormatted = s.startTime
      ? `${s.startTime} às ${s.endTime || "A definir"}`
      : "Plantão / Dia todo";
    return `• *${dateFormatted}*: ${timeFormatted} - ${s.professional.name}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer">
          <Share2 className="w-3.5 h-3.5" /> Compartilhar / Enviar
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 font-heading">
            <Share2 className="w-5 h-5 text-emerald-600" /> Compartilhar Escala
          </DialogTitle>
          <DialogDescription>
            Envie a escala para as assessoras designadas, para o cliente ou
            baixe em PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* 1. PDF Download */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                PDF Oficial da Escala
              </h4>
              <p className="text-xs text-slate-500">
                Download em formato A4 timbrado com todas as datas e assessoras.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-slate-600" /> Baixar PDF
            </Button>
          </div>

          {/* 2. Enviar para Assessoras Designadas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#af4d30]" />
              <h4 className="text-sm font-bold text-slate-800">
                Enviar para Assessoras na Escala ({professionals.length})
              </h4>
            </div>
            <div className="space-y-2">
              {professionals.map((prof) => (
                <div
                  key={prof.name}
                  className="border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      {prof.name}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {prof.shifts.length}{" "}
                      {prof.shifts.length === 1 ? "plantão" : "plantões"}{" "}
                      atribuídos • {prof.phone || "Sem tel salvo"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5"
                    onClick={() => {
                      const msg =
                        `*Olá ${prof.name}, segue sua escala na Vita Baby!* 👶\n\n` +
                        `*Cliente:* ${schedule.client.name}\n` +
                        `*Mês/Período:* ${schedule.title || schedule.month}\n\n` +
                        `*Seus Plantões Agendados:*\n` +
                        prof.shifts.map(getShiftTextLine).join("\n") +
                        `\n\nQualquer dúvida entre em contato com a coordenação Vita Baby!`;
                      openWhatsApp(prof.phone, msg);
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Assessora
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Escalas por Recorte de Tempo */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#af4d30]" /> Recortes Rápidos
              por WhatsApp
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Escala do Mês */}
              <button
                type="button"
                onClick={() => {
                  const msg =
                    `*Escala Vita Baby - ${schedule.client.name}*\n` +
                    `*Mês:* ${schedule.month}\n\n` +
                    `*Todos os Plantões do Mês:*\n` +
                    schedule.shifts.map(getShiftTextLine).join("\n");
                  openWhatsApp(null, msg);
                }}
                className="p-3 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors cursor-pointer group"
              >
                <CalendarDays className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Mês Completo</p>
                <p className="text-[10px] text-slate-500">
                  Todos os {schedule.shifts.length} plantões
                </p>
              </button>

              {/* Escala da Semana */}
              <button
                type="button"
                onClick={() => {
                  const msg =
                    `*Escala Desta Semana - Vita Baby*\n` +
                    `*Cliente:* ${schedule.client.name}\n\n` +
                    `*Plantões nos próximos 7 dias:*\n` +
                    (weekShifts.length > 0
                      ? weekShifts.map(getShiftTextLine).join("\n")
                      : "Nenhum plantão previsto para os próximos 7 dias.");
                  openWhatsApp(null, msg);
                }}
                className="p-3 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors cursor-pointer group"
              >
                <Clock className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">Esta Semana</p>
                <p className="text-[10px] text-slate-500">
                  {weekShifts.length} plantões próximos
                </p>
              </button>

              {/* Plantão de Hoje */}
              <button
                type="button"
                onClick={() => {
                  const msg =
                    `*Plantão Vita Baby de Hoje (${format(today, "dd/MM")})*\n` +
                    `*Cliente:* ${schedule.client.name}\n\n` +
                    (todayShifts.length > 0
                      ? todayShifts.map(getShiftTextLine).join("\n")
                      : "Nenhum plantão agendado para hoje.");
                  openWhatsApp(null, msg);
                }}
                className="p-3 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-slate-800">
                  Plantão de Hoje
                </p>
                <p className="text-[10px] text-slate-500">
                  {todayShifts.length} plantão hoje
                </p>
              </button>
            </div>
          </div>

          {/* 4. Enviar para a Cliente */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Enviar para a Cliente ({schedule.client.name})
                </p>
                <p className="text-[11px] text-slate-500">
                  {schedule.client.phone
                    ? `WhatsApp: ${schedule.client.phone}`
                    : "Número não informado"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-xs gap-1.5"
              onClick={() => {
                const msg =
                  `*Olá ${schedule.client.name}!* Segue sua escala de atendimento Vita Baby: 🌸\n\n` +
                  `*Mês:* ${schedule.title || schedule.month}\n\n` +
                  `*Datas e Assessoras:*\n` +
                  schedule.shifts.map(getShiftTextLine).join("\n") +
                  `\n\nEstamos à disposição para qualquer ajuste!`;
                openWhatsApp(schedule.client.phone, msg);
              }}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />{" "}
              WhatsApp Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
