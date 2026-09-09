"use client";

import { Check, Clock, Sparkles } from "lucide-react";
import { SERVICES } from "./data";
import type { ServiceItem } from "./types";

interface StepServiceProps {
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  onNext: () => void;
}

export function StepService({
  selectedServiceId,
  onSelectService,
  onNext,
}: StepServiceProps) {
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId);

  return (
    <div className="flex flex-col gap-[2rem]">
      <div>
        <span className="text-[#af4d30] font-semibold text-[0.875rem] uppercase tracking-wider">
          Passo 1 de 5
        </span>
        <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-heading font-bold text-[#411f03] mt-[0.25rem]">
          Qual serviço você gostaria de agendar?
        </h2>
        <p className="text-[#444840] text-[0.9375rem] mt-[0.25rem]">
          Selecione o cuidado ideal para o momento atual da sua família. Você
          poderá tirar dúvidas e alinhar detalhes com a profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.25rem]">
        {SERVICES.map((service: ServiceItem) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={`text-left p-[1.5rem] rounded-2xl border-2 transition-all relative flex flex-col justify-between gap-[1rem] ${
                isSelected
                  ? "border-[#af4d30] bg-[#fdf9f7] shadow-md ring-2 ring-[#af4d30]/20"
                  : "border-[#e4e2de] bg-white hover:border-[#d19a7e] hover:shadow-sm"
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
                        ? "border-[#af4d30] bg-[#af4d30] text-white"
                        : "border-[#d1cece] bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <h3 className="font-heading font-bold text-[1.125rem] text-[#411f03] pr-[5rem]">
                    {service.title}
                  </h3>
                </div>

                <p className="text-[#444840] text-[0.875rem] leading-[1.5] mb-[0.75rem]">
                  {service.description}
                </p>
              </div>

              <div className="pt-[1rem] border-t border-[#f0eee9] flex items-center justify-between text-[0.8125rem] text-[#444840]">
                <div className="flex items-center gap-[0.375rem]">
                  <Clock className="w-4 h-4 text-[#af4d30]" />
                  <span>Duração: {service.duration}</span>
                </div>
                <div className="font-bold text-[#411f03] text-[0.9375rem]">
                  {service.price}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mt-[1rem]">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedServiceId}
          className="rounded-full px-[2rem] h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-[0.9375rem]"
        >
          {selectedService
            ? "Continuar para Escolha da Profissional"
            : "Selecione um serviço"}
        </button>
      </div>
    </div>
  );
}
