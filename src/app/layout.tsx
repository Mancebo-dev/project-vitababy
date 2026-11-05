import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#fbf9f5",
};

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
  alternates: {
    canonical: "/",
  },
  title: {
    default:
      "Vita Baby | Assessoria especializada em cuidados voltados à saúde, recuperação e bem-estar",
    template: "%s | Vita Baby Assessoria",
  },
  description:
    "Assessoria materno-infantil especializada em cuidados voltados à saúde, recuperação e bem-estar.",
  keywords: [
    "assessoria materno infantil",
    "assessoria materno-infantil",
    "cuidados voltados à saúde recuperação e bem-estar",
    "banho humanizado recém nascido",
    "laserterapia pós-parto",
    "furo de orelhinha humanizado",
    "primeiros socorros bebê",
    "enfermeira materno infantil",
    "enfermeira neonatal",
    "cuidados com recém nascido domiciliar",
    "apoio pós-parto e puerpério",
    "Rayane Castro enfermeira",
    "Vita Baby",
    "Vitababy assessoria",
  ],
  category: "Health",
  authors: [
    {
      name: "Rayane Castro - Vita Baby",
      url: "https://vitababy.com.br/#sobre",
    },
  ],
  creator: "Vita Baby Assessoria",
  publisher: "Vita Baby Assessoria Materno-Infantil",
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
    title:
      "Vita Baby | Assessoria especializada em cuidados voltados à saúde, recuperação e bem-estar",
    description:
      "Assessoria materno-infantil especializada em cuidados voltados à saúde, recuperação e bem-estar.",
    url: "https://vitababy.com.br",
    siteName: "Vita Baby Assessoria Materno-Infantil",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/assets/hero-img.png",
        width: 1200,
        height: 630,
        alt: "Vita Baby | Assessoria especializada em cuidados voltados à saúde, recuperação e bem-estar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Vita Baby | Assessoria especializada em cuidados voltados à saúde, recuperação e bem-estar",
    description:
      "Assessoria materno-infantil especializada em cuidados voltados à saúde, recuperação e bem-estar.",
    images: ["/assets/hero-img.png"],
  },
  verification: {
    // google: "seu-codigo-aqui" - Pronto para conectar Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalBusiness", "Organization"],
        "@id": "https://vitababy.com.br/#business",
        name: "Vita Baby Assessoria Materno-Infantil",
        alternateName: ["Vita Baby", "Vitababy", "Vita Baby Assessoria"],
        image: [
          "https://vitababy.com.br/assets/hero-img.png",
          "https://vitababy.com.br/assets/logo-vita-baby.png",
          "https://vitababy.com.br/assets/rayane-about.png",
        ],
        logo: "https://vitababy.com.br/assets/logo-vita-baby.png",
        description:
          "Assessoria materno-infantil especializada em cuidados voltados à saúde, recuperação e bem-estar.",
        url: "https://vitababy.com.br",
        telephone: "+55-22-99772-8581",
        email: "contato@vitababy.com.br",
        priceRange: "$$",
        currenciesAccepted: "BRL",
        paymentAccepted: "Pix, Cartão de Crédito, Transferência Bancária",
        medicalSpecialty: [
          "https://schema.org/Nursing",
          "https://schema.org/Pediatric",
        ],
        founder: {
          "@type": "Person",
          "@id": "https://vitababy.com.br/#rayane-castro",
          name: "Rayane Castro",
          jobTitle: "Enfermeira Especialista em Assessoria Materno-Infantil",
          image: "https://vitababy.com.br/assets/rayane-about.png",
          worksFor: {
            "@id": "https://vitababy.com.br/#business",
          },
          knowsAbout: [
            "Assessoria Materno-Infantil",
            "Cuidados voltados à saúde, recuperação e bem-estar",
            "Banho Humanizado e Ofurô",
            "Laserterapia Pós-Parto",
            "Primeiros Socorros para Bebês",
          ],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "85",
          bestRating: "5",
          worstRating: "1",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Assessoria Materno-Infantil Especializada",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Assessoria Materno-Infantil",
                description:
                  "Assessoria especializada em cuidados voltados à saúde, recuperação e bem-estar da mãe, do bebê e da família.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Banho Humanizado do Bebê e Ofurô",
                description:
                  "Técnica de relaxamento e acolhimento que reproduz o ambiente intrauterino, reduzindo cólicas e estresse neonatal.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Laserterapia Pós-Parto",
                description:
                  "Fotobiomodulação segura para recuperação e cicatrização acelerada no pós-parto.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "EducationalOccupationalProgram",
                name: "Capacitação em Primeiros Socorros para Bebês",
                description:
                  "Treinamento prático de desengasgo (Manobra de Heimlich), RCP pediátrico e prevenção de acidentes para pais e cuidadores.",
              },
            },
          ],
        },
        sameAs: ["https://www.instagram.com/vitababyassessoria/"],
      },
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
