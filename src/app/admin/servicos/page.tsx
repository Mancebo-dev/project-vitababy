import { Package } from "lucide-react";
import { prisma } from "@/infrastructure/db/prisma";
import {
  CreatePackageDialog,
  CreateServiceDialog,
  DeleteAction,
} from "./components/ServiceModals";

export const metadata = {
  title: "Serviços | Vita Baby Dashboard",
};

export default async function ServicosPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: { packages: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Serviços e Pacotes
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie as categorias de serviços e seus respectivos pacotes e
            preços.
          </p>
        </div>
        <CreateServiceDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-900">
              Nenhum serviço cadastrado.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Crie a sua primeira categoria de serviço (ex: Consultoria de
              Sono).
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <DeleteAction id={service.id} type="service" />
                </div>
              </div>

              {service.description && (
                <p className="text-slate-500 text-sm mb-4">
                  {service.description}
                </p>
              )}

              <div className="mt-2 flex-grow space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Pacotes Inclusos
                </h4>

                {service.packages.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Nenhum pacote criado.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {service.packages.map((pkg) => (
                      <li
                        key={pkg.id}
                        className="bg-slate-50 border border-slate-100 rounded-lg p-3 relative group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-slate-900 text-sm">
                              {pkg.name}
                            </span>
                            {pkg.duration && (
                              <span className="text-xs text-slate-500 ml-2">
                                • {pkg.duration} min
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-primary text-sm">
                            {pkg.price
                              ? `R$ ${pkg.price.toFixed(2).replace(".", ",")}`
                              : "Sob consulta"}
                          </span>
                        </div>
                        {pkg.description && (
                          <p className="text-xs text-slate-500 mt-1">
                            {pkg.description}
                          </p>
                        )}

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteAction id={pkg.id} type="package" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <CreatePackageDialog serviceId={service.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
