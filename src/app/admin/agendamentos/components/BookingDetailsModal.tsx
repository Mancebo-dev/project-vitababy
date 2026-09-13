"use client";

import type { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { approveBooking, rejectBooking } from "../actions";

type BookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    client: true;
    packages: { include: { service: true } };
    scheduleSlot: true;
  };
}>;

export function BookingDetailsModal({
  booking,
}: {
  booking: BookingWithDetails;
}) {
  const [open, setOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveBooking(booking.id);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao aprovar");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      alert("Por favor, informe o motivo da recusa.");
      return;
    }
    setLoading(true);
    try {
      await rejectBooking(booking.id, rejectReason);
      setOpen(false);
      setIsRejecting(false);
      setRejectReason("");
    } catch (error) {
      console.error(error);
      alert("Erro ao recusar");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Confirmado
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="font-medium text-xs">
            <Eye className="w-4 h-4 mr-1" /> Ver Detalhes
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-8">
            Detalhes do Agendamento
            {getStatusBadge()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Cliente</h4>
              <p className="text-slate-600">{booking.client?.name}</p>
              <p className="text-slate-600">{booking.client?.phone}</p>
              <p className="text-slate-600">{booking.client?.email}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Serviço</h4>
              <p className="font-medium text-slate-900 mt-1">
                {booking.packages?.map((p) => p.name).join(" + ")}
              </p>
              <p className="text-slate-600">
                {booking.packages
                  ?.map((p) => p.service?.name)
                  .filter(Boolean)
                  .join(" + ")}
              </p>
              {booking.scheduleSlot && (
                <div className="mt-2 text-primary font-medium">
                  {format(new Date(booking.scheduleSlot.date), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}{" "}
                  às {booking.scheduleSlot.startTime}
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Observações do Cliente
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 min-h-[80px]">
              {booking.additionalInfo || "Nenhuma observação informada."}
            </div>
          </div>

          {booking.status === "CANCELLED" && booking.cancelReason && (
            <div className="bg-rose-50 p-4 rounded-lg flex gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Motivo do Cancelamento</p>
                <p>{booking.cancelReason}</p>
              </div>
            </div>
          )}

          {booking.status === "PENDING" && !isRejecting && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Aprovando..." : "Aprovar Agendamento"}
              </button>
            </div>
          )}

          {isRejecting && (
            <div className="bg-rose-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-rose-900 text-sm">
                Motivo da Recusa
              </h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explique ao cliente o motivo da recusa..."
                className="w-full text-sm rounded-md border-rose-200 bg-white p-2 focus:ring-rose-500 focus:border-rose-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 disabled:opacity-50"
                >
                  Confirmar Recusa
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
