"use client";

import {
  Building2,
  Calendar,
  CalendarDays,
  DollarSign,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Package,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/infrastructure/auth/client";

export const navItems = [
  { name: "Início", href: "/admin", icon: Home },
  { name: "Agendamentos", href: "/admin/agendamentos", icon: CalendarDays },
  { name: "Agenda", href: "/admin/agenda", icon: Calendar },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Serviços", href: "/admin/servicos", icon: Package },
  { name: "Contratos", href: "/admin/contratos", icon: FileText },
  { name: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
  { name: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
  { name: "Depoimentos", href: "/admin/depoimentos", icon: MessageSquare },
  { name: "Assessoras", href: "/admin/assessoras", icon: Building2 },
  { name: "Meu Perfil", href: "/admin/perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="group w-[80px] hover:w-[280px] h-screen bg-white border-r border-[#e4e2de] flex flex-col fixed left-0 top-0 z-50 overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-[1.5rem] flex items-center gap-[0.75rem] min-w-[280px]">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/assets/logo-vita-baby.png"
            alt="Vitababy"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        <span className="font-heading font-bold text-[1.25rem] text-[#411f03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Vitababy
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-[1rem] px-[1rem] flex flex-col gap-[0.25rem]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-[0.75rem] px-[1rem] py-[0.75rem] rounded-xl text-[0.9375rem] font-medium transition-colors min-w-[240px] ${
                isActive
                  ? "bg-[#af4d30]/10 text-[#af4d30]"
                  : "text-[#444840] hover:bg-[#fbf9f5] hover:text-[#411f03]"
              }`}
            >
              <item.icon
                className={`w-[1.25rem] h-[1.25rem] flex-shrink-0 ${
                  isActive ? "text-[#af4d30]" : "text-[#7d7a75]"
                }`}
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-[1rem] border-t border-[#e4e2de] min-w-[280px]">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-[0.75rem] px-[1rem] py-[0.75rem] rounded-xl text-[0.9375rem] font-medium text-[#af4d30] hover:bg-[#fdf2f0] transition-colors w-[calc(100%-2rem)] max-w-[240px]"
        >
          <LogOut className="w-[1.25rem] h-[1.25rem] flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
