"use client";

import type { Partner } from "@prisma/client";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
);

export function PartnersCarousel({ partners }: { partners: Partner[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Scroll controls (desktop) */}
      <div className="hidden md:flex justify-end items-center gap-2 mb-4 px-[1.5rem] lg:px-[7.5rem] max-w-[1440px] mx-auto">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Rolar para esquerda"
          className="w-10 h-10 rounded-full border border-[#e4e2de] bg-white hover:bg-[#f5f3ef] text-[#411f03] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Rolar para direita"
          className="w-10 h-10 rounded-full border border-[#e4e2de] bg-white hover:bg-[#f5f3ef] text-[#411f03] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Carousel Snap Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[1.5rem] lg:px-[7.5rem] max-w-[1440px] mx-auto py-2 no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex-shrink-0 w-[240px] sm:w-[270px] md:w-[290px] snap-center bg-white border border-[#e4e2de] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
          >
            {/* Instagram Style Header */}
            <div className="flex items-center gap-2.5 p-3.5 border-b border-[#f0ede8] bg-[#fbf9f5]">
              <div className="w-8 h-8 rounded-full bg-[#af4d30]/10 text-[#af4d30] flex items-center justify-center font-bold text-xs ring-2 ring-[#af4d30]/20">
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#411f03] truncate">
                  {partner.name}
                </p>
                <span className="text-[10px] text-[#af4d30] font-semibold tracking-wide">
                  Parceiro Oficial
                </span>
              </div>
              <InstagramIcon className="w-4 h-4 text-[#d19a7e] shrink-0" />
            </div>

            {/* Poster / Banner Image (Aspect 4:5 Instagram Post style) */}
            <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden">
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 260px, (max-width: 768px) 290px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-medium line-clamp-2">
                  {partner.name}
                </span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3 bg-white border-t border-[#f0ede8] mt-auto">
              <a
                href={
                  partner.link ||
                  "https://www.instagram.com/vitababyassessoria/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#f5f3ef] hover:bg-[#af4d30] text-[#411f03] hover:text-white text-xs font-semibold transition-all min-h-[44px]"
              >
                <span>Ver Publicação</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
