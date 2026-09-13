import { Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface BookingReceivedTemplateProps {
  clientName: string;
  serviceName: string;
  dateStr: string;
}

export function BookingReceivedTemplate({
  clientName,
  serviceName,
  dateStr,
}: BookingReceivedTemplateProps) {
  const firstName = clientName.split(" ")[0];

  return (
    <EmailLayout previewText="Recebemos sua solicitação de agendamento">
      <Text style={h1}>Olá, {firstName}!</Text>
      <Text style={text}>
        Recebemos com sucesso a sua solicitação de agendamento na Vitababy.
      </Text>

      <Section style={card}>
        <Text style={cardTitle}>Detalhes da Solicitação</Text>
        <Text style={cardText}>
          <strong>Serviço:</strong> {serviceName}
          <br />
          <strong>Data Preferencial:</strong> {dateStr}
        </Text>
      </Section>

      <Text style={text}>
        Nossa equipe vai analisar a disponibilidade da agenda e em breve você
        receberá um novo e-mail confirmando o seu horário.
      </Text>
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
  backgroundColor: "#fbf9f5",
  border: "1px solid #e4e2de",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const cardTitle = {
  color: "#411f03",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const cardText = {
  color: "#444840",
  fontSize: "15px",
  lineHeight: "22px",
  margin: 0,
};
