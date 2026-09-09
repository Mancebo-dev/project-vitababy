"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function CustomSelect({
  id,
  options,
  placeholder = "Selecione uma opção...",
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: Option) {
    setSelected(option);
    setOpen(false);
    onChange?.(option.value);
  }

  return (
    <div ref={ref} className="relative w-full" id={id}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-[#fbf9f5] border border-[#e4e2de] rounded-lg px-[1rem] py-[0.75rem] text-[0.9375rem] text-[#444840] outline-none focus:border-[#d19a7e] transition-colors cursor-pointer"
      >
        <span className={selected ? "text-[#444840]" : "text-[#444840]/50"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#444840]/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown — renderizado no fluxo, mas posicionado com absolute para não empurrar elementos */}
      {open && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#e4e2de] rounded-lg shadow-xl overflow-hidden">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-[1rem] py-[0.75rem] text-[0.9375rem] text-[#444840] hover:bg-[#f5f3ef] transition-colors"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
