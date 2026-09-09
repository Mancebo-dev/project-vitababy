import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-primary">
            VITA BABY
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#home"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="#sobre"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#servicos"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Serviços
          </Link>
          <Link
            href="#depoimentos"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Depoimentos
          </Link>
          <Link
            href="#contato"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contato
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md">
            Agendar Consultoria
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button type="button" className="md:hidden p-2 text-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
