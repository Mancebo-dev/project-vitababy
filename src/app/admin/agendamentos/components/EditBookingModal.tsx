"use client";

import type {
  Client,
  Prisma,
  Professional,
  ServicePackage,
} from "@prisma/client";
import { format } from "date-fns";
import { Edit2 } from "lucide-react";
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
import { updateBooking } from "../actions";

type BookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    client: true;
    packages: { include: { service: true } };
    scheduleSlot: true;
    professional: true;
  };
}>;

export function EditBookingModal({
  booking,
  clients,
  packages,
  professionals,
}: {
  booking: BookingWithDetails;
  clients: Client[];
  packages: (ServicePackage & { service: { name: string } })[];
  professionals: Professional[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState(booking.clientId);
  const [packageId, setPackageId] = useState(booking.packages[0]?.id || "");
  const [professionalId, setProfessionalId] = useState(
    booking.professionalId || booking.scheduleSlot?.professionalId || "",
  );

  const initialDateStr = booking.scheduleSlot?.date
    ? format(new Date(booking.scheduleSlot.date), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const [date, setDate] = useState(initialDateStr);
  const [startTime, setStartTime] = useState(
    booking.scheduleSlot?.startTime || "",
  );
  const [endTime, setEndTime] = useState(booking.scheduleSlot?.endTime || "");
  const [status, setStatus] = useState(booking.status);
  const [transportFee, setTransportFee] = useState<number>(
    booking.transportFee || 0,
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    booking.additionalInfo || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !packageId || !professionalId || !date) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await updateBooking(booking.id, {
        clientId,
        packageIds: [packageId],
        professionalId,
        date: new Date(`${date}T00:00:00`),
        startTime: startTime || null,
        endTime: endTime || null,
        status,
        transportFee,
        additionalInfo,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar agendamento.");
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
            className="text-slate-600 hover:text-slate-900 p-2"
            title="Editar Agendamento"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        }
      />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae4d30]"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
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
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
              >
                <option value="">Selecione o serviço...</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.service?.name ? `${p.service.name} - ` : ""}
                    {p.name} {p.price ? `(R$ ${p.price.toFixed(2)})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Profissional Responsável *</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae4d30]"
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

            <div className="space-y-1.5">
              <Label>Status do Atendimento *</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ae4d30]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/70 rounded-lg border border-slate-200">
            <div className="space-y-1.5 sm:col-span-1">
              <Label>Data *</Label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <div className="space-y-1.5">
                <Label>Início (Opcional)</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fim (Opcional)</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
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
              <Label>Observações Adicionais</Label>
              <Input
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Ex: Endereço alternativo, observações..."
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
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
