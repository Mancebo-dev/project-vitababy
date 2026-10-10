"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Service, ServicePackage } from "@prisma/client";
import * as LucideIcons from "lucide-react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createService,
  createServicePackage,
  deleteService,
  deleteServicePackage,
  updateService,
  updateServicePackage,
} from "../actions";

const serviceSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const packageSchema = z.object({
  serviceId: z.string().min(1, "Serviço é obrigatório"),
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  isHighlighted: z.boolean().default(false),
  billingCycle: z.string().default("ONETIME"),
  features: z.string().optional(),
});

const ICON_OPTIONS = [
  { value: "Baby", label: "Bebê" },
  { value: "Stethoscope", label: "Estetoscópio (Saúde)" },
  { value: "Heart", label: "Coração" },
  { value: "Activity", label: "Atividade" },
  { value: "Shield", label: "Escudo" },
  { value: "Sparkles", label: "Brilhos" },
  { value: "Star", label: "Estrela" },
  { value: "Clock", label: "Relógio" },
  { value: "Calendar", label: "Calendário" },
  { value: "Video", label: "Câmera (Online)" },
  { value: "MessageCircle", label: "Mensagem (Chat)" },
  { value: "Package", label: "Pacote (Padrão)" },
];

export function CreateServiceDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    await createService(values);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Novo Serviço
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Serviço (Categoria)</DialogTitle>
          <DialogDescription>
            Crie uma categoria base para agrupar pacotes. Ex: "Consultoria de
            Sono".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Consultoria de Sono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva brevemente esta categoria..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={opt.value} className="w-4 h-4" />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Categoria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditServiceDialog({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service.name,
      description: service.description || "",
      icon: service.icon || "",
    },
  });

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    await updateService(service.id, { ...values, active: service.active });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="text-slate-400 hover:text-blue-600 p-1"
        >
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={opt.value} className="w-4 h-4" />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Atualizar Categoria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function CreatePackageDialog({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<any>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      serviceId: services[0]?.id || "",
      name: "",
      description: "",
      price: undefined,
      duration: undefined,
      isHighlighted: false,
      billingCycle: "ONETIME",
      features: "",
    },
  });

  async function onSubmit(values: z.infer<typeof packageSchema>) {
    await createServicePackage(values);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Adicionar Plano
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Plano</DialogTitle>
          <DialogDescription>
            Crie um plano/pacote e associe a um serviço.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço (Categoria)</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Plano Básico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="500"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="60"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo de Cobrança</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="ONETIME">Pagamento Único</option>
                      <option value="MONTHLY">Mensal</option>
                      <option value="QUARTERLY">Trimestral</option>
                      <option value="YEARLY">Anual</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes curtos..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Plano</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditPackageDialog({
  pkg,
  services,
}: {
  pkg: ServicePackage;
  services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<any>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      serviceId: pkg.serviceId,
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price || undefined,
      duration: pkg.duration || undefined,
      isHighlighted: pkg.isHighlighted,
      billingCycle: pkg.billingCycle || "ONETIME",
      features: pkg.features || "",
    },
  });

  async function onSubmit(values: z.infer<typeof packageSchema>) {
    await updateServicePackage(pkg.id, values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="text-slate-400 hover:text-blue-600 p-1"
        >
          <Edit className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço (Categoria)</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo de Cobrança</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="ONETIME">Pagamento Único</option>
                      <option value="MONTHLY">Mensal</option>
                      <option value="QUARTERLY">Trimestral</option>
                      <option value="YEARLY">Anual</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Atualizar Plano</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAction({
  id,
  type,
}: {
  id: string;
  type: "service" | "package";
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    setIsDeleting(true);
    try {
      if (type === "service") {
        await deleteService(id);
      } else {
        await deleteServicePackage(id);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-400 hover:text-red-500 transition-colors p-1"
      title="Excluir"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
