import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { auth } from "@/infrastructure/auth/auth";
import { prisma } from "@/infrastructure/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Vita Baby",
  description: "Painel administrativo da Vita Baby",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (user?.role !== "admin") {
    redirect("/portal");
  }

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Navbar */}
      <MobileNav />

      <main className="flex-1 min-w-0 md:ml-[80px] pt-[4.5rem] md:pt-[2rem] px-[1.5rem] md:px-[2rem] pb-[2rem] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
