"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#fbf9f5]/95 backdrop-blur-sm shadow-sm py-[0.5rem]" : "bg-transparent py-[1rem]"}`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] h-[5rem] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby Assessoria"
              width={604}
              height={151}
              priority
              className="h-[2.25rem] md:h-[2.75rem] w-auto object-contain"
              style={{ width: "auto" }}
            />
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
            <Link href="/agendamento">
              <Button className="rounded-full px-[1.5rem] h-[3rem] bg-[#af4d30] text-white hover:bg-[#af4d30]/90 font-semibold shadow-md text-[0.875rem]">
                Agendar Consultoria
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-[0.5rem] text-[#411f03] hover:text-[#af4d30] transition-colors z-50"
          >
            {isOpen ? (
              <X className="w-[2rem] h-[2rem]" />
            ) : (
              <Menu className="w-[2rem] h-[2rem]" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="md:hidden fixed inset-0 bg-[#411f03]/20 backdrop-blur-sm z-40 transition-opacity border-none cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white z-40 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[5rem] px-[1.5rem] border-b border-[#e4e2de] flex items-center justify-between mt-[5rem]">
          <span className="font-heading font-bold text-[1.125rem] text-[#411f03]">
            Menu
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-[1.5rem] flex flex-col gap-[0.5rem]">
          <Link
            href="#home"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors text-[#444840] hover:bg-[#fbf9f5] hover:text-[#af4d30]"
          >
            Home
          </Link>
          <Link
            href="#sobre"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors text-[#444840] hover:bg-[#fbf9f5] hover:text-[#af4d30]"
          >
            Sobre
          </Link>
          <Link
            href="#servicos"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors text-[#444840] hover:bg-[#fbf9f5] hover:text-[#af4d30]"
          >
            Serviços
          </Link>
          <Link
            href="#depoimentos"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors text-[#444840] hover:bg-[#fbf9f5] hover:text-[#af4d30]"
          >
            Depoimentos
          </Link>
          <Link
            href="#contato"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-xl text-[0.9375rem] font-medium transition-colors text-[#444840] hover:bg-[#fbf9f5] hover:text-[#af4d30]"
          >
            Contato
          </Link>
        </nav>

        <div className="p-[1.5rem] border-t border-[#e4e2de]">
          <Link href="/agendamento" onClick={() => setIsOpen(false)}>
            <Button className="w-full rounded-xl h-[3.5rem] bg-[#af4d30] text-white hover:bg-[#af4d30]/90 font-semibold shadow-md text-[0.9375rem]">
              Agendar Consultoria
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
