import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/portal/MobileNav";
import { Sidebar } from "@/components/portal/Sidebar";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Área do Cliente | Vita Baby",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/portal/login");
  }

  // Double check it's a valid user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/portal/login");
  }

  // If user role is "user", normalize to "client"
  if (user.role === "user") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "client" },
    });
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Navbar */}
      <MobileNav />

      <main className="flex-1 min-w-0 md:ml-[80px] pt-[4.5rem] md:pt-[2rem] px-[1.5rem] md:px-[2rem] pb-[2rem] transition-all duration-300">
        {isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-sm">
            <span>
              Você está acessando a Área do Cliente em modo{" "}
              <strong>Administrador</strong>.
            </span>
            <a
              href="/admin"
              className="inline-flex items-center justify-center px-3 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition-colors w-fit"
            >
              Voltar ao Painel Admin
            </a>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
