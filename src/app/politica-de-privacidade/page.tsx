import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata = {
  title: "Política de Privacidade | Vita Baby",
  description:
    "Política de Privacidade da Vita Baby Assessoria Materno-Infantil",
};

export default function PoliticaPrivacidade() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <section className="pt-[10rem] pb-[5rem] px-[1.5rem] lg:px-[7.5rem] max-w-[1000px] mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-[0.5rem] text-[#af4d30] font-semibold mb-[2rem] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para o início
        </Link>

        <h1 className="text-[clamp(2rem,3vw,3rem)] font-heading text-[#411f03] font-bold mb-[2rem] leading-[1.2]">
          Política de Privacidade
        </h1>

        <div className="prose prose-stone max-w-none text-[#444840] leading-[1.8]">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            1. Introdução
          </h2>
          <p>
            A <strong>Vita Baby Assessoria Materno-Infantil</strong> ("nós",
            "nosso", "nossa") respeita a sua privacidade e está comprometida em
            proteger os seus dados pessoais. Esta Política de Privacidade
            explica como coletamos, usamos, divulgamos e salvaguardamos suas
            informações quando você visita nosso site ou utiliza nossos serviços
            de consultoria em amamentação, banho humanizado e perfuração de
            lóbulo.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            2. Coleta de Dados
          </h2>
          <p>Podemos coletar as seguintes informações sobre você:</p>
          <ul className="list-disc pl-[1.5rem] mb-[1rem]">
            <li>
              <strong>Dados de Identidade:</strong> nome, sobrenome.
            </li>
            <li>
              <strong>Dados de Contato:</strong> e-mail, número de telefone
              (WhatsApp).
            </li>
            <li>
              <strong>Dados de Saúde e Familiares:</strong> informações básicas
              compartilhadas voluntariamente durante o preenchimento de
              formulários de triagem ou durante os atendimentos (apenas o
              estritamente necessário para o serviço contratado).
            </li>
            <li>
              <strong>Dados Técnicos:</strong> endereço IP, tipo de navegador e
              informações de cookies.
            </li>
          </ul>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            3. Uso das Informações
          </h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul className="list-disc pl-[1.5rem] mb-[1rem]">
            <li>
              Agendar, gerenciar e realizar os serviços de assessoria
              materno-infantil.
            </li>
            <li>
              Responder a dúvidas, solicitações e fornecer suporte ao cliente.
            </li>
            <li>
              Enviar comunicações relacionadas aos serviços contratados ou
              novidades da Vita Baby (caso autorizado).
            </li>
            <li>
              Melhorar nosso site e entender como os visitantes interagem com
              nossas plataformas.
            </li>
          </ul>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            4. Proteção e Compartilhamento de Dados
          </h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD),
            garantimos que suas informações são armazenadas em ambientes
            seguros. Não vendemos ou alugamos seus dados pessoais a terceiros.
            Seus dados só serão compartilhados com fornecedores estritamente
            necessários para a operação do serviço (ex: plataformas de
            agendamento), que também devem cumprir com as leis de proteção de
            dados.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            5. Seus Direitos
          </h2>
          <p>Você tem o direito de:</p>
          <ul className="list-disc pl-[1.5rem] mb-[1rem]">
            <li>Solicitar acesso aos seus dados pessoais.</li>
            <li>Solicitar a correção de dados incompletos ou imprecisos.</li>
            <li>
              Solicitar a exclusão dos seus dados, exceto quando houver
              obrigações legais de retenção (como prontuários ou recibos).
            </li>
            <li>
              Revogar o consentimento para o uso de cookies ou comunicações de
              marketing.
            </li>
          </ul>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            6. Contato
          </h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta Política de
            Privacidade, entre em contato conosco através do e-mail:{" "}
            <strong>contato@vitababy.com.br</strong>
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
