import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Galeria | Vita Baby",
  description:
    "Conheça um pouco do nosso trabalho através de nossa galeria de fotos.",
};

const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    alt: "Mãe segurando recém-nascido",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
    alt: "Pezinho de bebê",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80", // duplicate for placeholder
    alt: "Consultoria em amamentação",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1522771930-78848d92fa24?auto=format&fit=crop&w=800&q=80",
    alt: "Quarto de bebê",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80",
    alt: "Brincando com o bebê",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    alt: "Maternidade",
  },
];

export default function PublicGaleriaPage() {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-[#e4e2de]"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white font-medium text-lg drop-shadow-md">
                    {image.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>

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
