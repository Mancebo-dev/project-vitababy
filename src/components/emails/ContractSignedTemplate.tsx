import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ContractSignedTemplateProps {
  clientName: string;
  portalUrl: string;
}

export function ContractSignedTemplate({
  clientName,
  portalUrl,
}: ContractSignedTemplateProps) {
  const firstName = clientName.split(" ")[0];

  return (
    <EmailLayout previewText="Contrato assinado com sucesso">
      <Text style={h1}>Assinatura Concluída!</Text>
      <Text style={text}>
        Obrigado, {firstName}! Sua assinatura digital foi registrada com
        sucesso.
      </Text>

      <Section style={card}>
        <Text style={cardText}>
          Você pode visualizar e baixar a via do seu contrato a qualquer momento
          acessando a Área da Cliente no nosso portal.
        </Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={portalUrl}>
          Acessar Meus Contratos
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
