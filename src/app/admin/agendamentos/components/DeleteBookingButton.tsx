"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteBooking } from "../actions";

export function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteBooking(bookingId);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2"
      title="Excluir Agendamento"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
