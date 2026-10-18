import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, VITA_BABY_WHATSAPP } from "@/utils/whatsapp";

export function FloatingWhatsAppButton() {
  const whatsappUrl = buildWhatsAppLink(
    VITA_BABY_WHATSAPP,
    "Olá! Gostaria de tirar algumas dúvidas sobre os serviços da Vita Baby.",
  );

  return (
    <div className="group fixed bottom-[2rem] right-[1.5rem] sm:right-[2rem] z-40 flex items-center gap-2 select-none">
      {/* Tooltip / Balão explicativo acionado via CSS group-hover */}
      <div className="hidden sm:flex items-center bg-white text-[#411f03] text-xs font-bold py-2 px-3.5 rounded-full shadow-lg border border-[#e4e2de] transition-all duration-300 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none">
        <span>Fale conosco no WhatsApp</span>
      </div>

      {/* Botão flutuante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="relative group/btn w-[3.5rem] h-[3.5rem] bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Efeito de onda / ping */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 group-hover/btn:opacity-0" />

        <MessageCircle className="w-7 h-7 fill-current stroke-none relative z-10" />
      </a>
    </div>
  );
}
