"use client";

import { Plus, Trash2 } from "lucide-react";
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
import { createSchedule } from "../actions";

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
  const [month, setMonth] = useState("");
  const [title, setTitle] = useState("");

  const [shifts, setShifts] = useState<
    {
      id: string;
      date: string;
      startTime: string;
      endTime: string;
      professionalId: string;
    }[]
  >([]);

  const handleAddShift = () => {
    setShifts([
      ...shifts,
      {
        id: crypto.randomUUID(),
        date: "",
        startTime: "09:00",
        endTime: "10:00",
        professionalId: professionals[0]?.id || "",
      },
    ]);
  };

  const handleRemoveShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  const handleShiftChange = (index: number, field: string, value: string) => {
    const newShifts = [...shifts];
    newShifts[index] = { ...newShifts[index], [field]: value };
    setShifts(newShifts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !month || shifts.length === 0) {
      alert("Preencha o cliente, mês e adicione pelo menos um plantão.");
      return;
    }

    if (
      shifts.some(
        (s) => !s.date || !s.startTime || !s.endTime || !s.professionalId,
      )
    ) {
      alert("Preencha todos os campos dos plantões.");
      return;
    }

    setLoading(true);
    try {
      const parsedShifts = shifts.map((s) => ({
        date: new Date(`${s.date}T00:00:00`),
        startTime: s.startTime,
        endTime: s.endTime,
        professionalId: s.professionalId,
      }));

      await createSchedule({
        clientId,
        month,
        title,
        shifts: parsedShifts,
      });
      setOpen(false);
      setClientId("");
      setMonth("");
      setTitle("");
      setShifts([]);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar escala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90 font-bold flex gap-2" />
        }
      >
        <Plus className="w-5 h-5" />
        Nova Escala Mensal
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-50">
        <DialogHeader className="shrink-0 bg-white p-6 border-b border-slate-200">
          <DialogTitle className="text-xl">Criar Escala de Cliente</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form id="escala-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Mês (ex: 10/2026) *</Label>
                <Input
                  required
                  placeholder="MM/YYYY"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Título Opcional (ex: Pacote Pós-Parto VIP)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Escala Mensal"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Plantões / Visitas
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddShift}
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Visita
                </Button>
              </div>

              {shifts.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-500">
                  Nenhum plantão adicionado. Clique no botão acima para
                  adicionar.
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts.map((shift, index) => (
                    <div
                      key={shift.id}
                      className="flex flex-wrap md:flex-nowrap items-end gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                    >
                      <div className="space-y-2 flex-1 min-w-[140px]">
                        <Label className="text-xs text-slate-500">Data</Label>
                        <Input
                          type="date"
                          required
                          value={shift.date}
                          onChange={(e) =>
                            handleShiftChange(index, "date", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2 w-24">
                        <Label className="text-xs text-slate-500">Início</Label>
                        <Input
                          type="time"
                          required
                          value={shift.startTime}
                          onChange={(e) =>
                            handleShiftChange(
                              index,
                              "startTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 w-24">
                        <Label className="text-xs text-slate-500">Fim</Label>
                        <Input
                          type="time"
                          required
                          value={shift.endTime}
                          onChange={(e) =>
                            handleShiftChange(index, "endTime", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2 flex-[2] min-w-[180px]">
                        <Label className="text-xs text-slate-500">
                          Assessora
                        </Label>
                        <select
                          required
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          value={shift.professionalId}
                          onChange={(e) =>
                            handleShiftChange(
                              index,
                              "professionalId",
                              e.target.value,
                            )
                          }
                        >
                          {professionals.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => handleRemoveShift(index)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="shrink-0 bg-white p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="escala-form"
            className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90 font-medium px-6"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Escala"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
