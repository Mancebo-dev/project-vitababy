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

  // Double check it's a client
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "client") {
    // Admin trying to access portal? Allow them or redirect?
    // Usually admin uses /admin, let's redirect them to /admin if they are admin.
    if (user?.role === "admin") {
      redirect("/admin");
    } else {
      // Just in case
      redirect("/portal/login");
    }
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
