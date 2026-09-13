import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface PasswordUpdatedTemplateProps {
  clientName: string;
}

export function PasswordUpdatedTemplate({
  clientName,
}: PasswordUpdatedTemplateProps) {
  const firstName = clientName.split(" ")[0];
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/login`
    : "http://localhost:3000/portal/login";

  return (
    <EmailLayout previewText="Aviso de Segurança: Senha Atualizada">
      <Text style={h1}>Sua senha foi alterada</Text>
      <Text style={text}>Olá, {firstName}.</Text>
      <Text style={text}>
        Este é um aviso de segurança para confirmar que a senha de acesso à sua
        Área da Cliente Vitababy foi alterada recentemente.
      </Text>

      <Section style={card}>
        <Text style={cardText}>
          Se foi você quem fez essa alteração, nenhuma ação é necessária.
        </Text>
        <Text style={{ ...cardText, marginTop: "10px" }}>
          <strong>Não reconhece essa atividade?</strong> Entre em contato
          conosco imediatamente.
        </Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={loginUrl}>
          Fazer Login no Portal
        </Button>
      </Section>
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
  backgroundColor: "#fdf2f0",
  border: "1px solid #f5c6cb",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const cardText = {
  color: "#af4d30",
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
  backgroundColor: "#444840",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};
