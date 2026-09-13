import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://vitababy.com.br/assets/logo-vita-baby.png"
              width="60"
              height="60"
              alt="Vitababy Logo"
              style={logo}
            />
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Você está recebendo este e-mail porque tem um vínculo com a
              Vitababy.
            </Text>
            <Text style={footerText}>
              Vitababy Consultoria em Amamentação e Cuidados Materno-Infantil.
              <br />
              Brasília, DF, Brasil
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fbf9f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "40px auto",
  backgroundColor: "#ffffff",
  border: "1px solid #e4e2de",
  borderRadius: "12px",
  padding: "40px",
  maxWidth: "600px",
};

const header = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "30px",
};

const logo = {
  display: "block",
  margin: "0 auto",
};

const content = {
  color: "#444840",
  fontSize: "16px",
  lineHeight: "24px",
};

const hr = {
  borderColor: "#e4e2de",
  margin: "30px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#7d7a75",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "10px",
};
