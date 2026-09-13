import type { ReactElement } from "react";
import { DEFAULT_SENDER, resend } from "@/infrastructure/email/resend";

// Wrapper for sending emails using Resend and React Email
// biome-ignore lint/complexity/noStaticOnlyClass: Grouping email actions in static service class
export class EmailService {
  private static async send(
    to: string,
    subject: string,
    reactComponent: ReactElement,
  ) {
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        `[EmailService] Simulando envio para ${to} pois RESEND_API_KEY não está configurado.`,
      );
      return { success: true, simulated: true };
    }

    try {
      const data = await resend.emails.send({
        from: `Vitababy <${DEFAULT_SENDER}>`,
        to: [to],
        subject,
        react: reactComponent,
      });

      return { success: true, data };
    } catch (error: unknown) {
      console.error("[EmailService] Erro ao enviar e-mail:", error);
      return { success: false, error };
    }
  }

  static async sendBookingReceived(
    email: string,
    clientName: string,
    serviceName: string,
    dateStr: string,
  ) {
    const { BookingReceivedTemplate } = await import(
      "@/components/emails/BookingReceivedTemplate"
    );
    return EmailService.send(
      email,
      "Recebemos sua solicitação de agendamento!",
      BookingReceivedTemplate({ clientName, serviceName, dateStr }),
    );
  }

  static async sendBookingConfirmed(
    email: string,
    clientName: string,
    serviceName: string,
    dateTime: string,
  ) {
    const { BookingConfirmedTemplate } = await import(
      "@/components/emails/BookingConfirmedTemplate"
    );
    return EmailService.send(
      email,
      "Seu agendamento foi confirmado!",
      BookingConfirmedTemplate({ clientName, serviceName, dateTime }),
    );
  }

  static async sendContractReady(
    email: string,
    clientName: string,
    contractUrl: string,
  ) {
    const { ContractReadyTemplate } = await import(
      "@/components/emails/ContractReadyTemplate"
    );
    return EmailService.send(
      email,
      "Seu contrato está pronto para assinatura",
      ContractReadyTemplate({ clientName, contractUrl }),
    );
  }

  static async sendContractSigned(
    email: string,
    clientName: string,
    portalUrl: string,
  ) {
    const { ContractSignedTemplate } = await import(
      "@/components/emails/ContractSignedTemplate"
    );
    return EmailService.send(
      email,
      "Contrato Assinado com Sucesso!",
      ContractSignedTemplate({ clientName, portalUrl }),
    );
  }

  static async sendPasswordUpdated(email: string, clientName: string) {
    const { PasswordUpdatedTemplate } = await import(
      "@/components/emails/PasswordUpdatedTemplate"
    );
    return EmailService.send(
      email,
      "Aviso de Segurança: Sua senha foi alterada",
      PasswordUpdatedTemplate({ clientName }),
    );
  }
}
