import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Plus,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/infrastructure/db/prisma";
import { DeleteButton } from "./components/DeleteButton";
import { TransactionChart } from "./components/TransactionChart";
import { TransactionModal } from "./components/TransactionModal";

export const metadata: Metadata = {
  title: "Financeiro | Vita Baby Dashboard",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FinanceiroPage(props: Props) {
  const searchParams = await props.searchParams;
  const monthParam = searchParams.month as string | undefined;
  const yearParam = searchParams.year as string | undefined;
  const tab = (searchParams.tab as string) || "all";

  const currentMonth = monthParam
    ? parseInt(monthParam, 10) - 1
    : new Date().getMonth();
  const currentYear = yearParam
    ? parseInt(yearParam, 10)
    : new Date().getFullYear();

  const currentDate = new Date(currentYear, currentMonth, 1);
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  const prevMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);

  const rawTransactions = await prisma.payment.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });

  const transactions =
    tab === "all"
      ? rawTransactions
      : rawTransactions.filter(
          (t) => t.type === (tab === "income" ? "INCOME" : "EXPENSE"),
        );

  const income = rawTransactions
    .filter((t) => t.type === "INCOME" && t.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = rawTransactions
    .filter((t) => t.type === "EXPENSE" && t.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pending = rawTransactions
    .filter((t) => t.status === "PENDING")
    .reduce(
      (acc, curr) =>
        acc + (curr.type === "INCOME" ? curr.amount : -curr.amount),
      0,
    );

  const balance = income - expense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Financeiro
          </h1>
          <p className="text-slate-500 mt-2">
            Gestão de fluxo de caixa e movimentações
          </p>
        </div>

        <TransactionModal
          trigger={
            <Button className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white gap-2 rounded-full h-10 px-6">
              <Plus className="w-4 h-4" />
              Nova Movimentação
            </Button>
          }
        />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <Link
          href={`?month=${prevMonth.getMonth() + 1}&year=${prevMonth.getFullYear()}&tab=${tab}`}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <span className="font-semibold text-slate-800 capitalize text-lg">
          {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <Link
          href={`?month=${nextMonth.getMonth() + 1}&year=${nextMonth.getFullYear()}&tab=${tab}`}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-600">Entradas</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(income)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-600">Saídas</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(expense)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg text-[#af4d30]">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-600">Balanço Atual</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(balance)}
            </p>
            {pending !== 0 && (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                {pending > 0 ? "+" : ""}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(pending)}{" "}
                pendentes
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Visão Geral</h3>
          </div>
          <div className="p-4">
            <TransactionChart transactions={rawTransactions} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-slate-900">
              Histórico de Transações
            </h3>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <Link
                href={`?month=${currentMonth + 1}&year=${currentYear}&tab=all`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Tudo
              </Link>
              <Link
                href={`?month=${currentMonth + 1}&year=${currentYear}&tab=income`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "income" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Entradas
              </Link>
              <Link
                href={`?month=${currentMonth + 1}&year=${currentYear}&tab=expense`}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Saídas
              </Link>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium">
                Nenhuma movimentação neste período.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Método</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                    <th className="px-6 py-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {format(new Date(transaction.date), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {transaction.description || "Pagamento de Serviço"}
                        </p>
                        {transaction.bookingId && (
                          <p className="text-xs text-slate-500">
                            Vinculado a um agendamento
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            transaction.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {transaction.status === "PAID" ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        <span
                          className={
                            transaction.type === "INCOME"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {transaction.type === "INCOME" ? "+" : "-"}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <DeleteButton id={transaction.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
