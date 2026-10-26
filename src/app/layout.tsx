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
      "Vita Baby | Consultoria em Amamentação e Cuidados com o Bebê em Macaé e Rio das Ostras",
    template: "%s | Vita Baby Assessoria",
  },
  description:
    "Assessoria humanizada com enfermeira especialista: amamentação, banho humanizado, laserterapia e primeiros socorros em Macaé e Rio das Ostras. Agende já.",
  keywords: [
    "consultoria em amamentação Macaé",
    "consultoria em amamentação Rio das Ostras",
    "banho humanizado recém nascido",
    "banho de ofurô bebê Macaé",
    "laserterapia fissuras mamilares Macaé",
    "laserterapia pós-parto",
    "furo de orelhinha humanizado Macaé",
    "primeiros socorros bebê engasgo",
    "enfermeira materno infantil Macaé",
    "enfermeira neonatal Rio das Ostras",
    "cuidados com recém nascido domiciliar",
    "apoio pós-parto e puerpério",
    "pega correta amamentação",
    "assessoria materno infantil",
    "Rayane Castro enfermeira",
    "Vita Baby Macaé",
    "Vitababy assessoria",
    "consultoria de sono infantil Macaé",
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
      "Vita Baby | Consultoria em Amamentação e Cuidados com o Bebê em Macaé e Rio das Ostras",
    description:
      "Assessoria humanizada com enfermeira especialista: amamentação, banho humanizado, laserterapia e primeiros socorros em Macaé e região.",
    url: "https://vitababy.com.br",
    siteName: "Vita Baby Assessoria Materno-Infantil",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/assets/hero-img.png",
        width: 1200,
        height: 630,
        alt: "Vita Baby Assessoria Materno-Infantil em Macaé e Rio das Ostras",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vita Baby | Consultoria em Amamentação e Cuidados com o Bebê",
    description:
      "Amamentação, banho humanizado, laserterapia e primeiros socorros para bebês em Macaé e Rio das Ostras.",
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
        "@type": ["MedicalBusiness", "LocalBusiness"],
        "@id": "https://vitababy.com.br/#business",
        name: "Vita Baby Assessoria Materno-Infantil",
        alternateName: ["Vita Baby", "Vitababy Macaé", "Vitababy"],
        image: [
          "https://vitababy.com.br/assets/hero-img.png",
          "https://vitababy.com.br/assets/logo-vita-baby.png",
          "https://vitababy.com.br/assets/rayane-about.png",
        ],
        logo: "https://vitababy.com.br/assets/logo-vita-baby.png",
        description:
          "Assessoria especializada em amamentação, banho humanizado, laserterapia mamilar e capacitação em primeiros socorros para bebês em Macaé, Rio das Ostras e Região dos Lagos.",
        url: "https://vitababy.com.br",
        telephone: "+55-22-99772-8581",
        email: "contato@vitababy.com.br",
        priceRange: "$$",
        currenciesAccepted: "BRL",
        paymentAccepted: "Pix, Cartão de Crédito, Transferência Bancária",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Macaé",
          addressRegion: "RJ",
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-22.3768",
          longitude: "-41.7869",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Macaé",
          },
          {
            "@type": "City",
            name: "Rio das Ostras",
          },
          {
            "@type": "AdministrativeArea",
            name: "Região dos Lagos, RJ",
          },
        ],
        medicalSpecialty: [
          "https://schema.org/Nursing",
          "https://schema.org/Pediatric",
        ],
        founder: {
          "@type": "Person",
          "@id": "https://vitababy.com.br/#rayane-castro",
          name: "Rayane Castro",
          jobTitle: "Enfermeira Especialista em Cuidados Materno-Infantis",
          image: "https://vitababy.com.br/assets/rayane-about.png",
          worksFor: {
            "@id": "https://vitababy.com.br/#business",
          },
          knowsAbout: [
            "Aleitamento Materno",
            "Consultoria em Amamentação",
            "Banho Humanizado e Ofurô",
            "Laserterapia Mamilar e Pós-Parto",
            "Primeiros Socorros e Desengasgo em Bebês",
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
          name: "Serviços e Consultorias Especializadas",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: "Consultoria em Amamentação",
                description:
                  "Apoio técnico no manejo da pega, alívio de dor, ingurgitamento e plano personalizado para o aleitamento materno.",
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
                name: "Laserterapia Pós-Parto e Mamilar",
                description:
                  "Fotobiomodulação segura para cicatrização acelerada de fissuras mamilares, cesárea e lacerações.",
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
