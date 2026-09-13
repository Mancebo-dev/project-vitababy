import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/infrastructure/db/prisma";
import { BookingDetailsModal } from "./components/BookingDetailsModal";
import { NewBookingModal } from "./components/NewBookingModal";

export const metadata: Metadata = {
  title: "Agendamentos | Vita Baby Dashboard",
};

export default async function AgendamentosPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      client: true,
      packages: {
        include: {
          service: true,
        },
      },
      scheduleSlot: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
  });

  const packages = await prisma.servicePackage.findMany({
    include: { service: true },
    orderBy: { name: "asc" },
  });

  const slots = await prisma.scheduleSlot.findMany({
    where: {
      date: { gte: new Date() }, // Only future/current dates
    },
    include: { professional: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmado";
      case "CANCELLED":
        return "Cancelado";
      case "COMPLETED":
        return "Concluído";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Agendamentos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie todas as solicitações de consultoria e serviços.
          </p>
        </div>
        <NewBookingModal clients={clients} packages={packages} slots={slots} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">
              Nenhum agendamento encontrado.
            </p>
            <p className="text-sm">As novas solicitações aparecerão aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Serviço/Pacote</th>
                  <th className="px-6 py-4">Horário Reservado</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold uppercase">
                          {booking.client?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {booking.client?.name || "Desconhecido"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {booking.client?.phone ||
                              booking.client?.email ||
                              "Sem contato"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <p className="font-medium">
                        {booking.packages?.map((p) => p.name).join(" + ") ||
                          "Pacote Removido"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.packages
                          ?.map((p) => p.service?.name)
                          .filter(Boolean)
                          .join(" + ")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {booking.scheduleSlot ? (
                        <div className="space-y-1 text-slate-600 text-sm">
                          <div className="font-medium text-slate-900">
                            {format(
                              new Date(booking.scheduleSlot.date),
                              "dd 'de' MMMM, yyyy",
                              { locale: ptBR },
                            )}
                          </div>
                          <div>
                            {booking.scheduleSlot.startTime} às{" "}
                            {booking.scheduleSlot.endTime}
                          </div>
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs font-medium">
                          Horário Removido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className="font-medium text-slate-700">
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BookingDetailsModal booking={booking} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
