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
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Nova Assessora
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
          <div className="overflow-x-auto">
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
        )}
      </div>
    </div>
  );
}
