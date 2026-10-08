import { prisma } from "@/infrastructure/db/prisma";
import { GalleryManager } from "./components/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const publicImages = await prisma.publicGallery.findMany({
    orderBy: { order: "asc" },
  });

  const clientImages = await prisma.clientFile.findMany({
    where: { fileType: { contains: "image" } },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#411f03]">
            Galeria do Site
          </h2>
          <p className="text-slate-500">
            Gerencie as fotos que aparecem na galeria pública do site Vitababy.
          </p>
        </div>
      </div>

      <GalleryManager publicImages={publicImages} clientImages={clientImages} />
    </div>
  );
}
