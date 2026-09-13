"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/infrastructure/auth/client";
import { navItems } from "./Sidebar"; // Export navItems from Sidebar

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="md:hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-[1rem] bg-white border-b border-[#e4e2de] fixed top-0 w-full z-40 shadow-sm">
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-[2rem] h-[2rem] bg-[#af4d30] rounded-lg flex items-center justify-center text-white font-bold font-heading">
            V
          </div>
          <span className="font-heading font-bold text-[1.25rem] text-[#411f03]">
            Vitababy
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#411f03] hover:bg-[#fbf9f5] rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay & Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30 pt-[4.5rem] bg-white flex flex-col h-screen">
          <nav className="flex-1 overflow-y-auto p-[1rem] flex flex-col gap-[0.5rem]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-[0.75rem] px-[1rem] py-[1rem] rounded-xl text-[1rem] font-medium transition-colors ${
                    isActive
                      ? "bg-[#af4d30]/10 text-[#af4d30]"
                      : "text-[#444840] hover:bg-[#fbf9f5] hover:text-[#411f03]"
                  }`}
                >
                  <item.icon
                    className={`w-[1.25rem] h-[1.25rem] ${
                      isActive ? "text-[#af4d30]" : "text-[#7d7a75]"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-[1.5rem] border-t border-[#e4e2de] mb-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-[0.75rem] px-[1rem] py-[1rem] rounded-xl text-[1rem] font-medium text-[#af4d30] hover:bg-[#fdf2f0] transition-colors w-full"
            >
              <LogOut className="w-[1.25rem] h-[1.25rem]" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
