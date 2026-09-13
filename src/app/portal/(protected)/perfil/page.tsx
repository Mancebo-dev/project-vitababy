import { Lock, Shield, Trash2, User } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";
import { PasswordForm } from "./components/PasswordForm";
import { ProfileForm } from "./components/ProfileForm";

export default async function PortalPerfil() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  const client = await prisma.client.findFirst({
    where: { userId: session?.user?.id },
  });

  if (!client) {
    return (
      <div className="p-4">
        <h1>Perfil não encontrado.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-heading text-[#411f03]">
          Meu Perfil
        </h1>
        <p className="text-[#444840]">
          Gerencie seus dados pessoais, senha e privacidade.
        </p>
      </header>

      <section className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#f0eee9]">
          <div className="w-20 h-20 rounded-full bg-[#af4d30]/10 flex items-center justify-center text-[#af4d30]">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-[#411f03]">{client.name}</h2>
            <p className="text-[#7d7a75]">{client.email}</p>
          </div>
        </div>

        <ProfileForm client={client} />
      </section>

      <section className="bg-white p-6 rounded-2xl border border-[#e4e2de] shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#af4d30]" />
          <h3 className="font-bold text-[#411f03] text-lg">Segurança</h3>
        </div>
        <p className="text-sm text-[#444840]">
          Para alterar sua senha atual, preencha os campos abaixo.
        </p>

        <PasswordForm />
      </section>

      <section className="bg-[#fdf2f0] p-6 rounded-2xl border border-[#f5c6cb] shadow-sm flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-red-700 text-lg">Privacidade (LGPD)</h3>
        </div>
        <p className="text-sm text-red-800">
          Você tem o direito de solicitar a exclusão de todos os seus dados
          pessoais armazenados em nosso sistema, conforme a Lei Geral de
          Proteção de Dados (LGPD). Note que alguns dados financeiros podem ser
          retidos por obrigações legais.
        </p>
        <div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
          >
            <Trash2 className="w-4 h-4" /> Solicitar Exclusão da Conta
          </button>
        </div>
      </section>
    </div>
  );
}
