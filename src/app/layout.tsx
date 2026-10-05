import type { Metadata } from "next";
import { Hanken_Grotesk, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://vitababy.com.br",
  ),
  title: {
    default:
      "Vita Baby Assessoria | Cuidado e Acolhimento Materno-Infantil em Macaé e Rio das Ostras",
    template: "%s | Vita Baby",
  },
  description:
    "Assessoria especializada em amamentação, banho humanizado, primeiros socorros para bebês, laserterapia e cuidados materno-infantis na região de Macaé e Rio das Ostras, RJ.",
  keywords: [
    "amamentação",
    "consultoria em amamentação",
    "banho humanizado",
    "consultoria materno infantil",
    "cuidados com recém nascido",
    "laserterapia pós-parto",
    "furo de orelhinha humanizado",
    "macaé",
    "rio das ostras",
    "bebê",
    "vitababy",
    "doula",
    "maternidade",
  ],
  authors: [{ name: "Rayane - Vita Baby" }],
  creator: "Vita Baby",
  publisher: "Vita Baby Assessoria",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Vita Baby | Consultoria Materno-Infantil Especializada",
    description:
      "Assessoria em amamentação, banho humanizado, primeiros socorros e cuidados para mães e bebês em Macaé e região.",
    url: "https://vitababy.com.br",
    siteName: "Vita Baby",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/assets/logo-vita-baby.png",
        width: 604,
        height: 151,
        alt: "Vita Baby Assessoria Materno-Infantil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vita Baby | Consultoria Materno-Infantil",
    description:
      "Amamentação, banho humanizado e laserterapia. Cuidado com amor para seu bebê.",
    images: ["/assets/logo-vita-baby.png"],
  },
  verification: {
    // google: "seu-codigo-aqui" - Quando criar o Google Search Console, adicionar aqui
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Vita Baby Assessoria Materno-Infantil",
    image: "https://vitababy.com.br/assets/logo-vita-baby.png",
    description:
      "Assessoria especializada em amamentação, banho humanizado e cuidados materno-infantis na região de Macaé e Rio das Ostras.",
    url: "https://vitababy.com.br",
    telephone: "+55-22-99999-9999", // Atualizar quando tiver o telefone oficial
    address: {
      "@type": "PostalAddress",
      addressLocality: "Macaé",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    founder: {
      "@type": "Person",
      name: "Rayane",
    },
    sameAs: [
      // Aqui entram os links das redes sociais, se houver
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${libreCaslon.variable} ${hankenGrotesk.variable} scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needs this to inject raw script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <LoadingScreen />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
