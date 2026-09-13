"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-[2rem] right-[2rem] z-50 w-[3.5rem] h-[3.5rem] rounded-full bg-[#af4d30] hover:bg-[#af4d30]/90 text-white shadow-xl flex items-center justify-center p-0 transition-all duration-300 animate-in fade-in zoom-in"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-6 h-6" />
    </Button>
  );
}
