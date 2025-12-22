import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "SaaS Deal Calculator",
  description: "Multi-deal SaaS subscription calculator (MRR/ARR/Term, discounts, CAC/LTV)."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
