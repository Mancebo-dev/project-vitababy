import type { Metadata } from "next";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Vita Baby",
  description: "Painel administrativo da Vita Baby",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
