import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { getClients, getProfessionals, getSchedules } from "./actions";
import { EscalaList } from "./components/EscalaList";
import { NewEscalaModal } from "./components/NewEscalaModal";

export const metadata: Metadata = {
  title: "Escalas de Clientes | Vita Baby Dashboard",
};

export default async function EscalasPage() {
  const clients = await getClients();
  const professionals = await getProfessionals();
  const schedules = await getSchedules();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Escalas Mensais
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie as escalas e plantões mensais das clientes.
          </p>
        </div>
        <NewEscalaModal clients={clients} professionals={professionals} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {schedules.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-900">
              Nenhuma escala configurada.
            </p>
            <p className="text-sm mt-1">
              Crie a primeira escala para organizar os plantões de uma cliente.
            </p>
          </div>
        ) : (
          <EscalaList schedules={schedules} />
        )}
      </div>
    </div>
  );
}
