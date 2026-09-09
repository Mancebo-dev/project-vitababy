import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-heading text-2xl font-bold text-primary">
              VITA BABY
            </span>
            <p className="text-sm text-foreground/70 text-center md:text-left">
              © {new Date().getFullYear()} Vitababy. Todos os direitos
              reservados.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-secondary-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link
              href="#contato"
              className="hover:text-primary transition-colors"
            >
              Contato
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              WhatsApp
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
