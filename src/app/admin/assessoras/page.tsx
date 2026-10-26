import { Plus, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { prisma } from "@/infrastructure/db/prisma";
import { ProfessionalModal } from "./components/ProfessionalModal";

export const metadata: Metadata = {
  title: "Assessoras | Vita Baby Dashboard",
};

export default async function AssessorasPage() {
  const professionals = await prisma.professional.findMany({
    include: {
      _count: {
        select: { bookings: true, scheduleSlots: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Assessoras
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie a equipe técnica, especialidades, registros e dados de
            atendimento.
          </p>
        </div>

        <ProfessionalModal
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 min-h-[42px] px-3 sm:px-4 shadow-xs">
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Nova Assessora</span>
              <span className="sm:hidden text-xs">Assessora</span>
            </Button>
          }
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {professionals.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">Nenhuma assessora cadastrada.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {professionals.map((prof) => {
                const specialtiesList = prof.specialties
                  ? prof.specialties
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [];

                return (
                  <div key={prof.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-xs border border-slate-200 flex items-center justify-center">
                          {prof.avatarUrl ? (
                            <Image
                              src={prof.avatarUrl}
                              alt={prof.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center font-bold text-white uppercase text-sm"
                              style={{
                                backgroundColor: prof.color || "#ae4d30",
                              }}
                            >
                              {prof.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {prof.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {prof.specialty || "Assessora Materno-Infantil"}
                          </p>
                          {prof.crnOrCoren && (
                            <p className="text-[11px] text-primary font-medium">
                              {prof.crnOrCoren}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          prof.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {prof.active ? "Ativa" : "Inativa"}
                      </span>
                    </div>

                    {specialtiesList.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {specialtiesList.map((s) => (
                          <span
                            key={s}
                            className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">
                          {prof.phone || "Sem telefone"}
                        </p>
                        {prof.email && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {prof.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-[11px] text-slate-500">
                        <p>{prof._count.scheduleSlots} horários</p>
                        <p>{prof._count.bookings} atendimentos</p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <ProfessionalModal
                        prof={prof}
                        trigger={
                          <button
                            type="button"
                            className="w-full text-center py-2 px-3 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 min-h-[38px] transition-colors"
                          >
                            Editar Assessora
                          </button>
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Assessora & Cargo</th>
                    <th className="px-6 py-4">Especialidades</th>
                    <th className="px-6 py-4">Contato & Registro</th>
                    <th className="px-6 py-4">Estatísticas</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {professionals.map((prof) => {
                    const specialtiesList = prof.specialties
                      ? prof.specialties
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];

                    return (
                      <tr
                        key={prof.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-xs border border-slate-200 flex items-center justify-center">
                              {prof.avatarUrl ? (
                                <Image
                                  src={prof.avatarUrl}
                                  alt={prof.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center font-bold text-white uppercase text-sm"
                                  style={{
                                    backgroundColor: prof.color || "#ae4d30",
                                  }}
                                >
                                  {prof.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {prof.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {prof.specialty || "Assessora Materno-Infantil"}
                              </p>
                              {prof.experience && (
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {prof.experience}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-[260px]">
                          {specialtiesList.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {specialtiesList.slice(0, 3).map((s) => (
                                <span
                                  key={s}
                                  className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                              {specialtiesList.length > 3 && (
                                <span className="inline-flex px-1.5 py-0.5 rounded-full text-[11px] font-medium text-slate-500 bg-slate-50">
                                  +{specialtiesList.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Não especificadas
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-slate-900 text-xs font-medium">
                            {prof.phone || "-"}
                          </p>
                          {prof.email && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {prof.email}
                            </p>
                          )}
                          {prof.crnOrCoren && (
                            <p className="text-[11px] text-primary font-medium mt-1">
                              {prof.crnOrCoren}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-xs space-y-1">
                            <p className="text-slate-600">
                              <span className="font-medium">
                                {prof._count.scheduleSlots}
                              </span>{" "}
                              horários
                            </p>
                            <p className="text-slate-600">
                              <span className="font-medium">
                                {prof._count.bookings}
                              </span>{" "}
                              atendimentos
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              prof.active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {prof.active ? "Ativa" : "Inativa"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <ProfessionalModal
                            prof={prof}
                            trigger={
                              <button
                                type="button"
                                className="text-primary hover:text-primary/80 font-medium text-sm"
                              >
                                Editar
                              </button>
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
