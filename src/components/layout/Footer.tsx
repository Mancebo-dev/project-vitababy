import Image from "next/image";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#f5f3ef] pt-[5rem] pb-[2rem] border-t border-[#e4e2de]">
      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[3rem] mb-[4rem]">
          {/* Brand */}
          <div className="flex flex-col gap-[1rem] lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo-vita-baby.png"
                alt="Vita Baby Assessoria"
                width={604}
                height={151}
                loading="lazy"
                className="h-[2.5rem] w-auto object-contain"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-[#444840] text-[0.875rem] leading-[1.6]">
              Cuidado materno-infantil humanizado, com apoio em amamentação,
              banho humanizado e perfuração de lóbulo.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="flex flex-col gap-[1rem]">
            <h4 className="font-heading text-[1.125rem] font-bold text-[#411f03]">
              Navegação
            </h4>
            <ul className="flex flex-col gap-[0.5rem] text-[#444840] text-[0.875rem]">
              <li>
                <Link
                  href="#home"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="#sobre"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="#servicos"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#depoimentos"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Depoimentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Acessos */}
          <div className="flex flex-col gap-[1rem]">
            <h4 className="font-heading text-[1.125rem] font-bold text-[#411f03]">
              Acessos
            </h4>
            <ul className="flex flex-col gap-[0.5rem] text-[#444840] text-[0.875rem]">
              <li>
                <Link
                  href="/portal"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Área do Cliente
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Área do Profissional
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-[1rem]">
            <h4 className="font-heading text-[1.125rem] font-bold text-[#411f03]">
              Legal
            </h4>
            <ul className="flex flex-col gap-[0.5rem] text-[#444840] text-[0.875rem]">
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos-de-uso"
                  className="hover:text-[#af4d30] transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato & Redes */}
          <div className="flex flex-col gap-[1rem]">
            <h4 className="font-heading text-[1.125rem] font-bold text-[#411f03]">
              Contato
            </h4>
            <ul className="flex flex-col gap-[0.5rem] text-[#444840] text-[0.875rem]">
              <li>WhatsApp: (11) 99999-9999</li>
              <li>Email: contato@vitababy.com.br</li>
            </ul>
            <div className="flex gap-[1rem] mt-[0.5rem]">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[2.5rem] h-[2.5rem] bg-[#fbf9f5] hover:bg-[#af4d30] border border-[#e4e2de] hover:border-[#af4d30] rounded-full flex items-center justify-center text-[#411f03] hover:text-white shadow-sm hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[2.5rem] h-[2.5rem] bg-[#fbf9f5] hover:bg-[#af4d30] border border-[#e4e2de] hover:border-[#af4d30] rounded-full flex items-center justify-center text-[#411f03] hover:text-white shadow-sm hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#e4e2de] pt-[2rem] gap-[1rem]">
          <p className="text-[0.875rem] text-[#444840]/70 text-center md:text-left">
            © {new Date().getFullYear()} Vita Baby Consultoria. Todos os
            direitos reservados.
          </p>
          <p className="text-[0.75rem] text-[#444840]/50 text-center md:text-right">
            CNPJ: 00.000.000/0000-00
          </p>
        </div>
      </div>
    </footer>
  );
}
