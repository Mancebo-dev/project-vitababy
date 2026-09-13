"use client";

import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "w-full",
        month_caption: "flex justify-center items-center w-full mb-4 pt-1",
        caption_label: "text-xl font-bold text-slate-900",
        nav: "flex items-center justify-center absolute w-full top-4 gap-[200px] pointer-events-none z-10",
        button_previous:
          "h-8 w-8 bg-slate-100/50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors pointer-events-auto",
        button_next:
          "h-8 w-8 bg-slate-100/50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors pointer-events-auto",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full mb-2",
        weekday:
          "text-[#ae4d30] font-bold text-xs uppercase w-full text-center",
        week: "flex w-full mt-2",
        day: "h-10 w-full text-center text-sm p-0 relative",
        day_button: cn(
          "h-10 w-10 mx-auto rounded-xl p-0 font-medium text-slate-700 hover:bg-[#ae4d30]/20 hover:text-[#ae4d30] flex items-center justify-center transition-all duration-200",
        ),
        selected:
          "bg-[#ae4d30] !text-white hover:bg-[#8b3d26] shadow-md font-bold scale-105",
        today:
          "text-[#ae4d30] font-bold bg-[#ae4d30]/10 border border-[#ae4d30]/30",
        outside: "text-slate-300 opacity-40",
        disabled:
          "text-slate-300 opacity-40 hover:bg-transparent hover:text-slate-300 cursor-not-allowed",
        range_middle: "bg-slate-100 text-slate-900",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          ...props
        }: React.ComponentProps<"svg"> & {
          orientation?: "left" | "right" | "up" | "down";
        }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
