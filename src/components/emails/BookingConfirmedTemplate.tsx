import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface BookingConfirmedTemplateProps {
  clientName: string;
  serviceName: string;
  dateTime: string;
}

export function BookingConfirmedTemplate({
  clientName,
  serviceName,
  dateTime,
}: BookingConfirmedTemplateProps) {
  const firstName = clientName.split(" ")[0];
  const portalUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/portal`
    : "http://localhost:3000/portal";

  return (
    <EmailLayout previewText="Seu agendamento foi confirmado!">
      <Text style={h1}>Tudo certo, {firstName}!</Text>
      <Text style={text}>
        Seu agendamento na Vitababy acaba de ser <strong>confirmado</strong>.
      </Text>

      <Section style={card}>
        <Text style={cardText}>
          <strong>Serviço:</strong> {serviceName}
          <br />
          <strong>Data e Hora:</strong> {dateTime}
        </Text>
      </Section>

      <Text style={text}>
        Estamos muito felizes em poder atender você. Se precisar alterar alguma
        coisa, você pode acessar a sua Área da Cliente no portal.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={portalUrl}>
          Acessar Área da Cliente
        </Button>
      </Section>

      <Text style={text}>
        Com carinho,
        <br />
        <strong>Equipe Vitababy</strong>
      </Text>
    </EmailLayout>
  );
}

const h1 = {
  color: "#411f03",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const text = {
  color: "#444840",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const card = {
  backgroundColor: "#eff8f3",
  border: "1px solid #cce8d6",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const cardText = {
  color: "#205634",
  fontSize: "15px",
  lineHeight: "22px",
  margin: 0,
};

const btnContainer = {
  textAlign: "center" as const,
  marginBottom: "30px",
  marginTop: "10px",
};

const button = {
  backgroundColor: "#af4d30",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};
