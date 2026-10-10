import { Package } from "lucide-react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { prisma } from "@/infrastructure/db/prisma";
import {
  CreateServiceDialog,
  DeleteAction,
  EditServiceDialog,
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
            Serviços
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie as categorias de serviços que serão exibidas no site.
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
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#af4d30]/10 text-[#af4d30] rounded-lg flex items-center justify-center">
                    <DynamicIcon
                      name={service.icon}
                      className="w-5 h-5"
                      fallback={<Package className="w-5 h-5" />}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <EditServiceDialog service={service} />
                  <DeleteAction id={service.id} type="service" />
                </div>
              </div>

              {service.description && (
                <p className="text-slate-500 text-sm mb-4">
                  {service.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
