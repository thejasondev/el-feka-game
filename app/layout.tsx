import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegistration } from "@/components/sw-register";
import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://elfeka.vercel.app"),
  title: {
    default: "EL FEKA - Juego del Impostor | Party Game Gratis",
    template: "%s | EL FEKA",
  },
  description:
    "¿Quién es el FEKA? El juego social de engaño y diversión para jugar con tus parceros. Descubre al impostor antes de que sea tarde. ¡Juega gratis sin descargar!",
  keywords: [
    "juego del impostor",
    "party game",
    "juego social",
    "juego gratis",
    "juego sin descargar",
    "juego para fiestas",
    "el feka",
    "impostor game",
    "juego multijugador",
    "juego de palabras",
    "juego para amigos",
    "who is the impostor",
  ],
  authors: [{ name: "thejasondev", url: "https://instagram.com/thejasondev" }],
  creator: "thejasondev",
  publisher: "EL FEKA",
  category: "games",
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
  generator: "Next.js",

  // Open Graph para compartir en redes sociales
  openGraph: {
    title: "EL FEKA - Juego del Impostor",
    description:
      "¿Quién es el FEKA? El juego social de engaño y diversión para jugar con tus parceros.",
    url: "https://elfeka.vercel.app",
    siteName: "EL FEKA",
    images: [
      {
        url: "https://elfeka.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "EL FEKA - Juego del Impostor",
        type: "image/png",
      },
    ],
    locale: "es_ES",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "EL FEKA - Juego del Impostor",
    description: "¿Quién es el FEKA? El juego social de engaño y diversión.",
    images: ["https://elfeka.vercel.app/og-image.png"],
  },

  // Icons - usando los nuevos iconos generados
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // PWA / App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EL FEKA",
  },

  // Manifest para PWA
  manifest: "/manifest.json",

  // Otros meta tags
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1A1A2E" },
    { media: "(prefers-color-scheme: light)", color: "#1A1A2E" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
