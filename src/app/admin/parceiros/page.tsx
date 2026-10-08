import { prisma } from "@/infrastructure/db/prisma";
import { PartnerManager } from "./components/PartnerManager";

export const metadata = {
  title: "Parceiros | Vita Baby Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminParceirosPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#411f03]">
            Parceiros e Convênios
          </h2>
          <p className="text-slate-500">
            Gerencie as marcas de empresas e profissionais que aparecem no site.
          </p>
        </div>
      </div>

      <PartnerManager partners={partners} />
    </div>
  );
}
