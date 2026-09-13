import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";
import { ClientUploadForm } from "./ClientUploadForm";

export const metadata: Metadata = {
  title: "Meus Exames | Portal Vita Baby",
};

export default async function ExamesPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/portal/login");
  }

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: {
      files: {
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

  const getIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes("image"))
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <FileIcon className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#411f03]">
            Meus Exames e Arquivos
          </h1>
          <p className="text-slate-500 mt-1">
            Visualize ou envie novos documentos para análise.
          </p>
        </div>
        <ClientUploadForm clientId={client.id} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e4e2de] overflow-hidden">
        <div className="p-6">
          {client.files.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-[#d1cece] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                Nenhum arquivo enviado
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Você ainda não possui exames ou documentos salvos. Clique no
                botão acima para enviar seu primeiro arquivo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.files.map((file) => (
                <div
                  key={file.id}
                  className="border border-[#e4e2de] rounded-lg p-4 flex gap-4 hover:border-[#af4d30] transition-colors"
                >
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
                    {getIcon(file.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">
                      {file.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span>
                        {format(new Date(file.createdAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-primary uppercase text-[10px]">
                        {file.uploadedBy === "CLIENT"
                          ? "ENVIADO POR MIM"
                          : "ENVIADO PELA CLÍNICA"}
                      </span>
                    </p>
                    {file.description && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#af4d30] hover:underline mt-3"
                    >
                      <Download className="w-4 h-4" /> Visualizar Arquivo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
