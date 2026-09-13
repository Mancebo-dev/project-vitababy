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
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Novo Cliente
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
          <div className="overflow-x-auto">
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
                        <p className="text-xs text-slate-500">{client.email}</p>
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
        )}
      </div>
    </div>
  );
}
