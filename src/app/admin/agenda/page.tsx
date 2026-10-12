import type { PlannerItem } from "@prisma/client";
import { addDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/infrastructure/db/prisma";
import { BookingDetailsModal } from "../agendamentos/components/BookingDetailsModal";
import { NewBookingModal } from "../agendamentos/components/NewBookingModal";
import { EscalaList } from "../escalas/components/EscalaList";
import { NewEscalaModal } from "../escalas/components/NewEscalaModal";
import { DownloadScheduleReportButton } from "./components/DownloadScheduleReportButton";
import { Planner } from "./components/Planner";
import { ScheduleManager } from "./components/ScheduleManager";

export const metadata: Metadata = {
  title: "Agenda & Escalas | Vita Baby Dashboard",
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab || "planner";

  // 1. Fetch bookings
  const bookings = await prisma.booking.findMany({
    include: {
      client: true,
      packages: {
        include: { service: true },
      },
      scheduleSlot: true,
      professional: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch schedules
  const schedules = await prisma.clientSchedule.findMany({
    include: {
      client: true,
      shifts: {
        include: { professional: true },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch clients, packages, professionals
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
  });

  const packages = await prisma.servicePackage.findMany({
    include: { service: true },
    orderBy: { name: "asc" },
  });

  const professionals = await prisma.professional.findMany({
    orderBy: { name: "asc" },
  });

  const activeProfessionals = professionals.filter((p) => p.active);

  // 4. Fetch slots for ScheduleManager
  const slots = await prisma.scheduleSlot.findMany({
    where: {
      date: { gte: startOfDay(new Date()) },
    },
    include: { professional: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  // 5. Fetch planner items
  const plannerItems = await prisma.plannerItem.findMany();

  // Combine events for planner
  const allEvents = [
    ...(plannerItems || []).map((pi: PlannerItem) => ({
      id: pi.id,
      title: pi.title,
      description: pi.description,
      type: pi.type,
      date: pi.date,
      startTime: pi.startTime || "09:00",
      endTime: pi.endTime || "10:00",
      color: pi.color || "#ae4d30",
    })),
    ...bookings.map((b) => ({
      id: b.id,
      title: `${b.client.name} - Atendimento`,
      description: b.additionalInfo,
      type: "BOOKING",
      date: b.scheduleSlot.date,
      startTime: b.scheduleSlot.startTime || "09:00",
      endTime: b.scheduleSlot.endTime || "10:00",
      color: b.professional?.color || "#ae4d30",
      professionalId: b.professionalId,
    })),
  ];

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const activeReminders = (plannerItems || []).filter(
    (pi: PlannerItem) =>
      pi.type === "REMINDER" &&
      pi.date >= today &&
      pi.date < tomorrow &&
      !pi.isCompleted,
  );
  const hasNotifications = activeReminders.length > 0;

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Agenda & Escalas
          </h1>
          <p className="text-slate-500 mt-1">
            Gestão unificada de plantões, escalas flexíveis e agendamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DownloadScheduleReportButton
            professionals={activeProfessionals}
            events={allEvents as any}
          />

          <div className="relative">
            <button
              type="button"
              className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Bell className="w-5 h-5" />
            </button>
            {hasNotifications && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-1">
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendário & Planner
          </TabsTrigger>
          <TabsTrigger value="escalas" className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            Escalas de Clientes ({schedules.length})
          </TabsTrigger>
          <TabsTrigger value="agendamentos" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Agendamentos ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horários Disponíveis
          </TabsTrigger>
        </TabsList>

        {/* 1. Calendário Geral */}
        <TabsContent value="planner" className="outline-none">
          <div className="h-[750px] bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <Planner
              initialItems={allEvents}
              professionals={activeProfessionals}
            />
          </div>
        </TabsContent>

        {/* 2. Escalas de Clientes */}
        <TabsContent value="escalas" className="space-y-4 outline-none">
          <div className="flex justify-end">
            <NewEscalaModal
              clients={clients}
              professionals={activeProfessionals}
            />
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {schedules.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CalendarRange className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhuma escala configurada.
                </p>
                <p className="text-sm mt-1">
                  Clique em &quot;Nova Escala Flexível&quot; para planejar meses
                  e dias de atendimento.
                </p>
              </div>
            ) : (
              <EscalaList schedules={schedules as any} />
            )}
          </div>
        </TabsContent>

        {/* 3. Agendamentos */}
        <TabsContent value="agendamentos" className="space-y-4 outline-none">
          <div className="flex justify-end">
            <NewBookingModal
              clients={clients}
              packages={packages}
              slots={slots as any}
              professionals={activeProfessionals}
            />
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum agendamento encontrado.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Serviço / Pacote</th>
                      <th className="px-6 py-4">Data do Atendimento</th>
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
                              "Atendimento Personalizado"}
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
                            <div className="space-y-0.5 text-slate-600 text-sm">
                              <div className="font-medium text-slate-900">
                                {format(
                                  new Date(booking.scheduleSlot.date),
                                  "dd 'de' MMMM, yyyy",
                                  { locale: ptBR },
                                )}
                              </div>
                              {booking.scheduleSlot.startTime && (
                                <div className="text-xs text-slate-500">
                                  {booking.scheduleSlot.startTime} às{" "}
                                  {booking.scheduleSlot.endTime || "A definir"}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              Data a definir
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="font-medium text-slate-700 text-xs">
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
        </TabsContent>

        {/* 4. Horários Disponíveis */}
        <TabsContent value="horarios" className="outline-none">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <ScheduleManager
              initialSlots={slots as any}
              professionals={activeProfessionals}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
