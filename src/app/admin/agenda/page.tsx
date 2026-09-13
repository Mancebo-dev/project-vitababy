import type { PlannerItem } from "@prisma/client";
import { addDays, startOfDay } from "date-fns";
import { Bell } from "lucide-react";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/infrastructure/db/prisma";
import { Planner } from "./components/Planner";
import { ScheduleManager } from "./components/ScheduleManager";

export const metadata: Metadata = {
  title: "Agenda / Planner | Vita Baby Dashboard",
};

export default async function AgendaPage() {
  // Fetch existing bookings to show on the agenda
  const bookings = await prisma.booking.findMany({
    include: {
      client: true,
      scheduleSlot: true,
      professional: true,
    },
  });

  // Fetch planner items (Events, Reminders, Notes)
  const plannerItems = await prisma.plannerItem.findMany();

  // Fetch slots for ScheduleManager
  const slots = await prisma.scheduleSlot.findMany({
    where: {
      date: { gte: startOfDay(new Date()) },
    },
    orderBy: { date: "asc" },
  });

  // Fetch professionals for ScheduleManager
  const professionals = await prisma.professional.findMany({
    where: { active: true },
  });

  // Combine them into a uniform array of "events"
  const allEvents = [
    ...(plannerItems || []).map((pi: PlannerItem) => ({
      id: pi.id,
      title: pi.title,
      description: pi.description,
      type: pi.type, // EVENT, REMINDER, NOTE
      date: pi.date,
      startTime: pi.startTime,
      endTime: pi.endTime,
      color: pi.color || "#ae4d30",
    })),
    ...bookings.map((b) => ({
      id: b.id,
      title: `${b.client.name} - Consulta`,
      description: b.additionalInfo,
      type: "BOOKING",
      date: b.scheduleSlot.date,
      startTime: b.scheduleSlot.startTime,
      endTime: b.scheduleSlot.endTime,
      color: b.professional.color || "#ae4d30",
    })),
  ];

  // Logic for the notification bell: find reminders that are today and not completed
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

  return (
    <div className="flex flex-col h-[calc(100dvh-6.5rem)] md:h-[calc(100dvh-4rem)] min-w-0">
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Agenda & Planner
          </h1>
          <p className="text-slate-500 mt-2">
            Organize agendamentos, lembretes e anotações.
          </p>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
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

      <Tabs
        defaultValue="planner"
        className="flex flex-col flex-1 min-h-0 min-w-0"
      >
        <div className="shrink-0 mb-4">
          <TabsList>
            <TabsTrigger value="planner">Painel Geral</TabsTrigger>
            <TabsTrigger value="horarios">
              Horários Disponíveis (Para Clientes)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="planner"
          className="flex-1 min-h-0 min-w-0 w-full data-[state=active]:flex flex-col m-0 p-0 outline-none"
        >
          <Planner initialItems={allEvents} professionals={professionals} />
        </TabsContent>

        <TabsContent
          value="horarios"
          className="flex-1 min-h-0 min-w-0 w-full data-[state=active]:flex flex-col m-0 p-0 outline-none overflow-auto custom-scrollbar"
        >
          <ScheduleManager initialSlots={slots} professionals={professionals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
