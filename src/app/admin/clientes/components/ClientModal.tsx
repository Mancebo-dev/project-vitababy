"use client";

import type { Client } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { createClient, deleteClient, updateClient } from "../actions";

export function ClientModal({
  client,
  trigger,
}: {
  client?: Client;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      confirm(
        "Tem certeza que deseja excluir este cliente? Essa ação apagará todos os dados, agendamentos e prontuários vinculados a ele e não pode ser desfeita.",
      )
    ) {
      setLoading(true);
      try {
        if (!client) return;
        const res = await deleteClient(client.id);
        if (!res.success) {
          alert(res.error || "Erro ao excluir o cliente.");
          return;
        }
        setOpen(false);
        router.push("/admin/clientes");
      } catch (err) {
        console.error(err);
        alert(
          "Erro ao excluir o cliente. Verifique se ele não possui pendências bloqueantes.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: client?.name || "",
    childName: client?.childName || "",
    email: client?.email || "",
    phone: client?.phone || "",
    cpf: client?.cpf || "",
    zipCode: client?.zipCode || "",
    street: client?.street || "",
    number: client?.number || "",
    neighborhood: client?.neighborhood || "",
    city: client?.city || "",
    state: client?.state || "",
    complement: client?.complement || "",
    password: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: client?.name || "",
        childName: client?.childName || "",
        email: client?.email || "",
        phone: client?.phone || "",
        cpf: client?.cpf || "",
        zipCode: client?.zipCode || "",
        street: client?.street || "",
        number: client?.number || "",
        neighborhood: client?.neighborhood || "",
        city: client?.city || "",
        state: client?.state || "",
        complement: client?.complement || "",
        password: "",
      });
    }
  }, [open, client]);

  const handleZipCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const zip = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, zipCode: zip }));

    if (zip.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res: { success: boolean; error?: string };
      if (client?.id) {
        res = await updateClient(client.id, formData);
      } else {
        res = await createClient(formData);
      }
      if (!res.success) {
        alert(res.error || "Erro ao salvar o cliente.");
        return;
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao salvar o cliente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {client ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="childName">Nome do Bebê</Label>
              <Input
                id="childName"
                value={formData.childName}
                onChange={(e) =>
                  setFormData({ ...formData, childName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone / WhatsApp *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="password">
                {client
                  ? "Alterar Senha do Portal (opcional)"
                  : "Senha de Acesso ao Portal (opcional)"}
              </Label>
              <Input
                id="password"
                type="text"
                placeholder={
                  client
                    ? "Digite uma nova senha (ou deixe em branco para manter)"
                    : "Padrão: CPF (apenas números) ou 'clientevitababy'"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-[11px] text-slate-500">
                {client
                  ? "Caso queira definir uma nova senha para a cliente acessar o portal, digite-a acima. A senha padrão do sistema é 'clientevitababy'."
                  : "Caso não informada, a senha de primeiro acesso será os números do CPF ou 'clientevitababy'."}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Endereço
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:col-span-4">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  maxLength={9}
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={handleZipCodeChange}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-8">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-4">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) =>
                    setFormData({ ...formData, complement: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-5">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-8">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-4">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input
                  id="state"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 border-t border-slate-100 mt-4">
            <div>
              {client?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
