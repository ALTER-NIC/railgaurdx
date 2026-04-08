import type { Metadata } from "next";
import { DM_Sans, Space_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
});

export const metadata: Metadata = {
  title: "RailGuardX — Behavioral Guardrails for AI Agents",
  description:
    "A security checkpoint for AI agents. Check if actions are allowed, log everything, stay in control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceMono.variable} ${bebasNeue.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
