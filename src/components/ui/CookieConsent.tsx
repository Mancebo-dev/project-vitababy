"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou antes
    const consent = localStorage.getItem("vitababy_cookie_consent");
    if (!consent) {
      // Pequeno delay para não assustar no primeiro load
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vitababy_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("vitababy_cookie_consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 w-full z-50 p-[1rem]"
        >
          <div className="max-w-[1200px] mx-auto bg-white border border-[#e4e2de] shadow-2xl rounded-2xl p-[1.5rem] md:p-[2rem] flex flex-col md:flex-row items-center justify-between gap-[1.5rem]">
            <div className="flex-1">
              <h3 className="font-heading font-bold text-[#411f03] text-[1.125rem] mb-[0.5rem]">
                Nós valorizamos sua privacidade
              </h3>
              <p className="text-[#444840] text-[0.875rem] leading-[1.6]">
                Utilizamos cookies essenciais para o funcionamento do site e
                para melhorar sua experiência. Ao continuar navegando, você
                concorda com a nossa{" "}
                <Link
                  href="/politica-de-privacidade"
                  className="text-[#af4d30] hover:underline font-semibold"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>

            <div className="flex items-center gap-[1rem] w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 md:flex-none border-[#411f03] text-[#411f03] hover:bg-[#411f03]/10"
              >
                Recusar
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-[#af4d30] hover:bg-[#af4d30]/90 text-white shadow-lg"
              >
                Aceitar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
