import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Konfigurasi Font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  style: "italic",
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "KKN Pabean Udik 2026",
  description: "Website Resmi KKN Universitas Padjadjaran di Desa Pabean Udik",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* Membungkus aplikasi dengan SmoothScroll (Lenis) */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}