"use client";

import { Check, ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import { PROFESSIONALS } from "./data";
import type { ProfessionalItem } from "./types";

interface StepProfessionalProps {
  selectedProfessionalId: string;
  onSelectProfessional: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepProfessional({
  selectedProfessionalId,
  onSelectProfessional,
  onNext,
  onBack,
}: StepProfessionalProps) {
  return (
    <div className="flex flex-col gap-[2rem]">
      <div>
        <span className="text-[#af4d30] font-semibold text-[0.875rem] uppercase tracking-wider">
          Passo 2 de 5
        </span>
        <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-heading font-bold text-[#411f03] mt-[0.25rem]">
          Com quem você deseja realizar o atendimento?
        </h2>
        <p className="text-[#444840] text-[0.9375rem] mt-[0.25rem]">
          Todas as nossas especialistas possuem formação obstétrica/neonatal e
          aplicam o método humanizado exclusivo Vitababy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
        {PROFESSIONALS.map((prof: ProfessionalItem) => {
          const isSelected = selectedProfessionalId === prof.id;
          return (
            <button
              key={prof.id}
              type="button"
              onClick={() => onSelectProfessional(prof.id)}
              className={`text-left p-[1.5rem] rounded-2xl border-2 transition-all relative flex flex-col justify-between gap-[1.25rem] ${
                isSelected
                  ? "border-[#af4d30] bg-[#fdf9f7] shadow-md ring-2 ring-[#af4d30]/20"
                  : "border-[#e4e2de] bg-white hover:border-[#d19a7e] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-[1rem] w-full">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d19a7e] shrink-0 bg-[#fbf9f5]">
                  <Image
                    src={prof.avatarUrl}
                    alt={prof.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-[1.125rem] text-[#411f03]">
                      {prof.name}
                    </h3>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? "border-[#af4d30] bg-[#af4d30] text-white"
                          : "border-[#d1cece] bg-transparent"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <p className="text-[#af4d30] text-[0.8125rem] font-medium">
                    {prof.role}
                  </p>
                  <p className="text-[#7d7a75] text-[0.75rem]">
                    {prof.crnOrCoren}
                  </p>

                  <div className="flex items-center gap-[0.25rem] mt-[0.375rem] text-[0.8125rem] text-[#444840]">
                    <div className="flex text-[#eab308]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold">{prof.rating.toFixed(1)}</span>
                    <span className="text-[#7d7a75]">
                      ({prof.reviewCount} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#444840] text-[0.875rem] leading-[1.5] line-clamp-3">
                {prof.bio}
              </p>

              <div className="pt-[1rem] border-t border-[#f0eee9] w-full">
                <div className="flex flex-wrap gap-[0.375rem]">
                  {prof.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="bg-[#f2ede9] text-[#411f03] text-[0.6875rem] font-medium px-[0.5rem] py-[0.25rem] rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-[1rem]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-[0.5rem] text-[#411f03] hover:text-[#af4d30] font-medium text-[0.9375rem] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Serviços
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selectedProfessionalId}
          className="rounded-full px-[2rem] h-[3.25rem] bg-[#af4d30] hover:bg-[#af4d30]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-[0.9375rem]"
        >
          Continuar para Datas e Horários
        </button>
      </div>
    </div>
  );
}
