import React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "DealQuary — SaaS Deal Intelligence",
  description: "Multi-deal SaaS subscription calculator (MRR/ARR/Term, discounts, CAC/LTV)."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={robotoMono.variable}>
      <body className="min-h-screen">
        <ErrorBoundary>
          <SessionProvider>
            {children}
            <FeedbackWidget />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
