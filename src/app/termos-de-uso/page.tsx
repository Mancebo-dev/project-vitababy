import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata = {
  title: "Termos de Uso | Vita Baby",
  description: "Termos de Uso da Vita Baby Assessoria Materno-Infantil",
};

export default function TermosUso() {
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
          Termos de Uso
        </h1>

        <div className="prose prose-stone max-w-none text-[#444840] leading-[1.8]">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar e utilizar o site da{" "}
            <strong>Vita Baby Assessoria</strong>, você concorda em cumprir e se
            vincular a estes Termos de Uso. Se você não concordar com qualquer
            parte destes termos, não deverá utilizar nossos serviços ou nosso
            site.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            2. Natureza dos Serviços
          </h2>
          <p>
            A Vita Baby oferece serviços de consultoria e assessoria
            materno-infantil (como apoio à amamentação, banho humanizado e
            perfuração de lóbulo auricular). As informações fornecidas através
            deste site e durante as consultorias têm caráter de apoio,
            orientação e cuidado humanizado.
            <strong>
              Nossos serviços não substituem, de forma alguma, diagnósticos
              médicos ou consultas com o pediatra do bebê.
            </strong>
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            3. Agendamentos e Cancelamentos
          </h2>
          <p>
            Os serviços devem ser agendados previamente através dos nossos
            canais oficiais (formulário no site ou WhatsApp). Em caso de
            imprevistos, pedimos que os cancelamentos ou reagendamentos sejam
            informados com antecedência razoável, conforme combinado no momento
            do agendamento, para não prejudicar a agenda dos profissionais.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            4. Propriedade Intelectual
          </h2>
          <p>
            Todo o conteúdo presente neste site (textos, imagens, logotipos,
            vídeos, ícones) é propriedade exclusiva da Vita Baby Assessoria ou
            utilizado mediante licença/autorização. É expressamente proibida a
            reprodução, cópia ou distribuição deste material sem o consentimento
            prévio por escrito.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            5. Limitação de Responsabilidade
          </h2>
          <p>
            A Vita Baby se compromete a prestar seus serviços com o mais alto
            nível de dedicação e base técnica. Contudo, resultados associados ao
            bem-estar e comportamento do bebê (como adaptação à rotina ou
            amamentação) dependem de múltiplos fatores familiares e biológicos,
            não sendo possível garantir resultados idênticos para todos os
            casos.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            6. Modificações dos Termos
          </h2>
          <p>
            Reservamo-nos o direito de alterar ou modificar estes Termos de Uso
            a qualquer momento. Quaisquer alterações entrarão em vigor
            imediatamente após a publicação no site. Recomendamos que você
            revise esta página periodicamente.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            7. Legislação Aplicável
          </h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do
            Brasil. Quaisquer disputas relacionadas a estes termos serão
            resolvidas nos foros competentes brasileiros.
          </p>

          <h2 className="text-[1.5rem] font-heading font-bold text-[#411f03] mt-[2rem] mb-[1rem]">
            8. Dúvidas
          </h2>
          <p>
            Caso tenha qualquer dúvida sobre estes Termos de Uso, entre em
            contato através do e-mail: <strong>contato@vitababy.com.br</strong>
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
