"use client";

import type { Payment } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTransaction } from "../actions";

export function TransactionModal({
  transaction: _transaction,
  trigger,
}: {
  transaction?: Payment;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "INCOME",
    method: "PIX",
    status: "PAID",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransaction({
        ...formData,
        amount: parseFloat(formData.amount.replace(",", ".")),
        date: new Date(`${formData.date}T00:00:00`),
      });
      setOpen(false);
      setFormData({
        description: "",
        amount: "",
        type: "INCOME",
        method: "PIX",
        status: "PAID",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="INCOME">Receita (Entrada)</option>
              <option value="EXPENSE">Despesa (Saída)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="method">Forma de Pagamento</Label>
              <select
                id="method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT">Cartão de Crédito</option>
                <option value="DEBIT">Cartão de Débito</option>
                <option value="MONEY">Dinheiro</option>
                <option value="TRANSFER">Transferência</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="PAID">Pago</option>
                <option value="PENDING">Pendente</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
