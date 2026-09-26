import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Calendar as CalendarIcon, Clock } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export const metadata: Metadata = {
  title: "Minhas Escalas | Vita Baby",
};

export default async function MinhasEscalasPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) redirect("/portal/login");

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
  });

  if (!client) {
    return (
      <div className="p-8 text-center text-slate-500">
        Perfil de cliente não encontrado.
      </div>
    );
  }

  const schedules = await prisma.clientSchedule.findMany({
    where: { clientId: client.id },
    include: {
      shifts: {
        include: {
          professional: true,
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#411f03]">
          Minhas Escalas
        </h1>
        <p className="text-[#444840] mt-2">
          Visualize seus plantões e visitas programadas para o mês.
        </p>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#e4e2de]">
          <CalendarDays className="w-12 h-12 mx-auto text-[#e4e2de] mb-4" />
          <h3 className="text-xl font-bold text-[#411f03] mb-2">
            Nenhuma escala encontrada
          </h3>
          <p className="text-[#7d7a75]">
            Você ainda não possui escalas mensais cadastradas.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e4e2de] overflow-hidden"
            >
              <div className="bg-[#fbf9f5] px-6 py-4 border-b border-[#e4e2de]">
                <h3 className="text-xl font-bold text-[#411f03]">
                  {schedule.title || `Escala Mensal: ${schedule.month}`}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schedule.shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="border border-[#e4e2de] rounded-xl p-4 bg-white relative overflow-hidden flex flex-col"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{
                          backgroundColor:
                            shift.professional.color || "#af4d30",
                        }}
                      />
                      <div className="flex items-center gap-2 text-[0.9375rem] font-bold text-[#411f03] mb-2">
                        <CalendarIcon className="w-[1.125rem] h-[1.125rem] text-[#af4d30]" />
                        {format(new Date(shift.date), "dd 'de' MMMM, yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-[0.875rem] text-[#7d7a75] mb-4">
                        <Clock className="w-[1rem] h-[1rem]" />
                        {shift.startTime} às {shift.endTime}
                      </div>
                      <div className="mt-auto pt-3 border-t border-[#e4e2de] flex items-center justify-between">
                        <span
                          className="font-semibold text-[0.875rem]"
                          style={{
                            color: shift.professional.color || "#af4d30",
                          }}
                        >
                          {shift.professional.name}
                        </span>
                        <span className="text-[0.625rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#fbf9f5] text-[#444840]">
                          {shift.status === "SCHEDULED"
                            ? "AGENDADO"
                            : shift.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
