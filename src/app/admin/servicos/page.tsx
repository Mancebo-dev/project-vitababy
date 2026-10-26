import { Check, Clock, Layers, Package, Plus, Sparkles } from "lucide-react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
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
  title: "Serviços & Planos | Vita Baby Dashboard",
};

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab || "estrutura";

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      packages: {
        orderBy: { price: "asc" },
      },
    },
  });

  const allPackages = services.flatMap((s) =>
    s.packages.map((pkg) => ({ ...pkg, parentService: s })),
  );

  const avulsoPackages = allPackages.filter(
    (p) => !p.billingCycle || p.billingCycle === "ONETIME",
  );
  const planoPackages = allPackages.filter(
    (p) => p.billingCycle && p.billingCycle !== "ONETIME",
  );

  const formatCycle = (cycle?: string | null) => {
    switch (cycle) {
      case "MONTHLY":
        return "Mensal";
      case "QUARTERLY":
        return "Trimestral";
      case "SEMIANNUAL":
        return "Semestral";
      case "YEARLY":
        return "Anual";
      default:
        return "Pacote Avulso";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Serviços & Planos
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Gerencie categorias, pacotes de procedimentos e planos de
            acompanhamento em um só lugar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <CreateServiceDialog />
          {services.length > 0 && <CreatePackageDialog services={services} />}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl w-full max-w-full overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap justify-start h-auto gap-1">
          <TabsTrigger
            value="estrutura"
            className="rounded-lg text-xs sm:text-sm shrink-0 min-h-[38px] px-3"
          >
            Estrutura Integrada ({services.length})
          </TabsTrigger>
          <TabsTrigger
            value="planos"
            className="rounded-lg text-xs sm:text-sm shrink-0 min-h-[38px] px-3"
          >
            Planos ({planoPackages.length})
          </TabsTrigger>
          <TabsTrigger
            value="pacotes"
            className="rounded-lg text-xs sm:text-sm shrink-0 min-h-[38px] px-3"
          >
            Pacotes Avulsos ({avulsoPackages.length})
          </TabsTrigger>
          <TabsTrigger
            value="categorias"
            className="rounded-lg text-xs sm:text-sm shrink-0 min-h-[38px] px-3"
          >
            Categorias ({services.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Estrutura Integrada (Categorias com seus pacotes/planos) */}
        <TabsContent value="estrutura" className="space-y-6">
          {services.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-xs border border-slate-200">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">
                Nenhum serviço cadastrado ainda.
              </p>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                Comece criando uma categoria de serviço como "Assessoria
                Materno-Infantil".
              </p>
              <CreateServiceDialog />
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden"
              >
                {/* Service Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#af4d30]/10 text-[#af4d30] rounded-xl flex items-center justify-center shrink-0">
                      <DynamicIcon
                        name={service.icon}
                        className="w-5 h-5"
                        fallback={<Package className="w-5 h-5" />}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {service.name}
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {service.packages.length}{" "}
                          {service.packages.length === 1 ? "opção" : "opções"}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <CreatePackageDialog
                      services={services}
                      defaultServiceId={service.id}
                      trigger={
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#af4d30] hover:text-[#964228] bg-[#af4d30]/10 hover:bg-[#af4d30]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar Pacote ou
                          Plano
                        </button>
                      }
                    />
                    <EditServiceDialog service={service} />
                    <DeleteAction id={service.id} type="service" />
                  </div>
                </div>

                {/* Sub-Packages List */}
                <div className="p-6">
                  {service.packages.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        Nenhum pacote ou plano neste serviço.
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-3">
                        Crie pacotes avulsos ou planos mensais para este
                        serviço.
                      </p>
                      <CreatePackageDialog
                        services={services}
                        defaultServiceId={service.id}
                        trigger={
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#af4d30] hover:bg-[#964228] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Criar Primeiro
                            Plano
                          </button>
                        }
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {service.packages.map((pkg) => {
                        const featuresList = pkg.features
                          ? pkg.features
                              .split("\n")
                              .map((f) => f.trim().replace(/^[•\-*]\s*/, ""))
                              .filter(Boolean)
                          : [];

                        return (
                          <div
                            key={pkg.id}
                            className={`rounded-xl border p-5 flex flex-col justify-between transition-all bg-white relative ${
                              pkg.isHighlighted
                                ? "border-[#af4d30] shadow-sm ring-1 ring-[#af4d30]/30"
                                : "border-slate-200 hover:border-slate-300 shadow-xs"
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      pkg.billingCycle === "ONETIME" ||
                                      !pkg.billingCycle
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {formatCycle(pkg.billingCycle)}
                                  </span>
                                  {pkg.isHighlighted && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#af4d30] text-white uppercase tracking-wider">
                                      <Sparkles className="w-3 h-3" /> Destaque
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <EditPackageDialog
                                    pkg={pkg}
                                    services={services}
                                  />
                                  <DeleteAction id={pkg.id} type="package" />
                                </div>
                              </div>

                              <h3 className="text-base font-bold text-slate-900 mt-1">
                                {pkg.name}
                              </h3>

                              {pkg.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {pkg.description}
                                </p>
                              )}

                              <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline gap-2">
                                <span className="text-xl font-bold font-heading text-[#af4d30]">
                                  {pkg.price
                                    ? `R$ ${pkg.price.toFixed(2).replace(".", ",")}`
                                    : "Sob consulta"}
                                </span>
                                {pkg.duration && (
                                  <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {pkg.duration} min
                                  </span>
                                )}
                              </div>

                              {featuresList.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                                  <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                    Incluso:
                                  </p>
                                  {featuresList.slice(0, 4).map((f) => (
                                    <div
                                      key={f}
                                      className="flex items-start gap-1.5 text-xs text-slate-600"
                                    >
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span className="line-clamp-1">{f}</span>
                                    </div>
                                  ))}
                                  {featuresList.length > 4 && (
                                    <p className="text-[10px] text-slate-400 pl-5">
                                      +{featuresList.length - 4} outros itens
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Tab 2: Planos de Acompanhamento (Recorrentes) */}
        <TabsContent value="planos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planoPackages.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl shadow-xs border border-slate-200">
                <Layers className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum plano recorrente cadastrado.
                </p>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Crie planos mensais, trimestrais ou anuais para acompanhamento
                  contínuo.
                </p>
                {services.length > 0 && (
                  <CreatePackageDialog
                    services={services}
                    defaultBillingCycle="MONTHLY"
                  />
                )}
              </div>
            ) : (
              planoPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {formatCycle(pkg.billingCycle)}
                      </span>
                      <div className="flex items-center gap-1">
                        <EditPackageDialog pkg={pkg} services={services} />
                        <DeleteAction id={pkg.id} type="package" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Serviço:{" "}
                      <span className="font-semibold text-slate-700">
                        {pkg.parentService.name}
                      </span>
                    </p>

                    <div className="mb-4">
                      <span className="font-bold text-[#af4d30] text-2xl font-heading">
                        {pkg.price
                          ? `R$ ${pkg.price.toFixed(2).replace(".", ",")}`
                          : "Sob consulta"}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        / {formatCycle(pkg.billingCycle).toLowerCase()}
                      </span>
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-slate-600 mb-4">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Pacotes Avulsos */}
        <TabsContent value="pacotes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avulsoPackages.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl shadow-xs border border-slate-200">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-900">
                  Nenhum pacote avulso cadastrado.
                </p>
                {services.length > 0 && (
                  <CreatePackageDialog
                    services={services}
                    defaultBillingCycle="ONETIME"
                  />
                )}
              </div>
            ) : (
              avulsoPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Pacote Avulso
                      </span>
                      <div className="flex items-center gap-1">
                        <EditPackageDialog pkg={pkg} services={services} />
                        <DeleteAction id={pkg.id} type="package" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Serviço:{" "}
                      <span className="font-semibold text-slate-700">
                        {pkg.parentService.name}
                      </span>
                    </p>

                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="font-bold text-[#af4d30] text-2xl font-heading">
                        {pkg.price
                          ? `R$ ${pkg.price.toFixed(2).replace(".", ",")}`
                          : "Sob consulta"}
                      </span>
                      {pkg.duration && (
                        <span className="text-xs text-slate-500">
                          • {pkg.duration} min
                        </span>
                      )}
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-slate-600 mb-4">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Categorias */}
        <TabsContent value="categorias">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#af4d30]/10 text-[#af4d30] rounded-xl flex items-center justify-center">
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
                        <span className="text-xs text-slate-500">
                          {service.packages.length} planos/pacotes
                        </span>
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
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
