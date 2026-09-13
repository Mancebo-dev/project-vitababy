"use client";

import type { ScheduleSlot } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, ChevronLeft, Clock } from "lucide-react";
import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import type { DatePreference } from "./types";

export function StepDateTime({
  availableSlots,
  professionalId,
  dates,
  onChangeDates,
  onNext,
  onBack,
}: {
  availableSlots: ScheduleSlot[];
  professionalId: string;
  dates: DatePreference[];
  onChangeDates: (dates: DatePreference[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const selectedDates = useMemo(() => {
    return dates
      .filter((d) => d.date)
      .map((d) => {
        const [year, month, day] = d.date.split("-").map(Number);
        return new Date(year, month - 1, day);
      });
  }, [dates]);

  const handleSelectDates = (newDates: Date[] | undefined) => {
    if (!newDates) {
      onChangeDates([]);
      return;
    }

    if (newDates.length > 3) {
      // O Calendar mode="multiple" e max={3} já deve limitar, mas garantimos aqui
      return;
    }

    const updated = newDates.map((d) => {
      const iso = format(d, "yyyy-MM-dd");
      const existing = dates.find((pref) => pref.date === iso);
      return existing || { date: iso, time: "" };
    });

    // Opcional: ordenar as datas cronologicamente
    updated.sort((a, b) => a.date.localeCompare(b.date));

    // Se a lista ficar vazia mas precisarmos ter pelo menos 1 slot no state do Wizard,
    // garantimos pelo menos um empty caso venha vazio, ou apenas passamos o vazio.
    // O BookingWizard lida bem com array vazio, ou inicializamos depois se precisar.
    if (updated.length === 0) {
      onChangeDates([{ date: "", time: "" }]);
    } else {
      onChangeDates(updated);
    }
  };

  const handleUpdateTime = (dateIso: string, time: string) => {
    const updated = dates.map((d) => {
      if (d.date === dateIso) {
        return { ...d, time };
      }
      return d;
    });
    onChangeDates(updated);
  };

  const validDates = dates.filter((d) => d.date);

  // Validação: precisa ter pelo menos 1 data, e todas as datas precisam ter horário
  const canProceed =
    validDates.length > 0 && validDates.every((d) => Boolean(d.time));

  const getSlotsForDate = (dateIso: string, profId: string) => {
    return availableSlots
      .filter((slot) => {
        const slotDateIso = format(new Date(slot.date), "yyyy-MM-dd");
        return slotDateIso === dateIso && slot.professionalId === profId;
      })
      .map((slot) => {
        const hour = parseInt(slot.startTime.split(":")[0], 10);
        return {
          time: slot.startTime,
          period: hour < 12 ? "morning" : "afternoon",
          available: true,
        };
      });
  };

  return (
    <div className="flex flex-col gap-[1.5rem] max-h-full">
      <div className="shrink-0 text-center md:text-left mb-2">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-heading font-bold text-[#411f03]">
          Escolha as datas e horários preferidos
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-[1.5rem] items-stretch justify-center flex-1 min-h-0">
        {/* Calendário Único Ampliado */}
        <div className="shrink-0 bg-[#fbf9f5] rounded-3xl border border-[#e4e2de] p-[1.5rem] w-full max-w-[420px] mx-auto md:mx-0 flex flex-col">
          <span className="block text-[0.9375rem] font-semibold text-[#411f03] mb-[1rem] text-center">
            Selecione até 3 dias:
          </span>
          <Calendar
            mode="multiple"
            max={3}
            selected={selectedDates}
            onSelect={handleSelectDates}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
              date.getDay() === 0
            }
            className="w-full flex justify-center bg-transparent border-0 flex-1"
            classNames={{
              caption_label: "text-xl font-bold text-slate-900",
              nav: "flex items-center justify-center absolute w-full top-4 gap-[240px] pointer-events-none z-10",
              weekday:
                "text-[#ae4d30] font-bold text-xs uppercase w-full text-center pb-2",
              day: "h-12 w-full text-center text-sm p-0 relative",
              day_button:
                "h-12 w-12 mx-auto rounded-xl p-0 font-medium text-slate-700 hover:bg-[#ae4d30]/20 hover:text-[#ae4d30] flex items-center justify-center transition-all duration-200",
            }}
          />
        </div>

        {/* Seletores de Horário para os dias escolhidos */}
        <div className="flex-1 w-full max-w-[420px] relative mx-auto md:mx-0 min-h-[250px] md:min-h-0">
          <div className="md:absolute inset-0 overflow-y-auto pr-2 flex flex-col gap-[1rem]">
            {validDates.length === 0 ? (
              <div className="p-[1.5rem] bg-white border border-[#e4e2de] border-dashed rounded-2xl text-center flex flex-col items-center justify-center h-full min-h-[200px]">
                <span className="text-[#a8a5a0] font-medium">
                  Nenhum dia selecionado.
                </span>
                <p className="text-[#7d7a75] text-[0.875rem] mt-1">
                  Clique no calendário ao lado para escolher as datas.
                </p>
              </div>
            ) : (
              validDates.map((pref, index) => {
                const slots = getSlotsForDate(pref.date, professionalId);
                const morningSlots = slots.filter(
                  (s) => s.period === "morning",
                );
                const afternoonSlots = slots.filter(
                  (s) => s.period === "afternoon",
                );
                const dateObj = new Date(`${pref.date}T12:00:00`);
                const dateLabel = format(dateObj, "EEEE, dd 'de' MMMM", {
                  locale: ptBR,
                });

                return (
                  <div
                    key={`time-selector-${pref.date}`}
                    className="bg-white border border-[#e4e2de] rounded-2xl p-[1.5rem] shadow-sm flex flex-col gap-[1rem] animate-fade-in-up"
                  >
                    <div className="flex items-center gap-[0.5rem] border-b border-[#f2ede9] pb-[0.75rem]">
                      <span className="w-6 h-6 rounded-full bg-[#af4d30] text-white text-[0.75rem] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-heading font-bold text-[#411f03] text-[1.0625rem] capitalize">
                        {dateLabel}
                      </h3>
                    </div>

                    {slots.length === 0 ? (
                      <div className="p-[1rem] bg-[#fdf2f0] border border-[#f5c6cb] rounded-xl flex items-center gap-[0.5rem] text-[#af4d30] text-[0.875rem]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Não há horários disponíveis neste dia.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[0.75rem]">
                        {morningSlots.length > 0 && (
                          <div>
                            <span className="text-[0.75rem] uppercase font-bold text-[#7d7a75] tracking-wider mb-[0.375rem] block">
                              Manhã
                            </span>
                            <div className="flex flex-wrap gap-[0.5rem]">
                              {morningSlots.map((slot) => {
                                const isSelected = pref.time === slot.time;
                                return (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() =>
                                      handleUpdateTime(pref.date, slot.time)
                                    }
                                    className={`px-[1rem] py-[0.5rem] rounded-xl text-[0.875rem] font-semibold border transition-all flex items-center gap-[0.375rem] ${
                                      isSelected
                                        ? "border-[#af4d30] bg-[#af4d30] text-white shadow-sm"
                                        : slot.available
                                          ? "border-[#e4e2de] bg-white text-[#411f03] hover:border-[#af4d30] hover:bg-[#fdf9f7]"
                                          : "border-[#eae8e4] bg-[#f5f3ef] text-[#a8a5a0] cursor-not-allowed line-through"
                                    }`}
                                  >
                                    <Clock className="w-3.5 h-3.5" />
                                    {slot.time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {afternoonSlots.length > 0 && (
                          <div>
                            <span className="text-[0.75rem] uppercase font-bold text-[#7d7a75] tracking-wider mb-[0.375rem] block">
                              Tarde
                            </span>
                            <div className="flex flex-wrap gap-[0.5rem]">
                              {afternoonSlots.map((slot) => {
                                const isSelected = pref.time === slot.time;
                                return (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() =>
                                      handleUpdateTime(pref.date, slot.time)
                                    }
                                    className={`px-[1rem] py-[0.5rem] rounded-xl text-[0.875rem] font-semibold border transition-all flex items-center gap-[0.375rem] ${
                                      isSelected
                                        ? "border-[#af4d30] bg-[#af4d30] text-white shadow-sm"
                                        : slot.available
                                          ? "border-[#e4e2de] bg-white text-[#411f03] hover:border-[#af4d30] hover:bg-[#fdf9f7]"
                                          : "border-[#eae8e4] bg-[#f5f3ef] text-[#a8a5a0] cursor-not-allowed line-through"
                                    }`}
                                  >
                                    <Clock className="w-3.5 h-3.5" />
                                    {slot.time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-[1.5rem] shrink-0 border-t border-[#e4e2de] mt-[1rem]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.875rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-full px-[1.5rem] h-[3rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-[0.9375rem]"
        >
          {canProceed
            ? "Continuar para Dados Pessoais"
            : "Escolha datas e horários"}
        </button>
      </div>
    </div>
  );
}
