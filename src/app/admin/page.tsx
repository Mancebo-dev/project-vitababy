import { format } from "date-fns";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/infrastructure/db/prisma";
import { DashboardChart } from "./components/DashboardChart";

export const metadata: Metadata = {
  title: "Início | Admin Vita Baby",
};

export default async function AdminHomePage() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  // Fetch real metrics in parallel to improve performance
  const [
    totalClients,
    pendingBookings,
    paymentsThisMonth,
    upcomingBookings,
    latestClients,
    bookingsThisYear,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.payment.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        type: "INCOME",
        status: "PAID",
      },
    }),
    prisma.booking.findMany({
      where: {
        scheduleSlot: { date: { gte: new Date() } },
        status: "CONFIRMED",
      },
      include: {
        client: true,
        packages: { include: { service: true } },
        scheduleSlot: { include: { professional: true } },
      },
      orderBy: { scheduleSlot: { date: "asc" } },
      take: 5,
    }),
    prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31, 23, 59, 59),
        },
      },
      select: { createdAt: true },
    }),
  ]);

  const revenueThisMonth = paymentsThisMonth.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const chartData = months.map((month, index) => {
    return {
      name: month,
      Agendamentos: bookingsThisYear.filter(
        (b) => b.createdAt.getMonth() === index,
      ).length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Visão Geral
        </h1>
        <p className="text-slate-500 mt-2">
          Acompanhe o desempenho e a agenda da Vita Baby.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">Receita (Mês)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(revenueThisMonth)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">
              Total de Clientes
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {totalClients}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">
              Aguardando Confirmação
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {pendingBookings}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Chart + Clients) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-900">
                Atividade de Agendamentos
              </h2>
              <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg py-1.5 px-3 outline-none">
                <option>Este Ano</option>
                <option>Ano Passado</option>
              </select>
            </div>
            <DashboardChart data={chartData} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-900">
                Últimas Clientes
              </h2>
              <Link
                href="/admin/clientes"
                className="text-sm font-medium text-[#ae4d30] hover:underline flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {latestClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ae4d30]/10 text-[#ae4d30] flex items-center justify-center font-bold uppercase text-xs">
                            {client.name.charAt(0)}
                          </div>
                          <p className="font-medium text-slate-900">
                            {client.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {format(new Date(client.createdAt), "dd/MM/yyyy")}
                      </td>
                    </tr>
                  ))}
                  {latestClients.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        Nenhuma cliente cadastrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Area (Upcoming Bookings) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#ae4d30] rounded-3xl border border-[#ae4d30] shadow-sm overflow-hidden text-white">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-bold text-lg">Próximos Atendimentos</h2>
            </div>
            <div className="p-6 space-y-4 bg-white text-slate-900 rounded-t-[24px] min-h-[400px]">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CalendarIcon className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                  <p>Nenhum atendimento confirmado para os próximos dias.</p>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ae4d30]" />
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {booking.client.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {booking.packages
                            ?.map((p) => p.service?.name)
                            .filter(Boolean)
                            .join(" + ") || "Sem serviço"}
                        </p>
                      </div>
                      <span className="bg-[#ae4d30]/10 text-[#ae4d30] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        {format(new Date(booking.scheduleSlot.date), "dd/MM")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">
                          {booking.scheduleSlot.startTime}
                        </span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center uppercase text-[8px] font-bold text-slate-600">
                          {booking.scheduleSlot.professional.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[80px]">
                          {booking.scheduleSlot.professional.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <Link
                href="/admin/agendamentos"
                className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                Ver todos os agendamentos
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <h3 className="font-bold text-lg mb-2 relative z-10">
              Dica do Sistema
            </h3>
            <p className="text-slate-400 text-sm relative z-10 leading-relaxed">
              Mantenha os contratos de suas clientes sempre assinados antes de
              cada atendimento. Acesse a aba{" "}
              <Link
                href="/admin/contratos"
                className="text-white font-medium underline"
              >
                Contratos
              </Link>{" "}
              para gerar novos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
