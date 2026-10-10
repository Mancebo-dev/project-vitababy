"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Booking,
  Client,
  ClientSchedule,
  ContractTemplate,
  Professional,
  ScheduleSlot,
  Service,
  ServicePackage,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
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
import { RichEditor } from "@/components/ui/rich-editor";
import { createContract } from "../actions";

const schema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  bookingId: z.string().optional(),
  scheduleId: z.string().optional(),
  templateId: z.string().min(1, "Selecione um modelo base"),
  customContent: z.string().optional(),
  scale: z.string().optional(),
  extraNotes: z.string().optional(),
  addImageClause: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateContractModal({
  pendingBookings,
  templates,
  clients,
  clientSchedules,
}: {
  pendingBookings: (Booking & {
    client?: Client | null;
    professional?: Professional | null;
    packages?: (ServicePackage & { service: Service | null })[];
    scheduleSlot: ScheduleSlot;
  })[];
  templates: ContractTemplate[];
  clients: Client[];
  clientSchedules: (ClientSchedule & { client: Client })[];
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: "",
      bookingId: "",
      scheduleId: "",
      templateId: "",
      customContent: "",
      scale: "",
      extraNotes: "",
      addImageClause: false,
    },
  });

  const selectedTemplateId = form.watch("templateId");

  const handleEditTemplate = () => {
    if (!selectedTemplateId) {
      alert("Selecione um modelo base primeiro.");
      return;
    }
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      form.setValue("customContent", template.content);
      setIsEditingTemplate(true);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createContract(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar contrato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium cursor-pointer shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Contrato de Cliente
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerar Contrato para Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {isEditingTemplate ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="customContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editar Texto do Contrato</FormLabel>
                      <FormControl>
                        <RichEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          a4Mode={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingTemplate(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Gerando..." : "Gerar Contrato"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Selecione um cliente...</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
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
                  name="bookingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agendamento (Opcional)</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Nenhum...</option>
                          {pendingBookings.map((b) => (
                            <option key={b.id} value={b.id}>
                              {new Date(
                                b.scheduleSlot.date,
                              ).toLocaleDateString()}{" "}
                              às {b.scheduleSlot.startTime} -{" "}
                              {b.packages?.map((p) => p.name).join(" + ")}
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
                  name="scheduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escala (Opcional)</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Nenhuma...</option>
                          {clientSchedules.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title || `Escala ${s.month}`} ({s.month})
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
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo Base (Template) *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Selecione um modelo base...</option>
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
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
                  name="scale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Formato de Escala (Opcional, ex: 12x36)
                      </FormLabel>
                      <FormControl>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Ex: 12x36, 24x48..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extraNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Extras (Opcional)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Adicione cláusulas específicas para esta cliente..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addImageClause"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Adicionar cláusula de uso de imagem
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleEditTemplate}
                    disabled={!selectedTemplateId}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50"
                  >
                    Editar Template
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Gerando..." : "Gerar Contrato"}
                  </button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
