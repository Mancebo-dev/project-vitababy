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
}: {
  clients: Client[];
  packages: (ServicePackage & { service: { name: string } })[];
  slots: (ScheduleSlot & { professional: Professional })[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [scheduleSlotId, setScheduleSlotId] = useState("");
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

  const handlePackageToggle = (pkgId: string) => {
    setPackageIds((prev) =>
      prev.includes(pkgId)
        ? prev.filter((id) => id !== pkgId)
        : [...prev, pkgId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || packageIds.length === 0 || !scheduleSlotId) {
      alert(
        "Preencha os campos obrigatórios (incluindo pelo menos um serviço).",
      );
      return;
    }

    const slot = slots.find((s) => s.id === scheduleSlotId);
    if (!slot) return;

    setLoading(true);
    try {
      await createManualBooking({
        clientId,
        packageIds,
        professionalId: slot.professionalId,
        scheduleSlotId,
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Agendamento Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <select
              required
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
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

          <div className="space-y-2">
            <Label>Serviços / Pacotes *</Label>
            <div className="max-h-[160px] overflow-y-auto border border-slate-200 rounded-md p-2 space-y-2 bg-slate-50">
              {packages.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-100 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={packageIds.includes(p.id)}
                    onChange={() => handlePackageToggle(p.id)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>
                    <span className="font-semibold">{p.service.name}</span> -{" "}
                    {p.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Horário Disponível *</Label>
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
                    {format(new Date(s.date), "dd/MM/yyyy")} das {s.startTime}{" "}
                    às {s.endTime} - {s.professional.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Taxa de Transporte (Fora de Macaé)</Label>
            <Input
              type="number"
              step="0.01"
              value={transportFee}
              onChange={(e) => setTransportFee(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Informações Adicionais</Label>
            <Input
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Ex: Endereço alternativo, dúvidas..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#ae4d30] text-white hover:bg-[#ae4d30]/90"
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
