import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de dados oficiais da Vita Baby...");

  // 1. Modelo de Contrato Inicial
  const existingTemplate = await prisma.contractTemplate.findFirst({
    where: { title: { contains: "Vita Baby" } },
  });

  const contractContent = `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #2d3748; line-height: 1.7; width: 100%;">
  <div style="text-align: center; margin-bottom: 32px; border-bottom: 2px solid #ae4d30; padding-bottom: 20px;">
    <h2 style="color: #ae4d30; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Vita Baby Consultoria Materno-Infantil</h2>
    <p style="color: #718096; font-size: 14px; margin: 6px 0 0 0;">Cuidado Humanizado e Especializado para Mãe e Bebê</p>
  </div>

  <h3 style="text-align: center; color: #1a202c; font-size: 18px; margin-bottom: 24px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSESSORIA MATERNO-INFANTIL</h3>

  <p>Pelo presente instrumento particular de prestação de serviços, de um lado:</p>

  <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px 0;"><strong>CONTRATADA:</strong> <strong>VITA BABY CONSULTORIA</strong>, representada tecnicamente pela assessora e profissional responsável <strong>{{NOME_ASSESSORA}}</strong>.</p>
    <p style="margin: 0;"><strong>CONTRATANTE:</strong> <strong>{{NOME_CLIENTE}}</strong>, inscrita no CPF sob o nº <strong>{{CPF_CLIENTE}}</strong>, residente e domiciliada no endereço: <strong>{{ENDERECO_CLIENTE}}</strong>.</p>
  </div>

  <p>Têm entre si, justo e contratado, o presente Contrato de Prestação de Serviços, que se regerá pelas seguintes cláusulas e condições:</p>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
  <p>O presente contrato tem como objeto a prestação de serviços especializados de consultoria e assistência materno-infantil em: <strong>{{SERVICO}}</strong>.</p>
  <p>O atendimento será realizado em conformidade com as boas práticas clínicas, respeito à fisiologia da mãe e do recém-nascido e protocolo humanizado Vita Baby, na data e horário agendados: <strong>{{DATA_AGENDAMENTO}}</strong>.</p>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO</h4>
  <p>Pelos serviços contratados, a CONTRATANTE pagará à CONTRATADA o valor total de <strong>{{VALOR}}</strong>, conforme condições e prazos acordados na plataforma.</p>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DA CONTRATADA</h4>
  <p>A CONTRATADA se compromete a:</p>
  <ul style="padding-left: 20px;">
    <li>Prestar os serviços com o mais alto zelo técnico, ético e profissional;</li>
    <li>Utilizar materiais adequados, esterilizados e seguros para o atendimento materno-infantil;</li>
    <li>Prestar orientações claras e suporte conforme o escopo do pacote contratado.</li>
  </ul>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATANTE</h4>
  <p>A CONTRATANTE se compromete a:</p>
  <ul style="padding-left: 20px;">
    <li>Prestar informações verdadeiras sobre a saúde da mãe e do bebê durante a anamnese;</li>
    <li>Prover ambiente adequado e seguro no domicílio para a realização da consulta/procedimento;</li>
    <li>Efetuar o pagamento nos prazos e termos estipulados.</li>
  </ul>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA QUINTA - DO CANCELAMENTO E REAGENDAMENTO</h4>
  <p>O cancelamento ou solicitação de reagendamento deve ser comunicado com antecedência mínima de 24 (vinte e quatro) horas da data acordada, possibilitando a reorganização da escala de atendimento.</p>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA SEXTA - DA PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)</h4>
  <p>As partes reconhecem que todos os dados de saúde, relatórios clínicos e informações compartilhadas são estritamente confidenciais e tratados nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), sendo utilizados unicamente para a finalidade assistencial.</p>

  <h4 style="color: #ae4d30; margin-top: 24px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">CLÁUSULA SÉTIMA - DO FORO</h4>
  <p>Para dirimir quaisquer controvérsias oriundas do presente contrato, as partes elegem o foro da Comarca de Brasília/DF, com renúncia expressa a qualquer outro por mais privilegiado que seja.</p>

  <p style="margin-top: 32px; text-align: center; color: #718096; font-size: 13px;">
    Documento gerado digitalmente através da plataforma Vita Baby com assinatura eletrônica com validade jurídica.
  </p>
</div>
`;

  if (!existingTemplate) {
    await prisma.contractTemplate.create({
      data: {
        title: "Contrato Padrão de Prestação de Serviços - Vita Baby",
        content: contractContent,
      },
    });
    console.log("Template de contrato criado com sucesso!");
  } else {
    await prisma.contractTemplate.update({
      where: { id: existingTemplate.id },
      data: { content: contractContent },
    });
    console.log("Template de contrato atualizado com sucesso!");
  }

  // 2. Assessora Fundadora Rayane Castro
  const existingRayane = await prisma.professional.findFirst({
    where: {
      OR: [
        { email: "rayane@vitababy.com.br" },
        { name: { contains: "Rayane" } },
      ],
    },
  });

  if (!existingRayane) {
    await prisma.professional.create({
      data: {
        name: "Rayane Castro",
        email: "rayane@vitababy.com.br",
        phone: "(61) 98177-3801",
        specialty: "Enfermeira Obstetra & Neonatal",
        crnOrCoren: "COREN-DF 492.831",
        experience: "9+ anos de experiência",
        bio: "Fundadora da Vitababy, enfermeira pós-graduada em Enfermagem Obstétrica e Neonatologia, especialista em aleitamento materno e laserterapia aplicada ao puerpério.",
        avatarUrl: "/assets/hero-img.png",
        specialties:
          "Amamentação, Banho Humanizado, Primeiros Socorros, Pós-Parto, Laserterapia Mamária, Furinho Humanizado",
        color: "#ae4d30",
        active: true,
      },
    });
    console.log("Assessora Rayane Castro cadastrada!");
  } else {
    await prisma.professional.update({
      where: { id: existingRayane.id },
      data: {
        name: "Rayane Castro",
        email: "rayane@vitababy.com.br",
        phone: "(61) 98177-3801",
        specialty: "Enfermeira Obstetra & Neonatal",
        crnOrCoren: "COREN-DF 492.831",
        experience: "9+ anos de experiência",
        bio: "Fundadora da Vitababy, enfermeira pós-graduada em Enfermagem Obstétrica e Neonatologia, especialista em aleitamento materno e laserterapia aplicada ao puerpério.",
        avatarUrl: "/assets/hero-img.png",
        specialties:
          "Amamentação, Banho Humanizado, Primeiros Socorros, Pós-Parto, Laserterapia Mamária, Furinho Humanizado",
        color: "#ae4d30",
        active: true,
      },
    });
    console.log("Assessora Rayane Castro atualizada!");
  }

  // 3. Serviços e Pacotes da Vitababy
  const servicesData = [
    {
      name: "Consultoria em Amamentação",
      description:
        "Apoio completo para estabelecer e manter o aleitamento materno com confiança, conforto e bem-estar para mãe e bebê.",
      packages: [
        {
          name: "Pacote 1 (Orientações Básicas)",
          description:
            "Avaliação da mamada, correção de pega e posicionamento, orientações individualizadas e 1 consulta domiciliar.",
          price: 350.0,
          duration: 90,
        },
        {
          name: "Pacote 2 (Orientações Detalhadas e Específicas)",
          description:
            "Avaliação completa da mamada, 2 consultas a domicílio, suporte via WhatsApp por 15 dias e material educativo personalizado.",
          price: 600.0,
          duration: 120,
        },
      ],
    },
    {
      name: "Banho Humanizado do Bebê",
      description:
        "Técnica de banho terapêutico que recria as sensações do ambiente intrauterino, promovendo calma, vínculo e relaxamento profundo.",
      packages: [
        {
          name: "Banho Continente",
          description:
            "Técnica adaptada especialmente para prematuros ou bebês sensíveis, respeitando limites com acolhimento emocional.",
          price: 120.0,
          duration: 60,
        },
        {
          name: "Banho Acolher",
          description:
            "Indicado para recém-nascidos nos primeiros dias em casa. Enrolamento seguro em ambiente acolhedor e transição suave.",
          price: 150.0,
          duration: 60,
        },
        {
          name: "Banho Vínculo",
          description:
            "Demonstração prática e orientação passo a passo para a família sobre postura segura, manuseio e rotina do banho.",
          price: 180.0,
          duration: 60,
        },
        {
          name: "Banho Calmaria",
          description:
            "Focado em relaxamento para bebês com cólicas frequentes, tensão ou dificuldade para relaxar.",
          price: 180.0,
          duration: 60,
        },
        {
          name: "Banho Ofurô + Shantala",
          description:
            "Para bebês a partir de 15 dias de vida. Ofurô em água morna com massagem Shantala tradicional para alívio de cólicas.",
          price: 220.0,
          duration: 75,
        },
        {
          name: "Banho Vita Baby (Completo)",
          description:
            "Inclui 2 pacotes à escolha da família, manuseio seguro, prevenção de acidentes e material educativo a domicílio.",
          price: 380.0,
          duration: 120,
        },
      ],
    },
    {
      name: "Primeiros Socorros para Bebês",
      description:
        "Treinamento prático e teórico domiciliar para pais e cuidadores agirem com segurança e rapidez em situações de emergência.",
      packages: [
        {
          name: "Pacote 1 (Suporte Básico de Emergência)",
          description:
            "Condutas em engasgo em recém-nascidos e lactentes (Manobra de Desengasgo), prevenção de quedas, conduta em convulsão febril e acidentes domésticos.",
          price: 200.0,
          duration: 60,
        },
        {
          name: "Pacote 2 (Suporte Detalhado e Específico)",
          description:
            "Tudo do Pacote 1 + Manejo de quedas e contusões, noções de RCP pediátrico, cortes, queimaduras, intoxicações, afogamentos, picadas e alergias agudas.",
          price: 350.0,
          duration: 90,
        },
      ],
    },
    {
      name: "Assistência Especializada no Pós-Parto",
      description:
        "Acompanhamento presencial intensivo pós-alta da maternidade para apoio prático, físico e emocional da puérpera e recém-nascido.",
      packages: [
        {
          name: "Cuidados no Pós-Parto e Puerpério",
          description:
            "Cuidados com coto umbilical, rotina de sono e banho, auxílio na recuperação materna, acolhimento emocional e orientações personalizadas.",
          price: 450.0,
          duration: 180,
        },
      ],
    },
    {
      name: "Perfuração de Lóbulo Humanizada",
      description:
        "Colocação do primeiro brinquinho com técnica estéril, silenciosa, sem dor e respeitando os pontos energéticos da acupuntura auricular.",
      packages: [
        {
          name: "Furinho Humanizado",
          description:
            "Procedimento realizado com aplicação prévia de anestésico tópico, pontos neutros segundo acupuntura auricular e brincos estéreis hipoalergênicos.",
          price: 220.0,
          duration: 60,
        },
      ],
    },
    {
      name: "Laserterapia Mamária & Cicatrização",
      description:
        "Aplicação de laser terapêutico de baixa intensidade para aceleração da cicatrização de fissuras mamilares, efeito analgésico e anti-inflamatório.",
      packages: [
        {
          name: "Sessão de Laserterapia",
          description:
            "Sessão de laserterapia mamária para alívio imediato da dor, aceleração do reparo tecidual de fissuras e regeneração epitelial.",
          price: 190.0,
          duration: 45,
        },
      ],
    },
    {
      name: "Experiência Integral Vita Baby (Premium)",
      description:
        "O pacote mais completo da Vita Baby, combinando assistência integral e multidisciplinar para a mãe e o recém-nascido.",
      packages: [
        {
          name: "Experiência Premium Vita Baby",
          description:
            "Primeiros cuidados especializados, Consultoria em Amamentação (Pacote 1), Banho Humanizado à escolha, Treinamento de Primeiros Socorros (Pacote 2) e Suporte WhatsApp por 15 dias.",
          price: 1000.0,
          duration: 240,
        },
      ],
    },
  ];

  for (const s of servicesData) {
    let service = await prisma.service.findFirst({
      where: { name: s.name },
    });

    if (!service) {
      service = await prisma.service.create({
        data: {
          name: s.name,
          description: s.description,
          active: true,
        },
      });
      console.log(`Serviço '${s.name}' criado!`);
    } else {
      service = await prisma.service.update({
        where: { id: service.id },
        data: { description: s.description, active: true },
      });
      console.log(`Serviço '${s.name}' atualizado!`);
    }

    for (const pkg of s.packages) {
      const existingPkg = await prisma.servicePackage.findFirst({
        where: { serviceId: service.id, name: pkg.name },
      });

      if (!existingPkg) {
        await prisma.servicePackage.create({
          data: {
            serviceId: service.id,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            duration: pkg.duration,
          },
        });
        console.log(`  Pacote '${pkg.name}' criado!`);
      } else {
        await prisma.servicePackage.update({
          where: { id: existingPkg.id },
          data: {
            description: pkg.description,
            price: pkg.price,
            duration: pkg.duration,
          },
        });
        console.log(`  Pacote '${pkg.name}' atualizado!`);
      }
    }
  }

  console.log("Seed de dados oficiais concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
