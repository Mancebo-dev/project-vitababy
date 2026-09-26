"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSchedule } from "../actions";

type ScheduleProps = {
  id: string;
  month: string;
  title: string | null;
  client: { name: string };
  shifts: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: string;
    professional: { name: string; color: string | null };
  }[];
};

export function EscalaList({ schedules }: { schedules: ScheduleProps[] }) {
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta escala?")) {
      await deleteSchedule(id);
    }
  };

  return (
    <div className="divide-y divide-slate-100">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {schedule.title || `Escala: ${schedule.month}`}
              </h3>
              <p className="text-sm text-slate-500">
                Cliente:{" "}
                <span className="font-medium text-slate-700">
                  {schedule.client.name}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                onClick={() => handleDelete(schedule.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.shifts.map((shift) => (
              <div
                key={shift.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative overflow-hidden"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{
                    backgroundColor: shift.professional.color || "#ae4d30",
                  }}
                />
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  {format(new Date(shift.date), "dd 'de' MMMM, yyyy", {
                    locale: ptBR,
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {shift.startTime} às {shift.endTime}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span
                    className="text-sm font-medium"
                    style={{ color: shift.professional.color || "#ae4d30" }}
                  >
                    {shift.professional.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                    {shift.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
