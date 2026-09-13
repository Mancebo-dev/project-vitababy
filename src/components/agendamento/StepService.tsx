"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ExtendedService } from "./types";

interface StepServiceProps {
  services: ExtendedService[];
  selectedServiceIds: string[];
  onSelectService: (serviceIds: string[]) => void;
  onNext: () => void;
}

export function StepService({
  services,
  selectedServiceIds,
  onSelectService,
  onNext,
}: StepServiceProps) {
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      onSelectService(selectedServiceIds.filter((sId) => sId !== id));
    } else {
      onSelectService([...selectedServiceIds, id]);
    }
  };

  return (
    <div className="flex flex-col gap-[1rem] max-h-full">
      <div className="shrink-0 text-center md:text-left mb-2">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-heading font-bold text-[#411f03]">
          Qual serviço você gostaria de agendar?
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {services.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);

            return (
              <button
                type="button"
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`w-full text-left relative bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-300 flex flex-col h-full hover:shadow-md hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#af4d30] ring-1 ring-[#af4d30]"
                    : "border-[#e4e2de]"
                }`}
              >
                {service.popular && (
                  <span className="absolute top-[1rem] right-[1rem] bg-[#d19a7e]/20 text-[#af4d30] text-[0.6875rem] font-bold px-[0.625rem] py-[0.25rem] rounded-full flex items-center gap-[0.25rem]">
                    <Sparkles className="w-3 h-3" /> Mais Procurado
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-[0.75rem] mb-[0.5rem]">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#af4d30] border-[#af4d30] text-white"
                          : "border-[#d1d5db]"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <h3 className="font-bold text-[#411f03] text-base">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-[#ae4d30] text-sm font-semibold mt-1">
                    {service.duration
                      ? `${service.duration} minutos`
                      : "Duração flexível"}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-[#f5f5f5]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#411f03] text-base sm:text-lg">
                      {service.price
                        ? `a partir de ${new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(service.price)}`
                        : "Consulte opções"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-[1.5rem] shrink-0 border-t border-[#e4e2de] mt-[1rem]">
        <Link
          href="/"
          className="text-[#7d7a75] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          Cancelar Agendamento
        </Link>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedServiceIds.length === 0}
          className="rounded-full px-[2rem] h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-[0.9375rem]"
        >
          {selectedServiceIds.length > 0
            ? "Continuar para Escolha da Profissional"
            : "Selecione ao menos um serviço"}
        </button>
      </div>
    </div>
  );
}
