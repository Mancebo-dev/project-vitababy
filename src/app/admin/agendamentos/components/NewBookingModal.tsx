"use client";

import type {
  Client,
  Professional,
  ScheduleSlot,
  ServicePackage,
} from "@prisma/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
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
import { createManualBooking } from "../actions";

export function NewBookingModal({
  clients,
  packages,
  slots,
  professionals,
}: {
  clients: Client[];
  packages: (ServicePackage & { service: { name: string } })[];
  slots: (ScheduleSlot & { professional: Professional })[];
  professionals: Professional[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [scheduleSlotId, setScheduleSlotId] = useState("");

  // Custom slot states
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");
  const [newSlotType, setNewSlotType] = useState<"ONLINE" | "IN_PERSON">(
    "IN_PERSON",
  );
  const [newSlotProfessionalId, setNewSlotProfessionalId] = useState("");

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [transportFee, setTransportFee] = useState<number>(0);

  // Auto-calculate transport fee based on client city
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client?.city && client.city.toLowerCase() !== "macaé") {
      setTransportFee(150); // Default outside fee
    } else {
      setTransportFee(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || packageIds.length === 0) {
      alert("Selecione o cliente e o serviço desejado.");
      return;
    }

    if (!isCreatingSlot && !scheduleSlotId) {
      alert("Selecione um horário ou crie um novo.");
      return;
    }

    if (isCreatingSlot && (!newSlotDate || !newSlotProfessionalId)) {
      alert("Informe a data e o profissional para o novo horário.");
      return;
    }

    setLoading(true);
    try {
      await createManualBooking({
        clientId,
        packageIds,
        professionalId: isCreatingSlot
          ? newSlotProfessionalId
          : (slots.find((s) => s.id === scheduleSlotId)?.professionalId ?? ""),
        scheduleSlotId: isCreatingSlot ? undefined : scheduleSlotId,
        newSlot: isCreatingSlot
          ? {
              date: new Date(`${newSlotDate}T00:00:00`),
              startTime: newSlotStartTime || null,
              endTime: newSlotEndTime || null,
              type: newSlotType,
            }
          : undefined,
        additionalInfo,
        transportFee,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90 font-bold rounded-lg px-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </Button>
        }
      />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Criar Agendamento Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae4d30]"
                value={clientId}
                onChange={handleClientChange}
              >
                <option value="">Selecione um cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city || "Sem cidade"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Serviço / Pacote *</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae4d30]"
                value={packageIds[0] || ""}
                onChange={(e) =>
                  setPackageIds(e.target.value ? [e.target.value] : [])
                }
              >
                <option value="">Selecione o serviço ou pacote...</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.service?.name ? `${p.service.name} - ` : ""}
                    {p.name} {p.price ? `(R$ ${p.price.toFixed(2)})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label>Horário do Agendamento *</Label>
              <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCreatingSlot}
                  onChange={(e) => setIsCreatingSlot(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                Criar novo horário agora
              </label>
            </div>

            {!isCreatingSlot ? (
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={scheduleSlotId}
                onChange={(e) => setScheduleSlotId(e.target.value)}
              >
                <option value="">Selecione um horário livre...</option>
                {slots
                  .filter((s) => !s.isBooked)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {format(new Date(s.date), "dd/MM/yyyy")}{" "}
                      {s.startTime ? `das ${s.startTime}` : ""}
                      {s.endTime ? ` às ${s.endTime}` : ""} -{" "}
                      {s.professional.name}
                    </option>
                  ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                <div className="space-y-1.5">
                  <Label>Profissional *</Label>
                  <select
                    required={isCreatingSlot}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={newSlotProfessionalId}
                    onChange={(e) => setNewSlotProfessionalId(e.target.value)}
                  >
                    <option value="">Selecione o profissional...</option>
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    required={isCreatingSlot}
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Início (Opcional)</Label>
                  <Input
                    type="time"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Fim (Opcional)</Label>
                  <Input
                    type="time"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Tipo</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={newSlotType}
                    onChange={(e) =>
                      setNewSlotType(e.target.value as "ONLINE" | "IN_PERSON")
                    }
                  >
                    <option value="IN_PERSON">Presencial</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Taxa de Transporte (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={transportFee}
                onChange={(e) =>
                  setTransportFee(Number.parseFloat(e.target.value) || 0)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Informações Adicionais</Label>
              <Input
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Ex: Endereço alternativo, dúvidas..."
              />
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
              className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
