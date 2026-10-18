export const VITA_BABY_WHATSAPP = "5522997728581";
export const VITA_BABY_WHATSAPP_DISPLAY = "(22) 99772-8581";

/**
 * Formata um número de telefone para o padrão internacional do WhatsApp (com DDI 55).
 * Evita duplicação de '55' caso o número já possua o código do país.
 */
export function formatWhatsAppPhone(phone?: string | null): string {
  if (!phone) return VITA_BABY_WHATSAPP;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return VITA_BABY_WHATSAPP;

  // Se já começar com 55 e tiver 12 ou 13 dígitos (e.g., 5522997728581), mantém
  if (
    digits.startsWith("55") &&
    (digits.length === 12 || digits.length === 13)
  ) {
    return digits;
  }

  // Se tiver 10 ou 11 dígitos (DDD + número), adiciona 55
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  // Se for maior que 11 dígitos mas não começa com 55
  if (!digits.startsWith("55")) {
    return `55${digits}`;
  }

  return digits;
}

/**
 * Constrói o link oficial do WhatsApp (wa.me) de forma segura.
 * Se o telefone for omitido mas houver mensagem, retorna link genérico de compartilhamento (wa.me/?text=...).
 * Se nenhum parâmetro for passado, retorna o link do WhatsApp oficial da Vita Baby.
 */
export function buildWhatsAppLink(
  phone?: string | null,
  message?: string,
): string {
  const hasPhone = Boolean(phone?.trim());
  const finalPhone = hasPhone ? formatWhatsAppPhone(phone) : null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  if (!finalPhone) {
    if (message) {
      return `https://wa.me/${query}`;
    }
    return `https://wa.me/${VITA_BABY_WHATSAPP}`;
  }

  return `https://wa.me/${finalPhone}${query}`;
}
