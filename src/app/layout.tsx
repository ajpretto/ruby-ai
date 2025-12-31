import type { Metadata } from "next";
import { Crimson_Pro, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ruby AI | AI-Powered Real Estate Investment Analysis",
  description:
    "Find your next flip. Analyze any property in seconds. Ruby AI gives real estate investors the edge with instant valuations, deal analysis, and AI-powered insights.",
  keywords: [
    "real estate investment",
    "property analysis",
    "house flipping",
    "BRRRR",
    "ARV calculator",
    "deal analyzer",
    "real estate AI",
  ],
  openGraph: {
    title: "Ruby AI | AI-Powered Real Estate Investment Analysis",
    description:
      "Find your next flip. Analyze any property in seconds with AI-powered valuations and deal analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${crimsonPro.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
