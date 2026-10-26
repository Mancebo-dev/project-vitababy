"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Check,
  ChevronRight,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Package,
  Search,
  Sparkles,
  SunMedium,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { buildWhatsAppLink, VITA_BABY_WHATSAPP } from "@/utils/whatsapp";
import type { ServiceWithPackages } from "./Services";

function getServiceVisuals(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("amamenta")) {
    return {
      icon: (
        <Image
          src="/assets/46c592fdfb9c662b651317aeee2ba4b73bd5e2d7.svg"
          width={24}
          height={24}
          alt="Ícone Amamentação"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
    };
  }

  if (lower.includes("banho")) {
    return {
      icon: (
        <Image
          src="/assets/104e86cb37a567122753226d314286dead80a322.svg"
          width={24}
          height={24}
          alt="Ícone Banho Humanizado"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20 text-[#5f6f52]",
    };
  }

  if (lower.includes("socorro") || lower.includes("emergênc")) {
    return {
      icon: <HeartPulse className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#ae4d30]/15 text-[#ae4d30]",
    };
  }

  if (lower.includes("pós-parto") || lower.includes("assistência")) {
    return {
      icon: (
        <Image
          src="/assets/825b3088019920de508671e802e75260d01592df.svg"
          width={24}
          height={24}
          alt="Ícone Assistência Especializada"
          loading="lazy"
          className="w-6 h-6 object-contain"
          style={{ width: 24, height: 24 }}
        />
      ),
      iconBg: "bg-[#5f6f52]/20 text-[#5f6f52]",
    };
  }

  if (
    lower.includes("lóbulo") ||
    lower.includes("furinho") ||
    lower.includes("brinco")
  ) {
    return {
      icon: <Sparkles className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
    };
  }

  if (lower.includes("laser") || lower.includes("cicatriza")) {
    return {
      icon: <SunMedium className="w-6 h-6 text-[#ae4d30]" />,
      iconBg: "bg-[#ae4d30]/15 text-[#ae4d30]",
    };
  }

  if (lower.includes("integral") || lower.includes("premium")) {
    return {
      icon: <Award className="w-6 h-6 text-[#411f03]" />,
      iconBg: "bg-[#411f03]/10 text-[#411f03]",
    };
  }

  return {
    icon: <HeartHandshake className="w-6 h-6 text-[#ae4d30]" />,
    iconBg: "bg-[#d19a7e]/20 text-[#ae4d30]",
  };
}

function formatPriceAndOptions(service: ServiceWithPackages) {
  const pkgs = service.packages || [];
  const count = pkgs.length;
  const options =
    count === 1 ? "1 opção" : count > 1 ? `${count} opções` : "Sob consulta";

  const validPrices = pkgs
    .map((p) => p.price)
    .filter((pr): pr is number => typeof pr === "number" && pr > 0);

  let price = "Consulte opções";
  if (validPrices.length > 0) {
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    if (minPrice === maxPrice || validPrices.length === 1) {
      price = `R$ ${minPrice.toLocaleString("pt-BR")}`;
    } else {
      price = `a partir de R$ ${minPrice.toLocaleString("pt-BR")}`;
    }
  }

  return { options, price };
}

export function ServicesAndPricing({
  initialServices = [],
}: {
  initialServices?: ServiceWithPackages[];
}) {
  const [activeTab, setActiveTab] = useState<"services" | "plans">("services");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab with URL hash if navigated via Navbar anchor
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#planos") {
        setActiveTab("plans");
      } else if (window.location.hash === "#servicos") {
        setActiveTab("services");
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  if (initialServices.length === 0) {
    return null;
  }

  // Curated list of all services
  const allServices = initialServices.map((service) => {
    const visuals = getServiceVisuals(service.name);
    const pricing = formatPriceAndOptions(service);
    return {
      ...service,
      ...visuals,
      ...pricing,
    };
  });

  // Highlighted packages across services for the Plans tab
  const allPackages = initialServices.flatMap((s) =>
    (s.packages || []).map((p) => ({
      ...p,
      serviceName: s.name,
    })),
  );

  // Take top 3 services for compact section view
  const topServices = allServices.slice(0, 3);

  // Take top 3 plans (prioritizing isHighlighted)
  const topPlans = [...allPackages]
    .sort((a, b) => (b.isHighlighted ? 1 : 0) - (a.isHighlighted ? 1 : 0))
    .slice(0, 3);

  // Filtered lists for the full catalog modal
  const filteredServices = allServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPackages = allPackages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section
      id="servicos"
      className="relative py-16 md:py-24 lg:py-28 min-h-[85vh] lg:min-h-screen bg-[#f5f3ef] border-y border-[#e4e2de] flex flex-col justify-center"
    >
      {/* Anchor for planos link */}
      <div id="planos" className="absolute top-0 -mt-24 pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem]">
        {/* Header Section */}
        <StaggerContainer className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-8 md:mb-12">
          <StaggerItem>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-[#411f03] leading-tight tracking-tight">
              Serviços e Planos para sua Família
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xs sm:text-sm md:text-base text-[#5c5954] max-w-xl mx-auto leading-relaxed">
              Soluções completas, acolhedoras e personalizadas para tornar sua
              jornada materna mais leve, segura e confiante.
            </p>
          </StaggerItem>

          {/* Tab Switcher Segmented Control */}
          <StaggerItem>
            <div className="inline-flex items-center p-1 bg-white rounded-full border border-[#e4e2de] shadow-xs mt-2">
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                  activeTab === "services"
                    ? "bg-[#af4d30] text-white shadow-xs"
                    : "text-[#444840] hover:text-[#411f03]"
                }`}
              >
                Serviços em Destaque
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("plans")}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                  activeTab === "plans"
                    ? "bg-[#af4d30] text-white shadow-xs"
                    : "text-[#444840] hover:text-[#411f03]"
                }`}
              >
                Planos & Pacotes
              </button>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Content Tabs with Smooth Transition */}
        <AnimatePresence mode="wait">
          {activeTab === "services" ? (
            <motion.div
              key="services-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
            >
              {topServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col bg-white border border-[#e4e2de] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${service.iconBg}`}
                  >
                    {service.icon}
                  </div>

                  <div className="flex items-center gap-2 mb-2 w-full">
                    <h3 className="text-lg font-bold text-[#411f03] leading-snug">
                      {service.name}
                    </h3>
                    <span className="bg-[#d19a7e]/20 text-[#af4d30] text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">
                      {service.options}
                    </span>
                  </div>

                  <p className="text-[#444840] text-xs md:text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {service.description ||
                      "Cuidado humanizado e acolhimento especializado para você e seu bebê."}
                  </p>

                  <div className="pt-3 border-t border-[#e4e2de] flex items-center justify-between mt-auto gap-2">
                    <span className="text-[#af4d30] font-bold text-xs md:text-sm">
                      {service.price}
                    </span>
                    <a
                      href={buildWhatsAppLink(
                        VITA_BABY_WHATSAPP,
                        `Olá! Gostaria de saber mais sobre o serviço "${service.name}" da Vita Baby.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3 py-1.5 rounded-full transition-all min-h-[36px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="plans-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
            >
              {topPlans.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col bg-white rounded-2xl p-6 border transition-all ${
                    pkg.isHighlighted
                      ? "border-[#af4d30] shadow-md scale-[1.01]"
                      : "border-[#e4e2de] shadow-xs hover:shadow-md"
                  }`}
                >
                  {pkg.isHighlighted && (
                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#af4d30] text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full">
                      Mais Escolhido
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-[#af4d30] block uppercase tracking-wider mb-1">
                      {pkg.serviceName}
                    </span>
                    <h3 className="text-lg font-bold text-[#411f03]">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#7d7a75] mt-1 line-clamp-2">
                      {pkg.description || `Plano completo de ${pkg.name}`}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-heading text-[#411f03]">
                        R${" "}
                        {pkg.price
                          ? pkg.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })
                          : "Consulte"}
                      </span>
                      {pkg.billingCycle && (
                        <span className="text-xs text-[#7d7a75]">
                          / {pkg.billingCycle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mb-5">
                    {pkg.features && (
                      <ul className="space-y-2">
                        {pkg.features
                          .split("\n")
                          .filter((f) => f.trim())
                          .slice(0, 3)
                          .map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-xs text-[#444840]"
                            >
                              <Check className="w-3.5 h-3.5 text-[#af4d30] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  <a
                    href={buildWhatsAppLink(
                      VITA_BABY_WHATSAPP,
                      `Olá! Gostaria de saber mais sobre o plano "${pkg.name}" (${pkg.serviceName}) da Vita Baby.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-colors mt-auto flex items-center justify-center gap-2 min-h-[44px] ${
                      pkg.isHighlighted
                        ? "bg-[#25D366] text-white hover:bg-[#20b859]"
                        : "bg-[#f5f3ef] text-[#411f03] hover:bg-[#e4e2de]"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                    <span>Contratar no WhatsApp</span>
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action: Open Full Catalog Modal */}
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="w-full sm:w-auto rounded-full px-6 h-11 sm:h-12 bg-white hover:bg-[#fbf9f5] text-[#411f03] border border-[#e4e2de] shadow-xs font-semibold text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Package className="w-4 h-4 text-[#af4d30]" />
            <span>Ver Catálogo Completo com Todos os Serviços e Planos</span>
            <ChevronRight className="w-4 h-4 text-[#7d7a75]" />
          </Button>
        </div>
      </div>

      {/* Catalog Dialog Modal */}
      <Dialog open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
        <DialogContent className="max-w-4xl max-h-[90dvh] flex flex-col p-0 overflow-hidden bg-white rounded-2xl">
          <DialogHeader className="p-4 sm:p-6 border-b border-[#e4e2de] bg-[#fbf9f5] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold font-heading text-[#411f03]">
                  Catálogo Completo Vita Baby
                </DialogTitle>
                <p className="text-xs text-[#7d7a75] mt-1">
                  Confira todos os serviços, pacotes e valores sob medida para
                  seu momento.
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="w-4 h-4 text-[#7d7a75] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise por serviço (ex: amamentação, laser, pós-parto)..."
                className="pl-9 bg-white border-[#e4e2de] text-xs md:text-sm h-10 rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </DialogHeader>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#af4d30] mb-3 flex items-center gap-2">
                <span>Serviços Disponíveis ({filteredServices.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl border border-[#e4e2de] bg-[#fbf9f5]/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-sm text-[#411f03]">
                          {service.name}
                        </span>
                        <span className="text-[10px] bg-[#d19a7e]/20 text-[#af4d30] px-2 py-0.5 rounded-full ml-auto">
                          {service.options}
                        </span>
                      </div>
                      <p className="text-xs text-[#444840] leading-relaxed mb-3">
                        {service.description ||
                          "Apoio especializado e acolhedor para a mãe e o recém-nascido."}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#e4e2de] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#af4d30]">
                        {service.price}
                      </span>
                      <a
                        href={buildWhatsAppLink(
                          VITA_BABY_WHATSAPP,
                          `Olá! Gostaria de agendar o serviço "${service.name}".`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200/50"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        Agendar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#af4d30] mb-3">
                <span>
                  Planos & Pacotes Detalhados ({filteredPackages.length})
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-xl border border-[#e4e2de] bg-white flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#af4d30] uppercase block">
                        {pkg.serviceName}
                      </span>
                      <h5 className="font-bold text-sm text-[#411f03] mt-0.5">
                        {pkg.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1">
                        {pkg.description || "Atendimento completo e humanizado"}
                      </p>

                      {pkg.features && (
                        <div className="mt-2 space-y-1">
                          {pkg.features
                            .split("\n")
                            .filter((f) => f.trim())
                            .slice(0, 3)
                            .map((f) => (
                              <div
                                key={f}
                                className="flex items-center gap-1.5 text-[11px] text-[#444840]"
                              >
                                <Check className="w-3 h-3 text-[#af4d30] shrink-0" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#e4e2de] mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#411f03]">
                        R${" "}
                        {pkg.price
                          ? pkg.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })
                          : "Consulte"}
                      </span>
                      <a
                        href={buildWhatsAppLink(
                          VITA_BABY_WHATSAPP,
                          `Olá! Gostaria de contratar o plano "${pkg.name}" (${pkg.serviceName}).`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20b859] px-3 py-1.5 rounded-full shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
