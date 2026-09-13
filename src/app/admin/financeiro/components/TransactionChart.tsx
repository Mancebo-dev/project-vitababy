"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: Date;
}

export function TransactionChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Group by date (day)
  const dataMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach((t) => {
    if (t.status !== "PAID") return;
    const day = format(new Date(t.date), "dd/MM", { locale: ptBR });
    const existing = dataMap.get(day) || { income: 0, expense: 0 };
    if (t.type === "INCOME") existing.income += t.amount;
    if (t.type === "EXPENSE") existing.expense += t.amount;
    dataMap.set(day, existing);
  });

  // Convert map to array and sort by date string implicitly or keep insertion order if dates are sorted
  // We assume transactions are passed, but let's just create an array of the last 30 days or the days that have transactions
  const data = Array.from(dataMap.entries())
    .map(([date, values]) => ({
      name: date,
      Receitas: values.income,
      Despesas: values.expense,
    }))
    .reverse(); // If transactions are descending, we reverse to make it ascending for the chart

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400">
        Dados insuficientes para o gráfico
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: unknown) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(value) || 0)
            }
          />
          <Bar
            dataKey="Receitas"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="Despesas"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
