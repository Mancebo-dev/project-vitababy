"use client";

import type { ScheduleSlot } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  BookingFormData,
  ExtendedProfessional,
  ExtendedService,
} from "./types";

const StepService = dynamic(() =>
  import("./StepService").then((mod) => mod.StepService),
);
const StepProfessional = dynamic(() =>
  import("./StepProfessional").then((mod) => mod.StepProfessional),
);
const StepDateTime = dynamic(() =>
  import("./StepDateTime").then((mod) => mod.StepDateTime),
);
const StepClientInfo = dynamic(() =>
  import("./StepClientInfo").then((mod) => mod.StepClientInfo),
);
const StepConfirmation = dynamic(() =>
  import("./StepConfirmation").then((mod) => mod.StepConfirmation),
);

const STEPS = [
  { id: 1, label: "Serviço" },
  { id: 2, label: "Profissional" },
  { id: 3, label: "Datas e Horários" },
  { id: 4, label: "Seus Dados" },
  { id: 5, label: "Confirmação" },
];

export function BookingWizard({
  services,
  professionals,
  availableSlots,
}: {
  services: ExtendedService[];
  professionals: ExtendedProfessional[];
  availableSlots: ScheduleSlot[];
}) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("servico");

  // Initial form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceIds: [services[0]?.id || ""].filter(Boolean),
    professionalId: professionals[0]?.id || "",
    dates: [
      {
        date: "",
        time: "",
      },
    ],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientCpf: "",
    clientZipCode: "",
    clientAddress: "",
    additionalInfo: "",
    requiresCompanion: false,
    acceptTerms: true,
  });

  // Pre-select service from URL query param if present
  useEffect(() => {
    if (serviceParam) {
      const match = services.find(
        (s) =>
          s.id.toLowerCase() === serviceParam.toLowerCase() ||
          s.name.toLowerCase().includes(serviceParam.toLowerCase()),
      );
      if (match) {
        setFormData((prev) => ({ ...prev, serviceIds: [match.id] }));
      }
    }
  }, [serviceParam, services]);

  const handleFieldChange = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      serviceIds: [services[0]?.id || ""].filter(Boolean),
      professionalId: professionals[0]?.id || "",
      dates: [{ date: "", time: "" }],
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientCpf: "",
      clientZipCode: "",
      clientAddress: "",
      additionalInfo: "",
      requiresCompanion: false,
      acceptTerms: true,
    });
  }, [services, professionals]);

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {/* Stepper Header */}
      <div className="mb-[1.5rem] shrink-0 w-full">
        <div className="flex gap-[0.5rem] w-full mb-[0.75rem]">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isCompleted && !isCurrent}
                onClick={() => {
                  if (isCompleted) setCurrentStep(step.id);
                }}
                className={`h-[6px] rounded-full flex-1 overflow-hidden transition-colors ${
                  isCompleted ? "cursor-pointer" : "cursor-default"
                } ${isCompleted || isCurrent ? "bg-[#af4d30]/20" : "bg-[#e4e2de]"}`}
              >
                <div
                  className="h-full bg-[#af4d30] transition-all duration-500 ease-out"
                  style={{ width: isCompleted || isCurrent ? "100%" : "0%" }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-[#af4d30] font-bold text-[0.8125rem] uppercase tracking-wider">
            Passo {currentStep} de {STEPS.length}
          </span>
          <span className="text-[#411f03] font-bold text-[0.9375rem]">
            {STEPS.find((s) => s.id === currentStep)?.label}
          </span>
        </div>
      </div>

      {/* Step Content with Animated Transitions */}
      <div className="flex flex-col min-h-0 relative max-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-h-full flex flex-col min-h-0"
          >
            {currentStep === 1 && (
              <StepService
                services={services}
                selectedServiceIds={formData.serviceIds}
                onSelectService={(ids) => handleFieldChange("serviceIds", ids)}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <StepProfessional
                professionals={professionals}
                selectedProfessionalId={formData.professionalId}
                onSelectProfessional={(id) =>
                  handleFieldChange("professionalId", id)
                }
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <StepDateTime
                availableSlots={availableSlots}
                professionalId={formData.professionalId}
                dates={formData.dates}
                onChangeDates={(dates) => handleFieldChange("dates", dates)}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <StepClientInfo
                formData={formData}
                onChangeField={handleFieldChange}
                onNext={() => setCurrentStep(5)}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <StepConfirmation
                services={services}
                professionals={professionals}
                formData={formData}
                onBack={() => setCurrentStep(4)}
                onReset={handleReset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
