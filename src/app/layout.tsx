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
  title: "Vita Baby | Consultoria Materno-Infantil",
  description:
    "Assessoria especializada em amamentação, banho humanizado, primeiros socorros para bebês e muito mais. Cuidado humanizado para você e sua família.",
  keywords: [
    "amamentação",
    "banho humanizado",
    "consultoria materno infantil",
    "bebê",
    "vitababy",
  ],
  openGraph: {
    title: "Vita Baby | Consultoria Materno-Infantil",
    description:
      "Assessoria especializada em amamentação, banho humanizado e primeiros socorros para bebês.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${libreCaslon.variable} ${hankenGrotesk.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <LoadingScreen />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
