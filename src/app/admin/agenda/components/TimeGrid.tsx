"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import type { AgendaEvent } from "./Planner";

interface TimeGridProps {
  date: Date;
  view: "1d" | "3d" | "7d" | "14d";
  items: AgendaEvent[];
}

export function TimeGrid({ date, view, items }: TimeGridProps) {
  // Generate days based on view
  const days = useMemo(() => {
    let start = date;
    if (view === "7d" || view === "14d") {
      start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
    }

    let daysCount = 1;
    if (view === "3d") daysCount = 3;
    if (view === "7d") daysCount = 7;
    if (view === "14d") daysCount = 14;

    return Array.from({ length: daysCount }).map((_, i) => addDays(start, i));
  }, [date, view]);

  // 24 hours
  const hours = Array.from({ length: 24 }).map((_, i) => i);

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-0 min-w-0 relative">
      {/* Container principal com scroll bidirecional */}
      <div className="flex-1 overflow-auto custom-scrollbar relative flex">
        {/* Coluna fixa à esquerda (Horários) */}
        <div className="w-[60px] shrink-0 sticky left-0 z-30 bg-white border-r border-slate-100 flex flex-col">
          {/* Canto superior esquerdo vazio (Header) */}
          <div className="h-[60px] sticky top-0 z-40 bg-white border-b border-slate-200 shrink-0" />

          {/* Horários ao longo da coluna */}
          <div className="flex-1 relative">
            {hours.map((h) => (
              <div
                key={h}
                className="h-[60px] flex justify-end pr-2 pt-1 w-full border-b border-transparent"
              >
                <span className="text-xs font-medium text-slate-400 leading-none">
                  {h.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade central (Dias + Linhas + Eventos) */}
        <div className="flex flex-col flex-1 min-w-max">
          {/* Cabeçalho dos dias (Fixo no topo) */}
          <div className="flex h-[60px] sticky top-0 z-20 bg-white border-b border-slate-200 shrink-0">
            {days.map((d) => {
              const isToday = isSameDay(d, new Date());
              return (
                <div
                  key={d.toISOString()}
                  className="flex-1 min-w-[150px] py-1 text-center border-r border-slate-100 last:border-r-0 flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase">
                    {format(d, "EEE", { locale: ptBR })}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-bold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${isToday ? "bg-[#af4d30] text-white" : "text-slate-800"}`}
                  >
                    {format(d, "d")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Área de conteúdo e Eventos */}
          <div className="flex flex-1 relative bg-white">
            {days.map((d) => (
              <div
                key={`col-${d.toISOString()}`}
                className="flex-1 min-w-[150px] border-r border-slate-100 last:border-r-0 relative"
              >
                {/* Linhas Horizontais */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-[60px] border-b border-slate-50 w-full"
                  />
                ))}

                {/* Eventos neste dia */}
                {items
                  .filter((item) => isSameDay(new Date(item.date), d))
                  .map((item, idx) => {
                    const [startH, startM] = (item.startTime || "09:00")
                      .split(":")
                      .map(Number);
                    const [endH, endM] = (item.endTime || "10:00")
                      .split(":")
                      .map(Number);

                    const top = startH * 60 + startM;
                    const height = endH * 60 + endM - top;

                    return (
                      <div
                        key={item.id || idx}
                        className="absolute left-1 right-1 rounded-md p-1.5 text-xs text-white shadow-sm overflow-hidden flex flex-col transition-transform hover:scale-[1.02] hover:z-50"
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 20)}px`,
                          backgroundColor: item.color || "#ae4d30",
                          opacity: 0.9,
                          zIndex: 10,
                        }}
                        title={`${item.startTime} - ${item.endTime}: ${item.title}`}
                      >
                        <span className="font-bold truncate">{item.title}</span>
                        {height > 30 && (
                          <span className="truncate opacity-90">
                            {item.startTime} - {item.endTime}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
