"use client";

import { AlertCircle, ChevronLeft, Clock, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { getAvailableSlots } from "./data";
import type { DatePreference } from "./types";

interface StepDateTimeProps {
  professionalId: string;
  dates: DatePreference[];
  onChangeDates: (dates: DatePreference[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDateTime({
  professionalId,
  dates,
  onChangeDates,
  onNext,
  onBack,
}: StepDateTimeProps) {
  // Gera os próximos 7 dias para atalho rápido
  const quickDays = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const weekDay = d.toLocaleDateString("pt-BR", { weekday: "short" });
      const dayNum = d.getDate();
      const monthStr = d.toLocaleDateString("pt-BR", { month: "short" });
      list.push({ iso, weekDay, dayNum, monthStr });
    }
    return list;
  }, []);

  const handleUpdateDate = (index: number, date: string) => {
    const updated = [...dates];
    updated[index] = { ...updated[index], date, time: "" }; // reset time when date changes
    onChangeDates(updated);
  };

  const handleUpdateTime = (index: number, time: string) => {
    const updated = [...dates];
    updated[index] = { ...updated[index], time };
    onChangeDates(updated);
  };

  const handleAddDateOption = () => {
    if (dates.length < 3) {
      // Find a reasonable default date (next quick day not yet used)
      const usedDates = new Set(dates.map((d) => d.date));
      const nextAvailable =
        quickDays.find((q) => !usedDates.has(q.iso))?.iso || "";
      onChangeDates([...dates, { date: nextAvailable, time: "" }]);
    }
  };

  const handleRemoveDateOption = (index: number) => {
    if (dates.length > 1) {
      const updated = dates.filter((_, i) => i !== index);
      onChangeDates(updated);
    }
  };

  // Validação: Opção principal (index 0) precisa ter data e horário selecionados
  const isOption1Valid = Boolean(dates[0]?.date && dates[0]?.time);
  // Se houver opções extras, elas só são válidas se tiverem horário escolhido (ou se o usuário preencheu data, deve ter horário)
  const allFilledValid = dates.every((d) => !d.date || Boolean(d.time));
  const canProceed = isOption1Valid && allFilledValid;

  return (
    <div className="flex flex-col gap-[2rem]">
      <div>
        <span className="text-[#af4d30] font-semibold text-[0.875rem] uppercase tracking-wider">
          Passo 3 de 5
        </span>
        <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-heading font-bold text-[#411f03] mt-[0.25rem]">
          Escolha as datas e horários preferidos
        </h2>
        <p className="text-[#444840] text-[0.9375rem] mt-[0.25rem]">
          Você pode indicar <strong>até 3 opções de datas</strong> por ordem de
          preferência. Isso agiliza a confirmação da sua consulta caso haja
          algum conflito de deslocamento.
        </p>
      </div>

      <div className="flex flex-col gap-[1.5rem]">
        {dates.map((pref, index) => {
          const slots = pref.date
            ? getAvailableSlots(pref.date, professionalId)
            : [];
          const morningSlots = slots.filter((s) => s.period === "morning");
          const afternoonSlots = slots.filter((s) => s.period === "afternoon");

          return (
            <div
              key={`preference-slot-${pref.date || "empty"}-${index}`}
              className="bg-white border border-[#e4e2de] rounded-2xl p-[1.5rem] shadow-sm relative flex flex-col gap-[1.25rem]"
            >
              <div className="flex items-center justify-between border-b border-[#f2ede9] pb-[0.75rem]">
                <div className="flex items-center gap-[0.5rem]">
                  <span className="w-6 h-6 rounded-full bg-[#af4d30] text-white text-[0.75rem] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-heading font-bold text-[#411f03] text-[1.0625rem]">
                    {index === 0
                      ? "1ª Opção de Data (Preferência Principal)"
                      : `${index + 1}ª Opção de Data (Alternativa)`}
                  </h3>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDateOption(index)}
                    className="text-[#99473b] hover:text-[#7f1d1d] text-[0.8125rem] flex items-center gap-[0.25rem] transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remover esta opção
                  </button>
                )}
              </div>

              {/* Seletor de Data */}
              <div>
                <span className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.5rem]">
                  Selecione o Dia:
                </span>

                {/* Quick day buttons */}
                <div className="flex gap-[0.5rem] overflow-x-auto pb-[0.5rem] mb-[0.75rem]">
                  {quickDays.map((q) => {
                    const isSelected = pref.date === q.iso;
                    return (
                      <button
                        key={q.iso}
                        type="button"
                        onClick={() => handleUpdateDate(index, q.iso)}
                        className={`flex flex-col items-center justify-center min-w-[4rem] py-[0.5rem] px-[0.75rem] rounded-xl border text-[0.8125rem] transition-all shrink-0 ${
                          isSelected
                            ? "border-[#af4d30] bg-[#af4d30] text-white font-bold shadow-sm"
                            : "border-[#e4e2de] bg-[#fbf9f5] text-[#444840] hover:border-[#d19a7e]"
                        }`}
                      >
                        <span className="uppercase text-[0.6875rem] opacity-80">
                          {q.weekDay}
                        </span>
                        <span className="text-[1.125rem] font-bold">
                          {q.dayNum}
                        </span>
                        <span className="text-[0.6875rem]">{q.monthStr}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Manual date input fallback */}
                <div className="flex items-center gap-[0.5rem]">
                  <span className="text-[0.8125rem] text-[#7d7a75]">
                    Ou escolha outra data:
                  </span>
                  <input
                    type="date"
                    aria-label="Selecionar data no calendário"
                    value={pref.date}
                    min={quickDays[0]?.iso}
                    onChange={(e) => handleUpdateDate(index, e.target.value)}
                    className="border border-[#e4e2de] rounded-lg px-[0.75rem] py-[0.375rem] text-[0.875rem] text-[#444840] focus:border-[#af4d30] focus:ring-1 focus:ring-[#af4d30] outline-none"
                  />
                </div>
              </div>

              {/* Seletor de Horários */}
              {pref.date ? (
                <div>
                  <span className="block text-[0.875rem] font-semibold text-[#411f03] mb-[0.5rem]">
                    Horários disponíveis para esta data:
                  </span>

                  {slots.length === 0 ? (
                    <div className="p-[1rem] bg-[#fdf2f0] border border-[#f5c6cb] rounded-xl flex items-center gap-[0.5rem] text-[#af4d30] text-[0.875rem]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Não há horários de atendimento aos domingos. Por favor,
                        selecione outro dia.
                      </span>
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
                                    handleUpdateTime(index, slot.time)
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
                                  {!slot.available && (
                                    <span className="text-[0.6875rem] font-normal no-underline ml-1">
                                      (Ocupado)
                                    </span>
                                  )}
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
                                    handleUpdateTime(index, slot.time)
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
                                  {!slot.available && (
                                    <span className="text-[0.6875rem] font-normal no-underline ml-1">
                                      (Ocupado)
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[0.875rem] text-[#7d7a75] italic">
                  Selecione um dia acima para visualizar os horários
                  disponíveis.
                </p>
              )}
            </div>
          );
        })}

        {dates.length < 3 && (
          <button
            type="button"
            onClick={handleAddDateOption}
            className="w-full py-[1rem] border-2 border-dashed border-[#d19a7e] hover:border-[#af4d30] bg-[#fbf9f5] hover:bg-[#f8f2ee] text-[#af4d30] rounded-2xl font-semibold flex items-center justify-center gap-[0.5rem] transition-colors text-[0.9375rem]"
          >
            <Plus className="w-4 h-4" /> Adicionar mais uma opção de data (
            {dates.length === 1 ? "2ª opção" : "3ª opção"})
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-[1rem]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Profissional
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-full px-[2rem] h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-[0.9375rem]"
        >
          {canProceed
            ? "Continuar para Dados Pessoais"
            : "Escolha data e horário para prosseguir"}
        </button>
      </div>
    </div>
  );
}
