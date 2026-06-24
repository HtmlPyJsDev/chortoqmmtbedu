import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHORTOQMMTB — Rasmiy sayt",
  description: "Chortoq tumani maktabgacha va maktab ta'limi bo'limi rasmiy sayti",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
