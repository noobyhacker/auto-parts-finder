const TELEGRAM = "https://t.me/magazinamur";
const WHATSAPP_BASE = "https://wa.me/message/ZVLZMRTXDIIPJ1";
const WHATSAPP_PHONE = "821035891980";
const MAX = "https://max.ru/u/f9LHodD0cOJAWBgVJrrdb5HwnEGYVFsAS-zU-iCw9FLq43FidiYM8Oxc1vI";

interface PartContext {
  name: string;
  articleNumber?: string | null;
  oemNumber?: string | null;
}

function buildMessage(part: PartContext): string {
  const article = part.articleNumber ? ` (арт. ${part.articleNumber})` : "";
  const oem = part.oemNumber ? ` / OEM: ${part.oemNumber}` : "";
  return `Здравствуйте! Интересует запчасть: ${part.name}${article}${oem}`;
}

export function getTelegramLink(part?: PartContext): string {
  if (!part) return TELEGRAM;
  return `${TELEGRAM}?text=${encodeURIComponent(buildMessage(part))}`;
}

export function getWhatsAppLink(part?: PartContext): string {
  if (!part) return WHATSAPP_BASE;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildMessage(part))}`;
}

export function getMaxLink(): string {
  return MAX;
}
