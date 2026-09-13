"use client";

import type { Professional } from "@prisma/client";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfWeek,
  subDays,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createScheduleSlot, deleteScheduleSlot } from "../actions";

type ScheduleSlot = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  professionalId: string;
};

type ViewMode = "1d" | "3d" | "7d" | "14d";

export function ScheduleManager({
  initialSlots,
  professionals,
}: {
  initialSlots: ScheduleSlot[];
  professionals: Professional[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewMode>("7d");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [professionalId, setProfessionalId] = useState(
    professionals[0]?.id || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation handlers
  const handlePrev = () => {
    switch (view) {
      case "1d":
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case "3d":
        setSelectedDate(subDays(selectedDate, 3));
        break;
      case "7d":
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case "14d":
        setSelectedDate(subWeeks(selectedDate, 2));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "1d":
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case "3d":
        setSelectedDate(addDays(selectedDate, 3));
        break;
      case "7d":
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case "14d":
        setSelectedDate(addWeeks(selectedDate, 2));
        break;
    }
  };

  const handleToday = () => setSelectedDate(new Date());

  const getHeaderTitle = () => {
    return format(selectedDate, "MMMM yyyy", { locale: ptBR });
  };

  // Determine the days to show based on selectedDate and view
  const daysInGrid = useMemo(() => {
    let start = selectedDate;
    if (view === "7d" || view === "14d") {
      start = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    }

    let daysCount = 1;
    if (view === "3d") daysCount = 3;
    if (view === "7d") daysCount = 7;
    if (view === "14d") daysCount = 14;

    return Array.from({ length: daysCount }).map((_, i) => addDays(start, i));
  }, [selectedDate, view]);

  // Define grid hours
  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour + 1 }).map(
    (_, i) => startHour + i,
  );
  const HOUR_HEIGHT = 80; // pixels per hour for better readability

  const handleAddSlot = async () => {
    if (!selectedDate || !startTime || !endTime || !professionalId) {
      alert("Preencha todos os campos.");
      return;
    }
    setIsSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const dateObj = new Date(`${dateStr}T00:00:00`);

      await createScheduleSlot({
        date: dateObj,
        startTime,
        endTime,
        professionalId,
      });

      const endH = parseInt(endTime.split(":")[0], 10);
      if (endH < 23) {
        setStartTime(endTime);
        setEndTime(`${String(endH + 1).padStart(2, "0")}:00`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este horário?")) {
      await deleteScheduleSlot(id);
    }
  };

  const getSlotPosition = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const topMinutes = (startH - startHour) * 60 + startM;
    const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

    return {
      top: `${(topMinutes / 60) * HOUR_HEIGHT}px`,
      height: `${(durationMinutes / 60) * HOUR_HEIGHT}px`,
    };
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full h-full min-h-0 min-w-0">
      {/* Sidebar Controls */}
      <div className="xl:w-[320px] flex-shrink-0 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="bg-white p-4 rounded-3xl shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            className="w-full flex justify-center"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Horário
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prof" className="text-slate-600">
                Assessora
              </Label>
              <select
                id="prof"
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start" className="text-slate-600">
                  Início
                </Label>
                <Input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-200 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end" className="text-slate-600">
                  Fim
                </Label>
                <Input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-200 h-11"
                />
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl bg-[#ae4d30] hover:bg-[#ae4d30]/90 text-white font-semibold shadow-sm"
              onClick={handleAddSlot}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar na Agenda"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-100 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleToday}
              className="hidden sm:inline-flex"
            >
              Hoje
            </Button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-heading font-bold text-lg text-slate-800 capitalize min-w-[140px] text-center">
                {getHeaderTitle()}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            {(["1d", "3d", "7d", "14d"] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setView(m)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  view === m
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {m === "1d" && "Dia"}
                {m === "3d" && "3 Dias"}
                {m === "7d" && "Semana"}
                {m === "14d" && "2 Semanas"}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto custom-scrollbar relative flex">
          {/* Coluna fixa à esquerda (Horários) */}
          <div className="w-[80px] shrink-0 sticky left-0 z-30 bg-slate-50/90 backdrop-blur-sm border-r border-slate-100 flex flex-col">
            {/* Header spacer */}
            <div className="h-[60px] sticky top-0 z-40 bg-slate-50 border-b border-slate-200 shrink-0" />

            <div className="flex-1 relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative flex justify-center pt-2 text-xs font-medium text-slate-400 w-full"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  <span className="bg-slate-50 px-1 rounded leading-none">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grade central */}
          <div className="flex flex-col flex-1 min-w-max">
            {/* Cabeçalho dos dias */}
            <div className="flex h-[60px] sticky top-0 z-20 bg-white border-b border-slate-200 shrink-0">
              {daysInGrid.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    className={`flex-1 min-w-[140px] py-1 text-center border-r border-slate-100 last:border-r-0 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-slate-50"}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span
                      className={`text-[10px] sm:text-xs font-medium uppercase ${isToday || isSelected ? "text-primary" : "text-slate-400"}`}
                    >
                      {format(day, "EEE", { locale: ptBR })}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-bold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-primary text-white shadow-md"
                          : isToday
                            ? "text-primary"
                            : "text-slate-700"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid Body */}
            <div className="flex flex-1 relative bg-white">
              {daysInGrid.map((day) => {
                const daySlots = initialSlots.filter((s) =>
                  isSameDay(new Date(s.date), day),
                );

                return (
                  <div
                    key={day.toISOString()}
                    className="flex-1 min-w-[140px] border-r border-slate-100 last:border-r-0 relative"
                  >
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="w-full border-b border-slate-50"
                          style={{ height: `${HOUR_HEIGHT}px` }}
                        />
                      ))}
                    </div>

                    {daySlots.map((slot) => {
                      const prof = professionals.find(
                        (p) => p.id === slot.professionalId,
                      );
                      const { top, height } = getSlotPosition(
                        slot.startTime,
                        slot.endTime,
                      );

                      return (
                        <div
                          key={slot.id}
                          className="absolute left-1 right-1 rounded-lg p-2 text-xs overflow-hidden group shadow-sm transition-transform hover:z-20 hover:scale-[1.02]"
                          style={{
                            top,
                            height,
                            backgroundColor: slot.isBooked
                              ? "#fffbeb"
                              : `${prof?.color || "#ae4d30"}15`,
                            borderLeft: `4px solid ${slot.isBooked ? "#f59e0b" : prof?.color || "#ae4d30"}`,
                            border: slot.isBooked
                              ? "1px solid #fef3c7"
                              : `1px solid ${prof?.color || "#ae4d30"}30`,
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <span
                              className="font-bold whitespace-nowrap"
                              style={{
                                color: slot.isBooked
                                  ? "#b45309"
                                  : prof?.color || "#ae4d30",
                              }}
                            >
                              {slot.startTime}
                            </span>
                            {!slot.isBooked && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(slot.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-rose-500 bg-white/80 rounded-full p-1 -mt-1 -mr-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="mt-1 truncate font-medium text-slate-700">
                            {prof?.name || "Assessora"}
                          </div>
                          {slot.isBooked && (
                            <div className="mt-1 text-[10px] text-amber-600 font-semibold uppercase tracking-wider bg-amber-100/50 inline-block px-1.5 py-0.5 rounded">
                              Reservado
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
