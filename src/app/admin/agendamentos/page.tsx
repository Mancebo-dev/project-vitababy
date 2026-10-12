import { redirect } from "next/navigation";

export default function AgendamentosPage() {
  redirect("/admin/agenda?tab=agendamentos");
}
