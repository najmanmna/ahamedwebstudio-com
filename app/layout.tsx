import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TelemetryOverlay } from "@/components/TelemetryOverlay";

// ── FONTS ────────────────────────────────────────────────────────────────────

// Bebas Neue — display / headlines
// Loaded as local font for performance (download from Google Fonts first
// and place at /public/fonts/BebasNeue-Regular.woff2)
const bebas = localFont({
  src: "../public/fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas",
  display: "swap",
  preload: true,
});

// Inter — body copy
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// Space Mono — labels, code, mono elements
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

// ── METADATA ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Ahamed Web Studio | Premium Front-End Execution",
    template: "%s | Ahamed Web Studio",
  },
  description:
    "The silent front-end execution engine for global design agencies and high-ticket founders. Next.js, React, TypeScript — delivered on time, every time.",
  keywords: [
    "frontend developer",
    "next.js developer",
    "react developer",
    "white label frontend",
    "agency frontend partner",
    "saas frontend",
    "web studio sri lanka",
    "ahamed web studio",
  ],
  authors: [{ name: "Ahamed Najman", url: "https://ahamedwebstudio.com" }],
  creator: "Ahamed Web Studio",
  metadataBase: new URL("https://ahamedwebstudio.com"),
  alternates: {
    canonical: "https://ahamedwebstudio.com",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://ahamedwebstudio.com",
    siteName: "Ahamed Web Studio",
    title: "Ahamed Web Studio | Premium Front-End Execution",
    description:
      "The silent front-end execution engine for global design agencies. Next.js · React · TypeScript. Delivered on time.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ahamed Web Studio — Premium Front-End Execution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahamed Web Studio | Premium Front-End Execution",
    description:
      "The silent front-end execution engine for global design agencies.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [
      { url: "/logo-trans.png", type: "image/png" },
    ],
    apple: "/logo-trans.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030303",
};

// ── LAYOUT ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.microlink.io" />
        {/* Calendly widget styles */}
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      </head>
      <body className="antialiased selection:bg-primary/25 selection:text-white font-sans">
        <SmoothScroll>
          <TelemetryOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}