import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export const metadata: Metadata = {
  title: "Galeria de Fotos | Portal Vita Baby",
};

export default async function GaleriaPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/portal/login");
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: {
      files: {
        where: {
          fileType: {
            contains: "image",
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return (
      <div className="p-6 text-center text-slate-500">
        Perfil de cliente não encontrado. Entre em contato com o suporte.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-[#411f03]">
          Galeria de Fotos
        </h1>
        <p className="text-slate-500 mt-2">
          Momentos especiais registrados durante seus atendimentos.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e4e2de] overflow-hidden min-h-[400px]">
        {client.files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
            <ImageIcon className="w-16 h-16 text-[#e4e2de] mb-4" />
            <h3 className="text-xl font-bold text-[#411f03] mb-2">
              Nenhuma foto disponível
            </h3>
            <p className="text-slate-500 max-w-sm">
              As fotos dos seus atendimentos aparecerão aqui assim que nossa equipe fizer o upload.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {client.files.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-[#e4e2de] shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={file.fileUrl}
                  alt={file.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h4 className="text-white font-bold text-lg truncate">
                    {file.title}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {format(new Date(file.createdAt), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                  {file.description && (
                    <p className="text-white/90 text-sm mt-1 line-clamp-2">
                      {file.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
