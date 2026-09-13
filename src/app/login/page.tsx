import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acesso | Vita Baby",
  description:
    "Acesse sua conta para gerenciar seus agendamentos e documentos.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#fbf9f5]">
      <div className="w-full pt-[2.5rem] px-[1.5rem] lg:px-[7.5rem] max-w-[1000px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para o site
        </Link>
      </div>

      <section className="flex-1 flex items-center justify-center py-[5rem] px-[1.5rem] w-full">
        <LoginForm />
      </section>

      <Footer />
    </main>
  );
}
