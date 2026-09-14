"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/infrastructure/auth/client";
import { portalNavItems } from "./Sidebar";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/portal/login";
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#e4e2de] fixed top-0 w-full z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#af4d30] flex items-center justify-center text-white font-bold">
            VB
          </div>
          <span className="font-heading font-bold text-lg text-[#411f03]">
            Área do Cliente
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 text-[#444840] hover:text-[#411f03] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="md:hidden fixed inset-0 bg-[#411f03]/20 backdrop-blur-sm z-50 transition-opacity border-none cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[4.5rem] px-[1.5rem] border-b border-[#e4e2de] flex items-center justify-between">
          <span className="font-heading font-bold text-[1.125rem] text-[#411f03]">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-[1.5rem] flex flex-col gap-[0.5rem]">
          {portalNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors ${
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

        <div className="p-[1.5rem] border-t border-[#e4e2de]">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-[0.75rem] w-full px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium text-[#af4d30] hover:bg-[#fdf2f0] transition-colors"
          >
            <LogOut className="w-[1.25rem] h-[1.25rem]" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
}
