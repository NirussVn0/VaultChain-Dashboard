import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vaultchain.app"),
  title: {
    default: "VaultChain Dashboard",
    template: "%s · VaultChain",
  },
  description:
    "VaultChain Dashboard delivers real-time crypto trading, portfolio intelligence, and AI-assisted insights in a TradingView-grade interface.",
  keywords: [
    "VaultChain",
    "crypto trading",
    "portfolio management",
    "TradingView dashboard",
    "LSTM price prediction",
    "real-time analytics",
  ],
  authors: [{ name: "VaultChain Engineering" }],
  openGraph: {
    title: "VaultChain Dashboard",
    description:
      "Next-generation cryptocurrency intelligence platform with institutional-grade analytics and AI-driven insights.",
    url: "https://vaultchain.app",
    siteName: "VaultChain",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultChain Dashboard",
    description:
      "Execute with precision using real-time market data, AI forecasts, and a TradingView-inspired UX tailored for digital assets.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={cn(
          "relative min-h-dvh bg-background font-sans text-text-primary antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
        data-theme="dark"
      >
        {children}
      </body>
    </html>
  );
}
