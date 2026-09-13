import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ContractReadyTemplateProps {
  clientName: string;
  contractUrl: string;
}

export function ContractReadyTemplate({
  clientName,
  contractUrl,
}: ContractReadyTemplateProps) {
  const firstName = clientName.split(" ")[0];

  return (
    <EmailLayout previewText="Seu contrato está pronto para assinatura">
      <Text style={h1}>Seu contrato está pronto!</Text>
      <Text style={text}>
        Olá, {firstName}! O seu contrato de prestação de serviços foi gerado e
        já está disponível para a sua assinatura digital.
      </Text>

      <Section style={card}>
        <Text style={cardText}>
          A assinatura digital possui validade legal e é um procedimento rápido
          e seguro, garantindo maior transparência para o nosso atendimento.
        </Text>
      </Section>

      <Text style={text}>
        Por favor, clique no botão abaixo para ler os termos e realizar a
        assinatura antes do seu atendimento.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={contractUrl}>
          Ler e Assinar Contrato
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
  backgroundColor: "#fbf9f5",
  border: "1px solid #e4e2de",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const cardText = {
  color: "#444840",
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
  backgroundColor: "#411f03",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};
