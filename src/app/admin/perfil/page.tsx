import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";
import { ProfileForm } from "./components/ProfileForm";

export const metadata: Metadata = {
  title: "Meu Perfil | Vita Baby Dashboard",
};

export default async function AdminPerfilPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  // Find associated professional profile if any
  const professional = await prisma.professional.findFirst({
    where: {
      OR: [{ userId: user.id }, { email: user.email }],
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Meu Perfil
        </h1>
        <p className="text-slate-500 mt-2">
          Gerencie sua foto, especialidades clínicas, informações de contato e
          segurança de acesso.
        </p>
      </div>

      <ProfileForm user={user} professional={professional} />
    </div>
  );
}
