"use client";

import type { Professional } from "@prisma/client";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MonthGrid } from "./MonthGrid";
import { PlannerModal } from "./PlannerModal";
import { TimeGrid } from "./TimeGrid";

export type AgendaEvent = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  date: Date;
  startTime: string | null;
  endTime: string | null;
  color: string;
};

type ViewMode = "1d" | "3d" | "7d" | "14d" | "month";

export function Planner({
  initialItems,
  professionals,
}: {
  initialItems: AgendaEvent[];
  professionals: Professional[];
}) {
  const [view, setView] = useState<ViewMode>("7d");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    switch (view) {
      case "1d":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "3d":
        setCurrentDate(subDays(currentDate, 3));
        break;
      case "7d":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "14d":
        setCurrentDate(subWeeks(currentDate, 2));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "1d":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "3d":
        setCurrentDate(addDays(currentDate, 3));
        break;
      case "7d":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "14d":
        setCurrentDate(addWeeks(currentDate, 2));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  const getHeaderTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
    return format(currentDate, "MMMM yyyy", { locale: ptBR });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-w-0 min-h-0">
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleToday}
            className="hidden sm:inline-flex"
          >
            Hoje
          </Button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-heading font-bold text-lg text-slate-800 capitalize min-w-[140px] text-center">
              {getHeaderTitle()}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            {(["1d", "3d", "7d", "14d", "month"] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setView(m)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  view === m
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {m === "1d" && "Dia"}
                {m === "3d" && "3 Dias"}
                {m === "7d" && "Semana"}
                {m === "14d" && "2 Semanas"}
                {m === "month" && "Mês"}
              </button>
            ))}
          </div>

          <PlannerModal
            trigger={
              <Button className="bg-[#af4d30] hover:bg-[#af4d30]/90 text-white rounded-xl shadow-sm hidden sm:inline-flex shrink-0">
                <Plus className="w-4 h-4 mr-2" /> Novo
              </Button>
            }
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-hidden">
        {view === "month" ? (
          <MonthGrid date={currentDate} items={initialItems} />
        ) : (
          <TimeGrid date={currentDate} view={view} items={initialItems} />
        )}
      </div>
    </div>
  );
}
