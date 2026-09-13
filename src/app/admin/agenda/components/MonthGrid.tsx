"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import type { AgendaEvent } from "./Planner";

interface MonthGridProps {
  date: Date;
  items: AgendaEvent[];
}

export function MonthGrid({ date, items }: MonthGridProps) {
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [date]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 shrink-0">
        {weekDays.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-bold text-slate-500 uppercase border-r border-slate-100 last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-auto bg-slate-50 gap-[1px] border-b border-slate-200">
        {monthDays.map((d, _i) => {
          const isCurrentMonth = isSameMonth(d, date);
          const isToday = isSameDay(d, new Date());
          const dayItems = items.filter((item) =>
            isSameDay(new Date(item.date), d),
          );

          return (
            <div
              key={d.toISOString()}
              className={`bg-white p-1 sm:p-2 overflow-hidden flex flex-col gap-1 transition-colors hover:bg-slate-50 ${isCurrentMonth ? "" : "opacity-50 bg-slate-50/50"}`}
            >
              <div className="flex justify-end">
                <span
                  className={`text-xs sm:text-sm w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full font-medium ${isToday ? "bg-[#af4d30] text-white" : "text-slate-700"}`}
                >
                  {format(d, "d")}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                {dayItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="text-[0.65rem] sm:text-xs rounded px-1.5 py-0.5 truncate text-white"
                    style={{ backgroundColor: item.color || "#ae4d30" }}
                    title={item.title}
                  >
                    {item.startTime} {item.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
