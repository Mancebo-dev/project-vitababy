"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PROFESSIONALS, SERVICES } from "./data";
import type { BookingFormData } from "./types";

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

export function BookingWizard() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("servico");

  // Initial form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: SERVICES[0]?.id || "",
    professionalId: PROFESSIONALS[0]?.id || "",
    dates: [
      {
        date: "",
        time: "",
      },
    ],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPassword: "",
    clientPasswordConfirm: "",
    additionalInfo: "",
    acceptTerms: true,
  });

  // Pre-select service from URL query param if present
  useEffect(() => {
    if (serviceParam) {
      const match = SERVICES.find(
        (s) =>
          s.id.toLowerCase() === serviceParam.toLowerCase() ||
          s.title.toLowerCase().includes(serviceParam.toLowerCase()),
      );
      if (match) {
        setFormData((prev) => ({ ...prev, serviceId: match.id }));
      }
    }
  }, [serviceParam]);

  const handleFieldChange = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      serviceId: SERVICES[0]?.id || "",
      professionalId: PROFESSIONALS[0]?.id || "",
      dates: [{ date: "", time: "" }],
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientPassword: "",
      clientPasswordConfirm: "",
      additionalInfo: "",
      acceptTerms: true,
    });
  }, []);

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {/* Stepper Header */}
      <div className="mb-[3rem]">
        <div className="flex items-center justify-between relative">
          {/* Background progress bar line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e4e2de] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-[#af4d30] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center"
              >
                <button
                  type="button"
                  disabled={!isCompleted && !isCurrent}
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.id);
                  }}
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-[0.875rem] md:text-[1rem] transition-all shadow-sm ${
                    isCompleted
                      ? "bg-[#af4d30] text-white cursor-pointer hover:bg-[#99473b]"
                      : isCurrent
                        ? "bg-[#411f03] text-white ring-4 ring-[#af4d30]/20 scale-105"
                        : "bg-white border-2 border-[#e4e2de] text-[#a8a5a0] cursor-not-allowed"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                  ) : (
                    step.id
                  )}
                </button>

                <span
                  className={`text-[0.6875rem] md:text-[0.8125rem] font-semibold mt-2 hidden sm:block whitespace-nowrap ${
                    isCurrent
                      ? "text-[#411f03] font-bold"
                      : isCompleted
                        ? "text-[#af4d30]"
                        : "text-[#a8a5a0]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content with Animated Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {currentStep === 1 && (
            <StepService
              selectedServiceId={formData.serviceId}
              onSelectService={(id) => handleFieldChange("serviceId", id)}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <StepProfessional
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
              formData={formData}
              onBack={() => setCurrentStep(4)}
              onReset={handleReset}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
