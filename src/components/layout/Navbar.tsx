"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#fbf9f5]/95 backdrop-blur-sm shadow-sm py-[0.5rem]" : "bg-transparent py-[1rem]"}`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] h-[5rem] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center">
          <span className="font-heading text-[1.5rem] font-bold text-[#411f03] tracking-[0.1em] leading-none">
            VITA BABY
          </span>
          <span className="text-[0.625rem] text-[#411f03] tracking-[0.2em] font-medium mt-[0.25rem]">
            ASSESSORIA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-[2.5rem]">
          <Link
            href="#home"
            className="text-[1rem] font-medium text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            Home
          </Link>
          <Link
            href="#sobre"
            className="text-[1rem] font-medium text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#servicos"
            className="text-[1rem] font-medium text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            Serviços
          </Link>
          <Link
            href="#depoimentos"
            className="text-[1rem] font-medium text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            Depoimentos
          </Link>
          <Link
            href="#contato"
            className="text-[1rem] font-medium text-[#444840] hover:text-[#af4d30] transition-colors"
          >
            Contato
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button className="rounded-full px-[1.5rem] h-[3rem] bg-[#af4d30] text-white hover:bg-[#af4d30]/90 font-semibold shadow-md text-[0.875rem]">
            Agendar Consultoria
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button type="button" className="md:hidden p-[0.5rem] text-[#411f03]">
          <Menu className="w-[2rem] h-[2rem]" />
        </button>
      </div>
    </header>
  );
}
