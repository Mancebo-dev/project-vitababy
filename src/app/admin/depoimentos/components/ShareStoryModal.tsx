"use client";

import type { Review } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Copy, Download, Loader2, Share2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ThemeId = "terracotta" | "cream" | "rose" | "dark";

interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgStart: string;
  bgEnd: string;
  bgGlow: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  quoteColor: string;
  textPrimary: string;
  textSecondary: string;
  starColor: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  footerText: string;
  dividerColor: string;
  colorIndicator: string;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  terracotta: {
    id: "terracotta",
    name: "Terracota Vita Baby",
    bgStart: "#fdf8f5",
    bgEnd: "#f6ece4",
    bgGlow: "rgba(174, 77, 48, 0.08)",
    cardBg: "#ae4d30",
    cardBorder: "#c66e56",
    cardShadow: "rgba(174, 77, 48, 0.35)",
    quoteColor: "rgba(255, 255, 255, 0.22)",
    textPrimary: "#ffffff",
    textSecondary: "#fcefe9",
    starColor: "#ffc83b",
    pillBg: "rgba(255, 255, 255, 0.16)",
    pillBorder: "rgba(255, 255, 255, 0.3)",
    pillText: "#ffffff",
    footerText: "#8c3d26",
    dividerColor: "rgba(255, 255, 255, 0.18)",
    colorIndicator: "#ae4d30",
  },
  cream: {
    id: "cream",
    name: "Nude & Linho Elegante",
    bgStart: "#fbf9f5",
    bgEnd: "#f2ece2",
    bgGlow: "rgba(209, 169, 143, 0.1)",
    cardBg: "#ffffff",
    cardBorder: "#eaded5",
    cardShadow: "rgba(68, 72, 64, 0.08)",
    quoteColor: "rgba(174, 77, 48, 0.15)",
    textPrimary: "#2d2825",
    textSecondary: "#736a64",
    starColor: "#f59e0b",
    pillBg: "#f7efe9",
    pillBorder: "#eeddd1",
    pillText: "#ae4d30",
    footerText: "#736a64",
    dividerColor: "#f0e6de",
    colorIndicator: "#f5ece3",
  },
  rose: {
    id: "rose",
    name: "Rosa Maternidade",
    bgStart: "#fff7f6",
    bgEnd: "#fbe4df",
    bgGlow: "rgba(235, 145, 125, 0.12)",
    cardBg: "#ffffff",
    cardBorder: "#f7d5ce",
    cardShadow: "rgba(198, 110, 86, 0.1)",
    quoteColor: "rgba(219, 112, 92, 0.18)",
    textPrimary: "#3e2724",
    textSecondary: "#825d57",
    starColor: "#f59e0b",
    pillBg: "#fdeeed",
    pillBorder: "#f8d5cf",
    pillText: "#c25741",
    footerText: "#825d57",
    dividerColor: "#fae1dc",
    colorIndicator: "#f8d5cf",
  },
  dark: {
    id: "dark",
    name: "Noite Serena (Dark)",
    bgStart: "#211a17",
    bgEnd: "#14110f",
    bgGlow: "rgba(174, 77, 48, 0.15)",
    cardBg: "#2c2320",
    cardBorder: "#453833",
    cardShadow: "rgba(0, 0, 0, 0.4)",
    quoteColor: "rgba(235, 145, 125, 0.18)",
    textPrimary: "#fdf8f5",
    textSecondary: "#baa9a0",
    starColor: "#fbbf24",
    pillBg: "rgba(255, 255, 255, 0.08)",
    pillBorder: "rgba(255, 255, 255, 0.15)",
    pillText: "#f19e88",
    footerText: "#9a8b83",
    dividerColor: "rgba(255, 255, 255, 0.1)",
    colorIndicator: "#2c2320",
  },
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillColor: string,
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export function ShareStoryModal({
  review,
}: {
  review: Review & { client?: { name: string; childName?: string | null } };
}) {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("terracotta");
  const [showChildName, setShowChildName] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const clientName = review.client?.name || "Cliente Especial";
  const childName = review.client?.childName;
  const comment = review.comment;
  const rating = review.rating || 5;
  const dateFormatted = format(new Date(review.createdAt), "MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const generateStoryCanvas = useCallback(async () => {
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const theme = THEMES[selectedTheme];

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
      bgGrad.addColorStop(0, theme.bgStart);
      bgGrad.addColorStop(0.5, theme.bgStart);
      bgGrad.addColorStop(1, theme.bgEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Radial glow at center
      const glowGrad = ctx.createRadialGradient(540, 960, 50, 540, 960, 650);
      glowGrad.addColorStop(0, theme.bgGlow);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 3. Load Brand Logo
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/assets/logo-vita-baby.png";

      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve();
        setTimeout(resolve, 300);
      });

      // 4. Header with Brand Identity
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoTargetHeight = 90;
        const logoTargetWidth =
          (logoImg.naturalWidth / logoImg.naturalHeight) * logoTargetHeight;
        const logoX = (1080 - logoTargetWidth) / 2;
        ctx.drawImage(logoImg, logoX, 140, logoTargetWidth, logoTargetHeight);
      } else {
        // Fallback typographic logo
        ctx.font =
          "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = selectedTheme === "dark" ? "#ffffff" : "#ae4d30";
        ctx.textAlign = "center";
        ctx.fillText("VITA BABY", 540, 185);
      }

      ctx.font =
        "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.footerText;
      ctx.textAlign = "center";
      ctx.letterSpacing = "3px";
      ctx.fillText("CUIDADO MATERNO-INFANTIL", 540, 260);
      ctx.letterSpacing = "0px";

      // 5. Header Pill / Tag
      const pillWidth = 460;
      const pillHeight = 54;
      const pillX = (1080 - pillWidth) / 2;
      const pillY = 300;

      drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 27);
      ctx.fillStyle = theme.pillBg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = theme.pillBorder;
      ctx.stroke();

      ctx.font =
        "bold 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.pillText;
      ctx.textAlign = "center";
      ctx.fillText("★  DEPOIMENTO VERIFICADO  ★", 540, pillY + 34);

      // 6. Central Card
      const cardWidth = 920;
      const cardX = (1080 - cardWidth) / 2;
      const cardY = 410;
      const cardHeight = 1120;

      // Card shadow
      ctx.save();
      ctx.shadowColor = theme.cardShadow;
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 44);
      ctx.fillStyle = theme.cardBg;
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = theme.cardBorder;
      ctx.stroke();

      // 7. Decorative Quote Symbol
      ctx.font = "italic bold 130px Georgia, serif";
      ctx.fillStyle = theme.quoteColor;
      ctx.textAlign = "center";
      ctx.fillText("“", 540, cardY + 140);

      // 8. Testimonial Comment Text (Intelligent sizing)
      const maxTextWidth = 780;
      let fontSize = 42;
      let lineHeight = 62;

      if (comment.length > 350) {
        fontSize = 28;
        lineHeight = 44;
      } else if (comment.length > 220) {
        fontSize = 32;
        lineHeight = 50;
      } else if (comment.length > 140) {
        fontSize = 36;
        lineHeight = 56;
      }

      ctx.font = `italic 500 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, serif`;
      ctx.fillStyle = theme.textPrimary;
      ctx.textAlign = "center";

      const lines = wrapText(ctx, `"${comment}"`, maxTextWidth);

      // Center comment block vertically in upper-mid card
      const totalTextHeight = lines.length * lineHeight;
      const commentStartY =
        cardY + 220 + Math.max(0, (480 - totalTextHeight) / 3);

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 540, commentStartY + i * lineHeight);
      }

      // 9. Golden Stars
      const starsY = Math.max(
        cardY + 760,
        commentStartY + totalTextHeight + 60,
      );
      const starSpacing = 52;
      const startX = 540 - ((5 - 1) * starSpacing) / 2;

      for (let s = 0; s < 5; s++) {
        const starX = startX + s * starSpacing;
        const isFilled = s < rating;
        const color = isFilled ? theme.starColor : "rgba(255, 255, 255, 0.25)";
        drawStar(ctx, starX, starsY, 5, 20, 9, color);
      }

      // 10. Divider inside card
      const dividerY = starsY + 54;
      ctx.beginPath();
      ctx.moveTo(cardX + 100, dividerY);
      ctx.lineTo(cardX + cardWidth - 100, dividerY);
      ctx.strokeStyle = theme.dividerColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 11. Client Avatar & Details
      const avatarY = dividerY + 70;
      const avatarRadius = 42;

      // Avatar circle
      ctx.beginPath();
      ctx.arc(540, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fillStyle = theme.pillBg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.pillBorder;
      ctx.stroke();

      // Avatar initial
      ctx.font =
        "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.textPrimary;
      ctx.textAlign = "center";
      ctx.fillText(clientName.charAt(0).toUpperCase(), 540, avatarY + 12);

      // Client Name
      ctx.font =
        "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.textPrimary;
      ctx.fillText(clientName, 540, avatarY + 78);

      // Child Name or Client Badge
      let currentSubY = avatarY + 116;
      if (showChildName && childName) {
        ctx.font =
          "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText(`Mãe do(a) ${childName}`, 540, currentSubY);
        currentSubY += 34;
      }

      // Date
      if (showDate) {
        ctx.font =
          "400 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText(
          dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1),
          540,
          currentSubY,
        );
      }

      // 12. Bottom Story Footer
      ctx.font =
        "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = selectedTheme === "dark" ? "#f19e88" : "#ae4d30";
      ctx.textAlign = "center";
      ctx.fillText("@vitababy", 540, 1720);

      ctx.font =
        "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.footerText;
      ctx.fillText("vitababy.com.br", 540, 1756);

      ctx.font =
        "400 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = theme.footerText;
      ctx.fillText(
        "Consultoria de Amamentação & Cuidados com o Bebê",
        540,
        1800,
      );

      // Generate Image data
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      setImageUrl(dataUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) setImageBlob(blob);
        },
        "image/png",
        1.0,
      );
    } catch (err) {
      console.error("Erro ao gerar canvas do story:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [
    selectedTheme,
    showChildName,
    showDate,
    clientName,
    childName,
    comment,
    rating,
    dateFormatted,
  ]);

  useEffect(() => {
    if (open) {
      generateStoryCanvas();
    }
  }, [open, generateStoryCanvas]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    const cleanName = clientName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-");
    link.download = `story-depoimento-${cleanName}.png`;
    link.href = imageUrl;
    link.click();
    showToast("Download da imagem iniciado!");
  };

  const handleCopyImage = async () => {
    if (!imageBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": imageBlob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        showToast("Imagem copiada! Cole no WhatsApp Web ou Instagram.");
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error(err);
      handleDownload();
    }
  };

  const handleShareWhatsApp = async () => {
    if (imageBlob && navigator.canShare) {
      try {
        const file = new File([imageBlob], "story-depoimento.png", {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Depoimento de ${clientName} - Vita Baby`,
            text: `Olha que depoimento lindo recebemos da ${clientName}! ❤️ Conheça mais em: https://vitababy.com.br`,
          });
          return;
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
        }
      }
    }

    // Direct WhatsApp web fallback
    const text = `Olha o depoimento carinhoso que recebemos de ${clientName}:\n\n"${comment}"\n\n❤️ Conheça mais sobre nosso cuidado em: https://vitababy.com.br`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    showToast("Abrindo WhatsApp com o depoimento formatado!");
  };

  const handleShareInstagram = async () => {
    if (imageBlob && navigator.canShare) {
      try {
        const file = new File([imageBlob], "story-depoimento.png", {
          type: "image/png",
        });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Story Depoimento - ${clientName}`,
          });
          return;
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
        }
      }
    }

    // Copy to clipboard & open Instagram
    await handleCopyImage();
    window.open("https://www.instagram.com/vitababyassessoria/", "_blank");
    showToast("Imagem copiada! Abra o Instagram Stories e cole.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-[#ae4d30] hover:bg-[#ae4d30]/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            title="Compartilhar depoimento (Criar Story)"
          />
        }
      >
        <Share2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ae4d30]/10 rounded-lg text-[#ae4d30]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                Compartilhar Depoimento nos Stories
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Gere uma arte 9:16 personalizada para publicar no Instagram e
                WhatsApp
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Toast / Feedback Notice */}
        {toastMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 pt-2">
          {/* Coluna Esquerda: Preview do Story (9:16) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-100/70 p-3 sm:p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800/80 bg-slate-900 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2 text-white text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#ae4d30]" />
                  <span>Renderizando Story...</span>
                </div>
              ) : imageUrl ? (
                // biome-ignore lint/performance/noImgElement: Canvas data URL preview generated dynamically
                <img
                  src={imageUrl}
                  alt="Prévia do Story"
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="text-slate-400 text-xs">
                  Carregando imagem...
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-medium">
              Dimensão: 1080 × 1920 px (Formato Stories)
            </span>
          </div>

          {/* Coluna Direita: Personalização e Ações */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Seletor de Temas */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Estilo Visual / Tema
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(THEMES).map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? "border-[#ae4d30] bg-[#ae4d30]/5 text-[#ae4d30] ring-1 ring-[#ae4d30] shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: theme.colorIndicator }}
                        />
                        <span className="truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opções de Conteúdo */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Informações no Card
                </span>

                {childName && (
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={showChildName}
                      onChange={(e) => setShowChildName(e.target.checked)}
                      className="rounded border-slate-300 text-[#ae4d30] focus:ring-[#ae4d30] w-4 h-4"
                    />
                    <span>
                      Exibir "Mãe do(a) <strong>{childName}</strong>"
                    </span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="rounded border-slate-300 text-[#ae4d30] focus:ring-[#ae4d30] w-4 h-4"
                  />
                  <span>
                    Exibir data do depoimento (
                    <span className="text-slate-500">{dateFormatted}</span>)
                  </span>
                </label>
              </div>

              {/* Card Resumo do Depoimento */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <p className="font-semibold text-slate-800">
                  {clientName}
                  {childName && (
                    <span className="text-slate-500 font-normal ml-1">
                      (Bebê: {childName})
                    </span>
                  )}
                </p>
                <p className="text-slate-600 line-clamp-2 italic">
                  "{comment}"
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Publicar & Compartilhar
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* WhatsApp */}
                <Button
                  type="button"
                  onClick={handleShareWhatsApp}
                  disabled={isGenerating}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold gap-2 w-full h-10 shadow-xs cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-label="WhatsApp"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z" />
                  </svg>
                  Compartilhar no WhatsApp
                </Button>

                {/* Instagram */}
                <Button
                  type="button"
                  onClick={handleShareInstagram}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white text-xs font-semibold gap-2 w-full h-10 shadow-xs cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-label="Instagram"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Compartilhar no Instagram
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Baixar Imagem */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300 w-full h-10 gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#ae4d30]" />
                  Salvar Imagem (Story PNG)
                </Button>

                {/* Copiar Imagem */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyImage}
                  disabled={isGenerating}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300 w-full h-10 gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Imagem Copiada!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      Copiar Imagem
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
