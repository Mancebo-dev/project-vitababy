import { Package, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/infrastructure/db/prisma";
import {
  CreatePackageDialog,
  CreateServiceDialog,
  DeleteAction,
  EditPackageDialog,
  EditServiceDialog,
} from "./components/ServiceModals";

export const metadata = {
  title: "Serviços e Planos | Vita Baby Dashboard",
};

export default async function ServicosPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: { packages: true },
  });

  const allPackages = services.flatMap((s) => s.packages);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Serviços e Planos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie as categorias de serviços e seus respectivos pacotes
            (planos).
          </p>
        </div>
      </div>

      <Tabs defaultValue="servicos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="planos">Planos (Pacotes)</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos" className="space-y-4">
          <div className="flex justify-end mb-4">
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
        </TabsContent>

        <TabsContent value="planos" className="space-y-4">
          <div className="flex justify-end mb-4">
            {services.length > 0 && <CreatePackageDialog services={services} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPackages.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-xl shadow-sm border border-slate-200">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum plano cadastrado.
                </p>
              </div>
            ) : (
              allPackages.map((pkg) => {
                const parentService = services.find(
                  (s) => s.id === pkg.serviceId,
                );
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <EditPackageDialog pkg={pkg} services={services} />
                        <DeleteAction id={pkg.id} type="package" />
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        Serviço: {parentService?.name}
                      </span>
                    </div>

                    <div className="mb-4 flex items-end gap-2">
                      <span className="font-bold text-primary text-xl">
                        {pkg.price
                          ? `R$ ${pkg.price.toFixed(2).replace(".", ",")}`
                          : "Sob consulta"}
                      </span>
                      {pkg.duration && (
                        <span className="text-sm text-slate-500 pb-0.5">
                          • {pkg.duration} min
                        </span>
                      )}
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-slate-500 mb-4 flex-1">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
