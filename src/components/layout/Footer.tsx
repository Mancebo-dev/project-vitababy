import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#fbf9f5] pt-16 pb-8 border-t border-[#e4e2de]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-heading text-[24px] font-bold text-[#411f03] tracking-widest leading-none">
              VITA BABY
            </span>
            <p className="text-[12px] text-[#444840]">
              © {new Date().getFullYear()} Vitababy. Todos os direitos
              reservados.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[14px] font-medium text-[#444840]">
            <Link href="#" className="hover:text-[#af4d30] transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-[#af4d30] transition-colors">
              Privacidade
            </Link>
            <Link
              href="#contato"
              className="hover:text-[#af4d30] transition-colors"
            >
              Contato
            </Link>
            <Link href="#" className="hover:text-[#af4d30] transition-colors">
              WhatsApp
            </Link>
            <Link href="#" className="hover:text-[#af4d30] transition-colors">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
