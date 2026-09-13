"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bloqueia o scroll enquanto carrega
    document.body.style.overflow = "hidden";

    // Segura a tela por 1 segundo — suficiente para fontes e LCP não ficarem ocultos muito tempo
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fbf9f5]"
        >
          {/* Logo — sem animação de entrada para não bloquear LCP */}
          <div className="relative flex flex-col items-center">
            <Image
              src="/assets/logo-vita-baby.png"
              alt="Vita Baby Assessoria"
              width={604}
              height={151}
              priority
              fetchPriority="high"
              className="h-[3.25rem] md:h-[4.25rem] w-auto object-contain"
              style={{ width: "auto" }}
            />

            <motion.div className="w-[120px] h-[2px] bg-[#d19a7e]/20 mt-[2rem] rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#d19a7e]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
