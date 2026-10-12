import { redirect } from "next/navigation";

export default function PlanosPage() {
  redirect("/admin/servicos?tab=planos");
}
