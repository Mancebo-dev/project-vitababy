import { ExternalLink, Plus, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/infrastructure/db/prisma";
import { ClientModal } from "./components/ClientModal";

export const metadata: Metadata = {
  title: "Clientes | Vita Baby Dashboard",
};

export default async function ClientesPage() {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clientes
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie o cadastro e histórico das suas clientes.
          </p>
        </div>

        <ClientModal
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-white gap-1.5 px-3 sm:px-4 min-h-[40px]">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Novo Cliente</span>
              <span className="sm:hidden text-xs font-semibold">Novo</span>
            </Button>
          }
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards */}
            <div className="divide-y divide-slate-100 sm:hidden">
              {clients.map((client) => (
                <div key={client.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {client.name}
                        </p>
                        {client.cpf && (
                          <p className="text-[11px] text-slate-500">
                            CPF: {client.cpf}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {client._count.bookings} agendamentos
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex flex-col gap-0.5">
                    <p className="font-medium">{client.phone}</p>
                    {client.email && (
                      <p className="text-[11px] text-slate-500">
                        {client.email}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1">
                      <ClientModal
                        client={client}
                        trigger={
                          <button
                            type="button"
                            className="w-full text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 min-h-[38px]"
                          >
                            Editar
                          </button>
                        }
                      />
                    </div>
                    <Link
                      href={`/admin/clientes/${client.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg min-h-[38px]"
                    >
                      <span>Perfil</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Agendamentos</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold uppercase">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {client.name}
                            </p>
                            {client.cpf && (
                              <p className="text-xs text-slate-500">
                                CPF: {client.cpf}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900">{client.phone}</p>
                        {client.email && (
                          <p className="text-xs text-slate-500">
                            {client.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {client._count.bookings}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <ClientModal
                          client={client}
                          trigger={
                            <button
                              type="button"
                              className="text-slate-500 hover:text-slate-900 font-medium text-sm"
                            >
                              Editar
                            </button>
                          }
                        />
                        <Link
                          href={`/admin/clientes/${client.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm ml-4"
                        >
                          Perfil <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
