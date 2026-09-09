import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f3ef] pt-[4rem] pb-[2rem] border-t border-[#e4e2de]">
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[1.5rem]">
          <div className="flex flex-col items-center md:items-start gap-[0.5rem]">
            <span className="font-heading text-[1.5rem] font-bold text-[#411f03]">
              VITA BABY
            </span>
            <p className="text-[0.875rem] text-[#444840]/70 text-center md:text-left">
              © {new Date().getFullYear()} Vitababy. Todos os direitos
              reservados.
            </p>
          </div>

          <div className="flex items-center gap-[1.5rem] text-[0.875rem] font-semibold text-[#411f03]">
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
