import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { prisma } from "@/infrastructure/db/prisma";

export const metadata: Metadata = {
  title: "Galeria | Vita Baby",
  description:
    "Conheça um pouco do nosso trabalho através de nossa galeria de fotos.",
};

export const revalidate = 60; // revalidate at most every minute

export default async function PublicGaleriaPage() {
  const images = await prisma.publicGallery.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f5]">
      <Navbar />

      <main className="flex-1 pt-[120px] pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#411f03] mb-4">
              Nossa Galeria
            </h1>
            <p className="text-lg text-[#7d7a75]">
              Um pouco do nosso trabalho, cuidado e dedicação com as famílias
              Vita Baby.
            </p>
          </div>

          {images.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className="text-lg text-slate-500">
                Nenhuma imagem disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-[#e4e2de]"
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-white font-medium text-lg drop-shadow-md">
                      {image.title}
                    </span>
                    {image.description && (
                      <span className="text-white/80 text-sm mt-1">
                        {image.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-[#7d7a75] mb-6">
              Quer ver mais do nosso dia a dia?
            </p>
            <a
              href="https://instagram.com/vitababy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#af4d30] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#8c3d26]"
            >
              Siga nosso Instagram
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
