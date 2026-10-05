import { Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface NewContactMessageTemplateProps {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function NewContactMessageTemplate({
  name,
  email,
  phone,
  service,
  message,
}: NewContactMessageTemplateProps) {
  return (
    <EmailLayout previewText={`Nova mensagem de contato de ${name}`}>
      <Text style={h1}>Nova Mensagem de Contato</Text>
      <Text style={text}>
        Você recebeu uma nova mensagem pelo formulário do site público.
      </Text>

      <Section style={card}>
        <Text style={itemText}>
          <strong>Nome:</strong> {name}
        </Text>
        <Text style={itemText}>
          <strong>E-mail:</strong> {email}
        </Text>
        <Text style={itemText}>
          <strong>Telefone/WhatsApp:</strong> {phone}
        </Text>
        <Text style={itemText}>
          <strong>Serviço de Interesse:</strong> {service || "Não informado"}
        </Text>
      </Section>

      <Text style={h2}>Mensagem:</Text>
      <Section style={messageCard}>
        <Text style={messageText}>{message}</Text>
      </Section>

      <Text style={footerText}>
        Responda a este e-mail diretamente ou acesse o painel admin para
        gerenciar todas as mensagens.
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

const h2 = {
  color: "#411f03",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px 0",
};

const text = {
  color: "#444840",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const footerText = {
  color: "#444840",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "30px",
  fontStyle: "italic",
};

const card = {
  backgroundColor: "#fbf9f5",
  border: "1px solid #e4e2de",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "10px",
};

const itemText = {
  color: "#411f03",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 8px 0",
};

const messageCard = {
  backgroundColor: "#f5f3ef",
  borderLeft: "4px solid #af4d30",
  padding: "16px",
  borderRadius: "4px",
};

const messageText = {
  color: "#444840",
  fontSize: "16px",
  lineHeight: "24px",
  margin: 0,
  whiteSpace: "pre-wrap",
};
