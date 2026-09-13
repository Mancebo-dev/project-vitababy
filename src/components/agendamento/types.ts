export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  price: string;
  modalities: ("Presencial / Domiciliar" | "Online")[];
  popular?: boolean;
}

export interface ProfessionalItem {
  id: string;
  name: string;
  role: string;
  crnOrCoren: string;
  experience: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  bio: string;
  specialties: string[];
}

export interface TimeSlot {
  time: string;
  period: "morning" | "afternoon";
  available: boolean;
}

export interface DatePreference {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface BookingFormData {
  serviceIds: string[];
  professionalId: string;
  dates: DatePreference[]; // 1 to 3 date preferences
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf: string;
  clientZipCode: string;
  clientAddress: string;
  additionalInfo: string;
  requiresCompanion: boolean;
  acceptTerms: boolean;
}

import type { Professional, Service } from "@prisma/client";

export type ExtendedService = Service & {
  price?: number;
  duration?: number;
  popular?: boolean;
};

export type ExtendedProfessional = Professional & {
  role?: string;
  crnOrCoren?: string | null;
  rating?: number;
  reviewCount?: number;
  avatarUrl?: string | null;
  bio?: string | null;
  specialties?: string | string[] | null;
};
