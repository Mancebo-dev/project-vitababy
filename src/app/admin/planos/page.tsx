import { Package } from "lucide-react";
import { prisma } from "@/infrastructure/db/prisma";
import {
  CreatePackageDialog,
  DeleteAction,
  EditPackageDialog,
} from "../servicos/components/ServiceModals";

export const metadata = {
  title: "Planos | Vita Baby Dashboard",
};

export default async function PlanosPage() {
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
            Planos
          </h1>
          <p className="text-slate-500 mt-2">
            Gerencie os pacotes e planos oferecidos pela Vita Baby.
          </p>
        </div>
        <div className="flex justify-end mb-4">
          {services.length > 0 && <CreatePackageDialog services={services} />}
        </div>
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
            const parentService = services.find((s) => s.id === pkg.serviceId);
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
                  <span className="font-bold text-[#af4d30] text-xl">
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
    </div>
  );
}
