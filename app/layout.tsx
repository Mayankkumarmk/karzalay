import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Karzalay – India's Startup Sprint Network",
    template: "%s – Karzalay",
  },
  description: "Browse and join high-velocity startup cohorts across Indian cities. Filter by city, find your team, and build fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} ${outfit.variable}`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
