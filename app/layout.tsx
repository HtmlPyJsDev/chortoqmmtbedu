import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHORTOQMMTB — Rasmiy sayt",
  description: "Chortoq tumani maktabgacha va maktab ta'limi bo'limi rasmiy sayti",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
