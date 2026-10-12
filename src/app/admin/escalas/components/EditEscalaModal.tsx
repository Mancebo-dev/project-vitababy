"use client";

import { format } from "date-fns";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSchedule } from "../actions";

type ShiftItem = {
  id: string;
  dateStr: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  professionalId: string;
  status: string;
};

type ScheduleProps = {
  id: string;
  month: string;
  title: string | null;
  clientId?: string;
  client: { id?: string; name: string };
  shifts: {
    id: string;
    date: Date;
    startTime?: string | null;
    endTime?: string | null;
    status: string;
    professional: { id?: string; name: string };
  }[];
};

export function EditEscalaModal({
  schedule,
  professionals,
}: {
  schedule: ScheduleProps;
  professionals: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(schedule.title || "");
  const [month, setMonth] = useState(schedule.month || "");

  const [shifts, setShifts] = useState<ShiftItem[]>(() => {
    return schedule.shifts.map((s) => ({
      id: s.id,
      dateStr: format(
        new Date(
          new Date(s.date).getTime() +
            new Date(s.date).getTimezoneOffset() * 60000,
        ),
        "yyyy-MM-dd",
      ),
      startTime: s.startTime || "",
      endTime: s.endTime || "",
      professionalId: s.professional.id || "",
      status: s.status || "SCHEDULED",
    }));
  });

  const handleAddShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dateStr: month ? `${month}-01` : format(new Date(), "yyyy-MM-dd"),
        startTime: "",
        endTime: "",
        professionalId: professionals[0]?.id || "",
        status: "SCHEDULED",
      },
    ]);
  };

  const handleRemoveShift = (id: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateShift = (
    id: string,
    field: keyof ShiftItem,
    value: string,
  ) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !month) {
      alert("Título e mês de competência são obrigatórios.");
      return;
    }

    if (shifts.length === 0) {
      alert("A escala precisa ter pelo menos um plantão.");
      return;
    }

    setLoading(true);
    try {
      await updateSchedule({
        id: schedule.id,
        clientId: schedule.clientId || schedule.client.id || "",
        title,
        month,
        shifts: shifts.map((s) => ({
          date: new Date(`${s.dateStr}T00:00:00`),
          startTime: s.startTime || null,
          endTime: s.endTime || null,
          professionalId: s.professionalId,
          status: s.status,
        })),
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar escala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-slate-700 hover:text-slate-900 font-medium"
          >
            <Edit2 className="w-4 h-4 mr-1.5" /> Editar Escala
          </Button>
        }
      />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Escala: {schedule.client.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título da Escala *</Label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Escala Trimestral - Família Silva"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mês de Competência Inicial *</Label>
              <Input
                type="month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-base font-semibold text-slate-800">
                Plantões Agendados ({shifts.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddShift}
                className="text-xs flex items-center gap-1.5 bg-[#af4d30]/5 text-[#af4d30] border-[#af4d30]/20 hover:bg-[#af4d30]/10"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Plantão
              </Button>
            </div>

            <div className="max-h-[380px] overflow-y-auto border border-slate-200 rounded-lg p-2 sm:p-3 space-y-2.5 bg-slate-50/50">
              {shifts.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">
                  Nenhum plantão adicionado.
                </p>
              ) : (
                shifts.map((shift, idx) => (
                  <div
                    key={shift.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 text-sm shadow-2xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2.5"
                  >
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <span className="text-xs font-bold text-slate-400 w-6">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveShift(shift.id)}
                        className="sm:hidden p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remover este plantão"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 items-center">
                      <div className="sm:col-span-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden mb-0.5">
                          Data
                        </span>
                        <Input
                          type="date"
                          required
                          aria-label="Data do plantão"
                          value={shift.dateStr}
                          onChange={(e) =>
                            handleUpdateShift(
                              shift.id,
                              "dateStr",
                              e.target.value,
                            )
                          }
                          className="h-9 sm:h-8 text-xs"
                        />
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-2 gap-1.5">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden mb-0.5">
                            Início
                          </span>
                          <Input
                            type="time"
                            placeholder="Início"
                            aria-label="Horário de início"
                            value={shift.startTime}
                            onChange={(e) =>
                              handleUpdateShift(
                                shift.id,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="h-9 sm:h-8 text-xs"
                            title="Horário de Início (opcional)"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden mb-0.5">
                            Fim
                          </span>
                          <Input
                            type="time"
                            placeholder="Fim"
                            aria-label="Horário de término"
                            value={shift.endTime}
                            onChange={(e) =>
                              handleUpdateShift(
                                shift.id,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="h-9 sm:h-8 text-xs"
                            title="Horário de Fim (opcional)"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden mb-0.5">
                          Assessora
                        </span>
                        <select
                          required
                          aria-label="Assessora responsável"
                          className="flex h-9 sm:h-8 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#af4d30]"
                          value={shift.professionalId}
                          onChange={(e) =>
                            handleUpdateShift(
                              shift.id,
                              "professionalId",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Selecione assessora...</option>
                          {professionals.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden mb-0.5">
                          Status
                        </span>
                        <select
                          aria-label="Status do plantão"
                          className="flex h-9 sm:h-8 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#af4d30]"
                          value={shift.status}
                          onChange={(e) =>
                            handleUpdateShift(
                              shift.id,
                              "status",
                              e.target.value,
                            )
                          }
                        >
                          <option value="SCHEDULED">Agendado</option>
                          <option value="COMPLETED">Concluído</option>
                          <option value="CANCELLED">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveShift(shift.id)}
                      className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Remover este plantão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#af4d30] hover:bg-[#8c3d26] text-white w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
