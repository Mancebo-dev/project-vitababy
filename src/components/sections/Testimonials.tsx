import type { Client, Review } from "@prisma/client";
import Image from "next/image";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { StaggerItem } from "@/components/ui/StaggerItem";

type ReviewWithClient = Review & { client: Client };

interface TestimonialItem {
  id: string;
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 bg-white border border-[#e4e2de] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[210px] select-none hover:border-[#d19a7e] transition-colors">
      <div>
        <div className="flex gap-1 mb-2.5">
          {[1, 2, 3, 4, 5]
            .slice(0, Math.min(5, Math.max(1, item.rating || 5)))
            .map((star) => (
              <Image
                key={star}
                src="/assets/259059d849cd8bc63982bb72948c5259a5fe0521.svg"
                width={14}
                height={14}
                alt="star"
                loading="lazy"
                className="w-3.5 h-3.5 object-contain shrink-0"
              />
            ))}
        </div>
        <p className="text-[#444840] text-xs sm:text-[0.875rem] italic leading-relaxed line-clamp-3">
          {item.text}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-[#f0ede8]">
        <div className="w-9 h-9 rounded-full bg-[#f2ede9] text-[#411f03] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
          {item.avatar}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs sm:text-sm text-[#411f03] truncate">
            {item.name}
          </span>
          <span className="text-[11px] text-[#7d7a75] truncate">
            {item.role}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({
  initialReviews = [],
}: {
  initialReviews?: ReviewWithClient[];
}) {
  if (initialReviews.length === 0) {
    return null;
  }

  const testimonials: TestimonialItem[] = initialReviews.map((r) => ({
    id: r.id,
    text: `"${r.comment}"`,
    name: r.client.name,
    role: r.client.childName
      ? `Mãe/Pai do(a) ${r.client.childName}`
      : "Cliente Vita Baby",
    avatar: r.client.name.charAt(0).toUpperCase(),
    rating: r.rating,
  }));

  // Divide testimonials into 2 rows for bidirectional infinite marquee
  const row1Raw = testimonials.filter((_, idx) => idx % 2 === 0);
  const row2Raw = testimonials.filter((_, idx) => idx % 2 !== 0);

  // If a row is small, pad it so marquee seamlessly fills viewport
  const ensureMinItems = (arr: TestimonialItem[], min = 4) => {
    let result = [...arr];
    if (result.length === 0) result = [...testimonials];
    while (result.length < min) {
      result = [...result, ...arr];
    }
    return result;
  };

  const row1 = ensureMinItems(row1Raw);
  const row2 = ensureMinItems(row2Raw.length > 0 ? row2Raw : row1Raw);

  return (
    <section
      id="depoimentos"
      className="py-16 md:py-24 lg:py-28 min-h-[85vh] lg:min-h-screen bg-[#fbf9f5] overflow-hidden relative flex flex-col justify-center"
    >
      {/* Side gradient masks for smooth fade edge */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-28 bg-gradient-to-r from-[#fbf9f5] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-28 bg-gradient-to-l from-[#fbf9f5] to-transparent z-10" />

      <div className="w-full max-w-[1440px] mx-auto px-[1.5rem] lg:px-[7.5rem] text-center mb-8 sm:mb-12">
        <StaggerContainer className="flex flex-col items-center">
          <StaggerItem>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-[#411f03] leading-tight tracking-tight">
              Histórias de Amor, Cuidado e Dedicação
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xs sm:text-sm md:text-base text-[#5c5954] max-w-xl mx-auto mt-2 leading-relaxed">
              O carinho e a confiança de centenas de famílias que transformaram
              sua experiência da maternidade conosco.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Marquee Row 1 (moving left) */}
      <div className="w-full overflow-hidden mb-4 sm:mb-5">
        <div className="animate-marquee-left flex gap-4 sm:gap-6">
          {row1.map((item, idx) => (
            <TestimonialCard key={`r1-a-${item.id}-${idx}`} item={item} />
          ))}
          {row1.map((item, idx) => (
            <TestimonialCard key={`r1-b-${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (moving right in reverse direction) */}
      <div className="w-full overflow-hidden">
        <div className="animate-marquee-right flex gap-4 sm:gap-6">
          {row2.map((item, idx) => (
            <TestimonialCard key={`r2-a-${item.id}-${idx}`} item={item} />
          ))}
          {row2.map((item, idx) => (
            <TestimonialCard key={`r2-b-${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
