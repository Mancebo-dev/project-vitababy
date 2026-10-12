"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getWeekOfMonth,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSchedule } from "../actions";

const DAYS_OF_WEEK = [
  { id: 1, label: "Seg", full: "Segunda-feira" },
  { id: 2, label: "Ter", full: "Terça-feira" },
  { id: 3, label: "Qua", full: "Quarta-feira" },
  { id: 4, label: "Qui", full: "Quinta-feira" },
  { id: 5, label: "Sex", full: "Sexta-feira" },
  { id: 6, label: "Sáb", full: "Sábado" },
  { id: 0, label: "Dom", full: "Domingo" },
];

export function NewEscalaModal({
  clients,
  professionals,
}: {
  clients: { id: string; name: string }[];
  professionals: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [startMonth, setStartMonth] = useState(() =>
    format(new Date(), "yyyy-MM"),
  );
  const [durationMonths, setDurationMonths] = useState(3);
  const [title, setTitle] = useState("");

  // Dias da semana selecionados (default: Seg a Sex)
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Modo de semanas: "ALL" | "ODD" | "EVEN"
  const [weekFrequency, setWeekFrequency] = useState<"ALL" | "ODD" | "EVEN">(
    "ALL",
  );

  // Assessora padrão
  const [defaultProfId, setDefaultProfId] = useState(
    professionals[0]?.id || "",
  );

  // Horários opcionais
  const [hasSpecificHours, setHasSpecificHours] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");

  // Lista de shifts calculados
  const [generatedShifts, setGeneratedShifts] = useState<
    {
      id: string;
      date: Date;
      startTime?: string | null;
      endTime?: string | null;
      professionalId: string;
    }[]
  >([]);

  const handleToggleDay = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId],
    );
  };

  const handleSelectBusinessDays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const handleSelectAllDays = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSelectWeekend = () => {
    setSelectedDays([0, 6]);
  };

  // Gerador automático das datas da escala
  const handleGeneratePreview = () => {
    if (!startMonth || selectedDays.length === 0) {
      alert("Selecione o mês inicial e ao menos um dia da semana.");
      return;
    }

    const [yearStr, monthStr] = startMonth.split("-");
    const startDate = new Date(
      Number.parseInt(yearStr, 10),
      Number.parseInt(monthStr, 10) - 1,
      1,
    );

    const calculated: {
      id: string;
      date: Date;
      startTime?: string | null;
      endTime?: string | null;
      professionalId: string;
    }[] = [];

    for (let m = 0; m < durationMonths; m++) {
      const currentMonthDate = addMonths(startDate, m);
      const startOfCurrentMonth = startOfMonth(currentMonthDate);
      const endOfCurrentMonth = endOfMonth(currentMonthDate);

      const allDays = eachDayOfInterval({
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      });

      for (const day of allDays) {
        const dayOfWeek = getDay(day);
        const weekNum = getWeekOfMonth(day, { weekStartsOn: 1 });

        // Verifica filtro de dia da semana
        if (!selectedDays.includes(dayOfWeek)) continue;

        // Verifica frequência da semana
        if (weekFrequency === "ODD" && weekNum % 2 === 0) continue;
        if (weekFrequency === "EVEN" && weekNum % 2 !== 0) continue;

        calculated.push({
          id: `${day.toISOString()}-${Math.random().toString(36).substring(2, 7)}`,
          date: day,
          startTime: hasSpecificHours ? startTime : null,
          endTime: hasSpecificHours ? endTime : null,
          professionalId: defaultProfId || professionals[0]?.id || "",
        });
      }
    }

    setGeneratedShifts(calculated);
  };

  const handleRemoveShift = (id: string) => {
    setGeneratedShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateShiftProf = (id: string, profId: string) => {
    setGeneratedShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, professionalId: profId } : s)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    const finalShifts = generatedShifts;
    if (finalShifts.length === 0) {
      // Se não gerou prévia explicitamente, gera agora
      handleGeneratePreview();
      return;
    }

    setLoading(true);
    try {
      const clientName =
        clients.find((c) => c.id === clientId)?.name || "Cliente";
      const scheduleTitle =
        title ||
        `Escala ${durationMonths} Meses (${startMonth}) - ${clientName}`;

      await createSchedule({
        clientId,
        month: startMonth,
        title: scheduleTitle,
        shifts: finalShifts,
      });

      setOpen(false);
      setGeneratedShifts([]);
      setTitle("");
      setClientId("");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar escala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Nova Escala Flexível
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <CalendarDays className="w-5 h-5 text-[#af4d30]" />
            Criador Flexível de Escalas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Cliente e Período */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label
                htmlFor="modal-client"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Cliente *
              </label>
              <select
                id="modal-client"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                <option value="">Selecione o cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-month"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Mês de Início *
              </label>
              <input
                id="modal-month"
                type="month"
                required
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="modal-duration"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Duração (Meses)
              </label>
              <select
                id="modal-duration"
                value={durationMonths}
                onChange={(e) =>
                  setDurationMonths(Number.parseInt(e.target.value, 10))
                }
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                <option value={1}>1 mês</option>
                <option value={2}>2 meses</option>
                <option value={3}>3 meses (Trimestral)</option>
                <option value={4}>4 meses</option>
                <option value={6}>6 meses (Semestral)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="modal-title"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Título da Escala (Opcional)
              </label>
              <input
                id="modal-title"
                placeholder="Ex: Escala de Acompanhamento Noturno"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Seleção dos Dias da Semana */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dias da Semana do Atendimento
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectBusinessDays}
                  className="text-xs text-[#af4d30] hover:underline font-medium"
                >
                  Seg a Sex
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleSelectAllDays}
                  className="text-xs text-[#af4d30] hover:underline font-medium"
                >
                  Todos os dias
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleSelectWeekend}
                  className="text-xs text-[#af4d30] hover:underline font-medium"
                >
                  Finais de semana
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = selectedDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleToggleDay(d.id)}
                    className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                      isSelected
                        ? "bg-[#af4d30] text-white border-[#af4d30] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequência de Semanas e Assessora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label
                htmlFor="modal-weeks"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Quais Semanas do Mês?
              </label>
              <select
                id="modal-weeks"
                value={weekFrequency}
                onChange={(e) =>
                  setWeekFrequency(e.target.value as "ALL" | "ODD" | "EVEN")
                }
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                <option value="ALL">Todas as semanas do mês</option>
                <option value="ODD">Semanas ímpares (1ª e 3ª semana)</option>
                <option value="EVEN">Semanas pares (2ª e 4ª semana)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-prof"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Assessora Padrão
              </label>
              <select
                id="modal-prof"
                value={defaultProfId}
                onChange={(e) => setDefaultProfId(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Horários Opcionais */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={hasSpecificHours}
                  onChange={(e) => setHasSpecificHours(e.target.checked)}
                  className="rounded border-slate-300 text-[#af4d30] focus:ring-[#af4d30] w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Definir horários específicos (opcional — caso desmarcado,
                  conta como Plantão/Dia Todo)
                </span>
              </label>

              {hasSpecificHours && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Início:</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Fim:</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão para Gerar Prévia */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGeneratePreview}
              className="text-xs font-semibold text-slate-700"
            >
              <Layers className="w-4 h-4 mr-1.5 text-slate-500" />
              Calcular & Visualizar Plantões
            </Button>

            {generatedShifts.length > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {generatedShifts.length} plantões calculados
              </span>
            )}
          </div>

          {/* Lista de Prévia de Plantões */}
          {generatedShifts.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white max-h-60 overflow-y-auto space-y-2">
              <span className="text-xs font-bold text-slate-700 block mb-2 uppercase">
                Prévia de Dias Agendados ({generatedShifts.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {generatedShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-2 border rounded-lg text-xs flex items-center justify-between bg-slate-50"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        {format(shift.date, "dd/MM/yyyy (EEE)", {
                          locale: ptBR,
                        })}
                      </span>
                      {shift.startTime && (
                        <span className="text-slate-500 ml-1.5">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={shift.professionalId}
                        onChange={(e) =>
                          handleUpdateShiftProf(shift.id, e.target.value)
                        }
                        className="text-[11px] py-0.5 px-1.5 border rounded bg-white"
                      >
                        {professionals.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveShift(shift.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                `Criar Escala (${generatedShifts.length || "Calcular"})`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
