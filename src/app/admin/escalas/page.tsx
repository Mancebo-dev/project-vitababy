import { redirect } from "next/navigation";

export default function EscalasPage() {
  redirect("/admin/agenda?tab=escalas");
}
