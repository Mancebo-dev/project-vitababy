import type { ProfessionalItem, ServiceItem, TimeSlot } from "./types";

export const SERVICES: ServiceItem[] = [
  {
    id: "amamentacao",
    title: "Consultoria em Amamentação",
    subtitle: "Apoio completo para amamentar com tranquilidade",
    description:
      "Avaliação individualizada da mamada, correção de pega e posicionamento, prevenção e tratamento de fissuras mamárias, ingurgitamento e ganho de peso.",
    duration: "2 horas",
    price: "R$ 350,00",
    modalities: ["Presencial / Domiciliar", "Online"],
    popular: true,
  },
  {
    id: "banho-humanizado",
    title: "Banho Humanizado do Bebê",
    subtitle: "Relaxamento e conexão profunda nos primeiros dias",
    description:
      "Técnica terapêutica que recria o ambiente uterino através do enrolamento e água morna, reduzindo o estresse do recém-nascido e ensinando os pais com segurança.",
    duration: "1h30",
    price: "R$ 180,00",
    modalities: ["Presencial / Domiciliar"],
    popular: true,
  },
  {
    id: "assistencia-especializada",
    title: "Assistência Especializada no Pós-Parto",
    subtitle: "Suporte completo no retorno para casa",
    description:
      "Acompanhamento presencial intensivo pós-alta da maternidade: cuidados com o coto umbilical, rotina de sono do bebê, orientações de puerpério e acolhimento materno.",
    duration: "3 a 4 horas",
    price: "R$ 450,00",
    modalities: ["Presencial / Domiciliar"],
  },
  {
    id: "furinho-humanizado",
    title: "Perfuração de Lóbulo Humanizada",
    subtitle: "Primeiro brinquinho sem dor e com afeto",
    description:
      "Procedimento realizado com aplicação prévia de anestésico tópico, pontos neutros segundo a acupuntura auricular e brincos hipoalergênicos estéreis de titânio ou ouro 24k.",
    duration: "1 hora",
    price: "R$ 220,00",
    modalities: ["Presencial / Domiciliar"],
  },
  {
    id: "laserterapia",
    title: "Laserterapia Mamária & Cicatrização",
    subtitle: "Alívio imediato da dor e regeneração tecidual",
    description:
      "Aplicação de laser de baixa intensidade para aceleração da cicatrização de fissuras mamilares, efeito analgésico imediato e redução do processo inflamatório.",
    duration: "1 hora",
    price: "R$ 190,00",
    modalities: ["Presencial / Domiciliar"],
  },
  {
    id: "retorno-trabalho",
    title: "Consultoria de Retorno ao Trabalho",
    subtitle: "Planejamento e manutenção do aleitamento",
    description:
      "Estratégia personalizada de ordenha, armazenamento correto, montagem de estoque de leite materno e adaptação do bebê para a ausência da mãe.",
    duration: "1h30",
    price: "R$ 250,00",
    modalities: ["Presencial / Domiciliar", "Online"],
  },
];

export const PROFESSIONALS: ProfessionalItem[] = [
  {
    id: "rayane-castro",
    name: "Rayane Castro",
    role: "Enfermeira Obstetra & Neonatal",
    crnOrCoren: "COREN-DF 492.831",
    experience: "9+ anos de experiência",
    rating: 5.0,
    reviewCount: 154,
    avatarUrl: "/assets/hero-img.png",
    bio: "Fundadora da Vitababy, pós-graduada em Enfermagem Obstétrica e Neonatologia, especialista em aleitamento materno e laserterapia aplicada ao puerpério.",
    specialties: [
      "Amamentação Avançada",
      "Banho Humanizado",
      "Laserterapia Mamária",
      "Primeiros Socorros",
    ],
  },
  {
    id: "proxima-disponivel",
    name: "Primeira Especialista Disponível",
    role: "Equipe Clínica Vitababy",
    crnOrCoren: "Equipe Certificada",
    experience: "Supervisionada por Rayane Castro",
    rating: 5.0,
    reviewCount: 88,
    avatarUrl: "/assets/hero-img.png",
    bio: "Recomendado para quem precisa de atendimento mais ágil ou com maior flexibilidade de horários. Todas as enfermeiras seguem o protocolo humanizado Vitababy.",
    specialties: [
      "Atendimento Rápido",
      "Todos os Serviços",
      "Protocolo Padrão Ouro",
    ],
  },
];

export function getAvailableSlots(
  dateStr: string,
  _professionalId: string,
): TimeSlot[] {
  // Gera horários disponíveis simulados com base no dia da semana para realismo
  const date = new Date(`${dateStr}T12:00:00`);
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

  // Domingo fechado
  if (dayOfWeek === 0) {
    return [];
  }

  // Sábado tem horários apenas pela manhã
  if (dayOfWeek === 6) {
    return [
      { time: "08:30", period: "morning", available: true },
      { time: "10:30", period: "morning", available: true },
      { time: "12:00", period: "morning", available: false },
    ];
  }

  // Dias de semana (Seg a Sex)
  return [
    { time: "08:30", period: "morning", available: true },
    { time: "10:00", period: "morning", available: dayOfWeek % 2 !== 0 },
    { time: "11:30", period: "morning", available: true },
    { time: "14:00", period: "afternoon", available: true },
    { time: "15:30", period: "afternoon", available: dayOfWeek % 3 !== 0 },
    { time: "17:00", period: "afternoon", available: true },
    { time: "18:30", period: "afternoon", available: dayOfWeek !== 5 },
  ];
}
